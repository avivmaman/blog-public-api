import mongoose, { Schema } from 'mongoose';
import { IMediaDocument } from '../types';

const mediaSchema = new Schema<IMediaDocument>(
  {
    filename: {
      type: String,
      required: true,
      trim: true,
    },
    originalName: {
      type: String,
      required: true,
      trim: true,
    },
    mimeType: {
      type: String,
      required: true,
      trim: true,
    },
    size: {
      type: Number,
      required: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    alt: {
      type: String,
      trim: true,
    },
    caption: {
      type: String,
      trim: true,
    },
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
    folder: {
      type: String,
      trim: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for searching media
mediaSchema.index({ originalName: 'text', alt: 'text', caption: 'text' });

export const Media = mongoose.model<IMediaDocument>('Media', mediaSchema);
