import { Schema, model } from 'mongoose';
import User from './User';
import { autoIncrement } from 'mongoose-plugin-autoinc';

const noteSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: User,
    },
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

noteSchema.plugin(autoIncrement, {
  model: 'Note',
  field: 'ticket',
  id: 'ticketNums',
  startAt: 500,
});

export default model('Note', noteSchema);
