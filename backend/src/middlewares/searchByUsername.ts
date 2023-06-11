import { NextFunction, Request, Response } from 'express';
import User from '@/models/User';
import { UserType } from '@/types/User';

export async function searchByUsername(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { username }: UserType = req.body;

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

    next();
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
