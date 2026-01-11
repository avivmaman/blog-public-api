import mongoose, { Schema } from 'mongoose';
import { ICategoryDocument } from '../types';

const categorySchema = new Schema<ICategoryDocument>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: [50, 'Category name cannot exceed 50 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Category slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens'],
    },
    description: {
      type: String,
      required: [true, 'Category description is required'],
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    icon: {
      type: String,
      required: [true, 'Category icon is required'],
    },
    gradient: {
      type: String,
      required: true,
    },
    accentClass: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast slug lookups
categorySchema.index({ slug: 1 });

export const Category = mongoose.model<ICategoryDocument>('Category', categorySchema);
