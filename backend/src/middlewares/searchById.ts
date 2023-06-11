import { NextFunction, Response } from 'express';
import User from '@/models/User';
import { UserType } from '@/types/User';
import { UserExtendedRequest } from '@/types/UserExtendedRequest';

export async function searchById(
  req: UserExtendedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    // Find user by id
    const user: UserType | null = await User.findById(req.id).exec();

    // Return error if no user
    if (!user) {
      return res.status(400).json({
        success: false,
        code: 400,
        error: {
          message: 'User not found',
        },
      });
    }

    // Pass the variable(s) to the subsequent middleware(s)
    req.username = user.username;
    req.password = user.password;
    req.roles = user.roles;
    req.active = user.active;

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
