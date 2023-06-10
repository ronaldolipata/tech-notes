import { Request, Response } from 'express';
import User from '../models/User';
import Note from '../models/Note';
import { UserType } from '../types/User';
import { NoteType } from '../types/Note';

// @desc Delete a user
// @route DELETE /users
// @access Private
export async function deleteUser(req: Request, res: Response) {
  try {
    const { id }: { id: string } = req.body;

    // Validate data
    if (!id) {
      return res.status(400).json({
        success: false,
        code: 400,
        error: {
          message: 'User ID is required',
        },
      });
    }

    // Check if there are assigned notes from the user based on ID
    const note: NoteType | null = await Note.findOne({ user: id })
      .lean()
      .exec();

    // Return error if there are assigned notes
    if (note) {
      return res.status(400).json({
        success: false,
        code: 400,
        error: {
          message: 'User has assigned notes',
        },
      });
    }

    // Find user by id
    const user: UserType | null = await User.findById(id).exec();

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

    // Delete user by id
    await User.deleteOne({ _id: id });

    res.status(200).json({
      success: true,
      code: 200,
      data: {
        message: `${user.username} has been deleted`,
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
