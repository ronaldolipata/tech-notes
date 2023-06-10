import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
import { UserType } from '../types/User';

// @desc Create a new user
// @route POST /users
// @access Private
export async function createNewUser(req: Request, res: Response) {
  try {
    const { username, password, roles }: UserType = req.body;

    // Validate data
    if (!username || !password || !Array.isArray(roles) || roles.length === 0) {
      return res.status(400).json({
        success: false,
        code: 400,
        error: {
          message: 'All fields are required',
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

    // Hash the password
    const hashedPassword: string = await bcrypt.hash(password, 10); // salt rounds
    const userObject: UserType = {
      username,
      password: hashedPassword,
      roles,
      // Set the default value explicitly to avoid error from the type as it is required
      active: true,
    };

    // Create and store new user
    const user: UserType = await User.create(userObject);

    // Return error if failed
    if (!user) {
      return res.status(400).json({
        success: false,
        code: 400,
        error: {
          message: 'Failed to create the user',
        },
      });
    }

    res.status(201).json({
      success: true,
      code: 201,
      data: {
        message: `New user of ${username} has been created`,
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
