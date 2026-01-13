import mongoose, { Schema } from 'mongoose';
import { ITagDocument } from '../types';

const tagSchema = new Schema<ITagDocument>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Tag = mongoose.model<ITagDocument>('Tag', tagSchema);
