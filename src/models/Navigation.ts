import mongoose, { Schema } from 'mongoose';
import { INavigationDocument } from '../types';

// Define nav item schema as a plain object first
const navItemSchemaDefinition = {
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
    type: Array,
    default: [],
  },
};

const navItemSchema = new Schema(navItemSchemaDefinition, { _id: true });

// Add self-reference for children after schema is created
navItemSchema.add({
  children: {
    type: [navItemSchema],
    default: [],
  },
});

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
