import { Response } from 'express';
import User from '@/models/User';
import Note from '@/models/Note';
import { NoteType } from '@/types/Note';
import { UserExtendedRequest } from '@/types/UserExtendedRequest';

// @desc Delete a user
// @route DELETE /users
// @access Private
export async function deleteUser(req: UserExtendedRequest, res: Response) {
  try {
    // Check if there are assigned notes from the user based on ID
    const note: NoteType | null = await Note.findOne({ user: req.id })
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

    // Delete user by id
    await User.deleteOne({ _id: req.id });

    res.status(200).json({
      success: true,
      code: 200,
      data: {
        message: `${req.username} has been deleted`,
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
