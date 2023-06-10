import { Request, Response } from 'express';
import User from '../models/User';
import { UserType } from '../types/User';
import bcrypt from 'bcrypt';

// @desc Update a user
// @route PATCH /users
// @access Private
export async function updateUser(req: Request, res: Response) {
  try {
    const { username, roles, active, password }: UserType = req.body;
    const { id }: { id: string } = req.body;

    // Validate data
    if (
      !id ||
      !username ||
      !Array.isArray(roles) ||
      roles.length === 0 ||
      typeof active !== 'boolean'
    ) {
      return res.status(400).json({
        success: false,
        code: 400,
        error: {
          message: 'All fields are required',
        },
      });
    }

    // Search user by id
    const user: UserType | null = await User.findById(id).exec();

    if (!user) {
      return res.status(400).json({
        success: false,
        code: 400,
        error: {
          message: 'User not found',
        },
      });
    }

    // Check if existing user
    const existingUser: UserType | null = await User.findOne({ username })
      .lean()
      .exec();

    // Return an error if username is existing
    if (existingUser) {
      return res.status(409).json({
        success: false,
        code: 409,
        error: {
          message: 'Username already exists',
        },
      });
    }

    let hashedPassword: string = '';
    // Check if password is provided
    if (password) {
      // Hash password
      hashedPassword = await bcrypt.hash(password, 10); // salt rounds
    }

    // Wrap user data into an object to pass later as an option
    const userObject: UserType = {
      username,
      // If password is provided, use hashedPassword. Otherwise, use the old password.
      password: password ? hashedPassword : user.password,
      roles,
      active,
    };

    // Try to update the user and pass the value to updatedUser variable
    const updatedUser: UserType | null = await User.findByIdAndUpdate(
      { _id: id },
      userObject,
      {
        new: true,
      }
    ).exec();

    // Return error if failed
    if (!updatedUser) {
      return res.status(400).json({
        success: false,
        code: 400,
        error: {
          message: 'Failed to update the user',
        },
      });
    }

    res.status(200).json({
      success: true,
      code: 200,
      data: {
        message: `${username} has been updated`,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      code: 500,
      error: {
        message: 'An unexpected error occurred',
      },
    });
  }
}
