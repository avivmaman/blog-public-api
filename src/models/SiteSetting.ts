import mongoose, { Schema } from 'mongoose';
import { ISiteSettingDocument } from '../types';

const siteSettingSchema = new Schema<ISiteSettingDocument>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    value: {
      type: Schema.Types.Mixed,
      required: true,
    },
    type: {
      type: String,
      enum: ['string', 'number', 'boolean', 'json', 'image'],
      default: 'string',
    },
    group: {
      type: String,
      enum: ['general', 'seo', 'social', 'appearance', 'contact', 'analytics'],
      default: 'general',
      index: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const SiteSetting = mongoose.model<ISiteSettingDocument>('SiteSetting', siteSettingSchema);
