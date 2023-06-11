import { Response } from 'express';
import User from '@/models/User';
import { UserType } from '@/types/User';
import bcrypt from 'bcrypt';
import { UserExtendedRequest } from '@/types/UserExtendedRequest';

// @desc Update a user
// @route PATCH /users
// @access Private
export async function updateUser(req: UserExtendedRequest, res: Response) {
  try {
    const { username, roles, active, password }: UserType = req.body;
    const { id }: { id: string } = req.body;

    let hashedPassword: string = '';

    // Check if password is provided
    if (password) {
      // Hash password
      hashedPassword = await bcrypt.hash(password, 10); // salt rounds
    }

    // Use the provided data if available. Otherwise, use the old data.
    const userObject: UserType = {
      username: username ? username : req.username!,
      password: password ? hashedPassword : req.password!,
      roles: roles ? roles : req.roles!,
      // @Todo: Roles changing from true to false, but working from false to true.
      active: active ? active : req.active!,
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
        message: `${userObject.username} has been updated`,
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
