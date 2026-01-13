import mongoose, { Schema } from 'mongoose';
import { IPageDocument } from '../types';

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

const pageSchema = new Schema<IPageDocument>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    content: {
      type: [contentBlockSchema],
      default: [],
    },
    group: {
      type: Schema.Types.ObjectId,
      ref: 'PageGroup',
      index: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
      index: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    seo: {
      type: seoFieldsSchema,
      default: {},
    },
    publishedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-set publishedAt when status changes to published
pageSchema.pre('save', function () {
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
});

export const Page = mongoose.model<IPageDocument>('Page', pageSchema);
