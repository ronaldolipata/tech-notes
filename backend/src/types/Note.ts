import { Types } from 'mongoose';

export type NoteType = {
  user: Types.ObjectId;
  text: string;
  title: string;
  completed: boolean;
};
