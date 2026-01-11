import mongoose, { Schema } from 'mongoose';
import { ICommentDocument } from '../types';

const commentSchema = new Schema<ICommentDocument>(
  {
    article: {
      type: Schema.Types.ObjectId,
      ref: 'Article',
      required: [true, 'Article reference is required'],
    },
    author: {
      type: String,
      required: [true, 'Comment author name is required'],
      trim: true,
      maxlength: [100, 'Author name cannot exceed 100 characters'],
    },
    avatar: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      trim: true,
      maxlength: [2000, 'Comment cannot exceed 2000 characters'],
    },
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for common queries
commentSchema.index({ article: 1, createdAt: -1 });
commentSchema.index({ parentId: 1 });

export const Comment = mongoose.model<ICommentDocument>('Comment', commentSchema);
