import mongoose, { Schema } from 'mongoose';
import { INavigationDocument, INavItem } from '../types';

const navItemSchema = new Schema<INavItem>(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      trim: true,
    },
    page: {
      type: Schema.Types.ObjectId,
      ref: 'Page',
    },
    target: {
      type: String,
      enum: ['_self', '_blank'],
      default: '_self',
    },
    icon: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    children: {
      type: [this],
      default: [],
    },
  },
  { _id: true }
);

const navigationSchema = new Schema<INavigationDocument>(
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
    items: {
      type: [navItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Navigation = mongoose.model<INavigationDocument>('Navigation', navigationSchema);
