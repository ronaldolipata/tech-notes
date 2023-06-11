import { NextFunction, Response } from 'express';
import { Types } from 'mongoose';
import { UserExtendedRequest } from '@/types/UserExtendedRequest';

export async function objectIdValidation(
  req: UserExtendedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { id }: { id: string } = req.body;

    // Check if id is provided
    if (!id) {
      return res.status(400).json({
        success: false,
        code: 400,
        error: {
          message: 'User ID is required',
        },
      });
    }

    // Check if ObjectId is valid
    if (!Types.ObjectId.isValid(id)) {
      return res.status(422).json({
        success: false,
        code: 422,
        error: {
          message: 'Invalid Object ID',
        },
      });
    }

    // Pass the variable(s) to the subsequent middleware(s)
    req.id = id;

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
