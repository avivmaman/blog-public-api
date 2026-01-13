import mongoose, { Schema } from 'mongoose';
import { IPageGroupDocument } from '../types';

const pageGroupSchema = new Schema<IPageGroupDocument>(
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
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const PageGroup = mongoose.model<IPageGroupDocument>('PageGroup', pageGroupSchema);
