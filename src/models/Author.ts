import mongoose, { Schema } from 'mongoose';
import { IAuthorDocument } from '../types';

const authorSchema = new Schema<IAuthorDocument>(
  {
    name: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true,
      maxlength: [100, 'Author name cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Author slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens'],
    },
    avatar: {
      type: String,
      required: [true, 'Author avatar URL is required'],
    },
    role: {
      type: String,
      required: [true, 'Author role is required'],
      maxlength: [100, 'Role cannot exceed 100 characters'],
    },
    bio: {
      type: String,
      maxlength: [1000, 'Bio cannot exceed 1000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast slug lookups
authorSchema.index({ slug: 1 });

export const Author = mongoose.model<IAuthorDocument>('Author', authorSchema);
