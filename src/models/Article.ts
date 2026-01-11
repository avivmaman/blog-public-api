import mongoose, { Schema } from 'mongoose';
import { IArticleDocument } from '../types';

const articleSectionSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    level: { type: Number, required: true, min: 1, max: 6 },
  },
  { _id: false }
);

const articleSchema = new Schema<IArticleDocument>(
  {
    title: {
      type: String,
      required: [true, 'Article title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Article slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens'],
    },
    excerpt: {
      type: String,
      required: [true, 'Article excerpt is required'],
      maxlength: [500, 'Excerpt cannot exceed 500 characters'],
    },
    content: {
      type: String,
      required: [true, 'Article content is required'],
    },
    image: {
      type: String,
      required: [true, 'Article image URL is required'],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Article category is required'],
    },
    categoryColor: {
      type: String,
      enum: ['primary', 'secondary', 'accent'],
      default: 'primary',
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'Author',
      required: [true, 'Article author is required'],
    },
    readTime: {
      type: String,
      required: [true, 'Read time is required'],
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
    sections: [articleSectionSchema],
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for common queries
articleSchema.index({ slug: 1 });
articleSchema.index({ category: 1 });
articleSchema.index({ isPublished: 1, publishedAt: -1 });
articleSchema.index({ views: -1 });
articleSchema.index({ tags: 1 });

// Only return published articles by default in queries
articleSchema.pre('find', function () {
  const query = this.getQuery();
  // Only apply filter if not explicitly querying for unpublished
  if (query.isPublished === undefined) {
    this.where({ isPublished: true });
  }
});

articleSchema.pre('findOne', function () {
  const query = this.getQuery();
  if (query.isPublished === undefined) {
    this.where({ isPublished: true });
  }
});

export const Article = mongoose.model<IArticleDocument>('Article', articleSchema);
