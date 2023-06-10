import { Request, Response } from 'express';
import User from '../models/User';
import { UserType } from '../types/User';

// @desc Get all users
// @route GET /users
// @access Private
export async function getAllUsers(_: Request, res: Response) {
  try {
    const users: UserType[] = await User.find().select('-password').lean();

    if (!users?.length) {
      return res.status(400).json({
        success: false,
        code: 400,
        error: {
          message: 'No users found',
        },
      });
    }

    res.status(200).json({
      success: true,
      code: 200,
      data: { message: 'Users successfully retrieved', users },
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
