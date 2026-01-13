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

const seoFieldsSchema = new Schema(
  {
    title: String,
    description: String,
    image: String,
    noIndex: { type: Boolean, default: false },
    canonicalUrl: String,
  },
  { _id: false }
);

const contentBlockSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['paragraph', 'heading', 'image', 'code', 'quote', 'list', 'divider', 'embed', 'table', 'callout', 'raw'],
    },
    data: {
      type: Schema.Types.Mixed,
      required: true,
    },
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
      type: [contentBlockSchema],
      default: [],
    },
    contentHtml: {
      type: String,
      default: '',
    },
    featuredImage: {
      type: Schema.Types.ObjectId,
      ref: 'Media',
    },
    image: {
      type: String,
      trim: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Article category is required'],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'Author',
      required: [true, 'Article author is required'],
    },
    tags: [{
      type: Schema.Types.ObjectId,
      ref: 'Tag',
    }],
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
      index: true,
    },
    readTime: {
      type: String,
      default: '5 min read',
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    seo: {
      type: seoFieldsSchema,
      default: {},
    },
    sections: [articleSectionSchema],
    publishedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for common queries
articleSchema.index({ slug: 1 });
articleSchema.index({ category: 1 });
articleSchema.index({ author: 1 });
articleSchema.index({ status: 1, publishedAt: -1 });
articleSchema.index({ views: -1 });
articleSchema.index({ tags: 1 });
articleSchema.index({ isFeatured: 1 });

// Auto-set publishedAt when status changes to published
articleSchema.pre('save', function () {
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
});

// Only return published articles by default in queries
articleSchema.pre('find', function () {
  const query = this.getQuery();
  // Only apply filter if not explicitly querying for status
  if (query.status === undefined) {
    this.where({ status: 'published' });
  }
});

articleSchema.pre('findOne', function () {
  const query = this.getQuery();
  if (query.status === undefined) {
    this.where({ status: 'published' });
  }
});

// Full-text search index
articleSchema.index({ title: 'text', excerpt: 'text', contentHtml: 'text' });

export const Article = mongoose.model<IArticleDocument>('Article', articleSchema);
