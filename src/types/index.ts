import { Document, Types } from 'mongoose';

// ============================================
// Content Blocks (Rich JSON Content)
// ============================================

export type ContentBlock =
  | { type: 'paragraph'; data: { text: string } }
  | { type: 'heading'; data: { text: string; level: 1 | 2 | 3 | 4 | 5 | 6 } }
  | { type: 'image'; data: { url: string; alt?: string; caption?: string; width?: number; height?: number } }
  | { type: 'code'; data: { code: string; language?: string } }
  | { type: 'quote'; data: { text: string; author?: string } }
  | { type: 'list'; data: { style: 'ordered' | 'unordered'; items: string[] } }
  | { type: 'divider'; data: Record<string, never> }
  | { type: 'embed'; data: { url: string; provider?: string; html?: string } }
  | { type: 'table'; data: { rows: string[][] } }
  | { type: 'callout'; data: { text: string; type: 'info' | 'warning' | 'error' | 'success' } }
  | { type: 'raw'; data: { html: string } };

// ============================================
// SEO Fields
// ============================================

export interface ISEOFields {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
  canonicalUrl?: string;
}

// ============================================
// Page Group
// ============================================

export interface IPageGroup {
  slug: string;
  name: string;
  description?: string;
  order: number;
}

export interface IPageGroupDocument extends IPageGroup, Document {
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Page
// ============================================

export interface IPage {
  slug: string;
  title: string;
  description?: string;
  content: ContentBlock[];
  group?: Types.ObjectId;
  status: 'draft' | 'published';
  order: number;
  seo: ISEOFields;
  publishedAt?: Date;
}

export interface IPageDocument extends IPage, Document {
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Category
// ============================================

export interface ICategory {
  name: string;
  slug: string;
  description: string;
  icon?: string;
  color?: string;
  order: number;
  parent?: Types.ObjectId;
}

export interface ICategoryDocument extends ICategory, Document {
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Tag
// ============================================

export interface ITag {
  slug: string;
  name: string;
  description?: string;
  color?: string;
}

export interface ITagDocument extends ITag, Document {
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Author
// ============================================

export interface IAuthorSocial {
  twitter?: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

export interface IAuthor {
  name: string;
  slug: string;
  email?: string;
  avatar?: string;
  bio?: string;
  role: string;
  social?: IAuthorSocial;
}

export interface IAuthorDocument extends IAuthor, Document {
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Media (Assets)
// ============================================

export interface IMedia {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  alt?: string;
  caption?: string;
  width?: number;
  height?: number;
  folder?: string;
}

export interface IMediaDocument extends IMedia, Document {
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Navigation
// ============================================

export interface INavItem {
  _id?: Types.ObjectId;
  label: string;
  url?: string;
  page?: Types.ObjectId;
  target?: '_self' | '_blank';
  icon?: string;
  order: number;
  children?: INavItem[];
}

export interface INavigation {
  slug: string;
  name: string;
  items: INavItem[];
}

export interface INavigationDocument extends INavigation, Document {
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Site Settings
// ============================================

export type SettingType = 'string' | 'number' | 'boolean' | 'json' | 'image';
export type SettingGroup = 'general' | 'seo' | 'social' | 'appearance' | 'contact' | 'analytics';

export interface ISiteSetting {
  key: string;
  value: unknown;
  type: SettingType;
  group: SettingGroup;
  label: string;
  description?: string;
  isPublic: boolean;
}

export interface ISiteSettingDocument extends ISiteSetting, Document {
  updatedAt: Date;
}

// ============================================
// Article Section (for table of contents)
// ============================================

export interface IArticleSection {
  id: string;
  title: string;
  level: number;
}

// ============================================
// Article
// ============================================

export interface IArticle {
  title: string;
  slug: string;
  excerpt: string;
  content: ContentBlock[];
  contentHtml?: string; // Pre-rendered HTML for performance
  featuredImage?: Types.ObjectId;
  image?: string; // Legacy field - URL string
  category: Types.ObjectId;
  author: Types.ObjectId;
  tags: Types.ObjectId[];
  status: 'draft' | 'published' | 'archived';
  readTime: string;
  views: number;
  isFeatured: boolean;
  seo: ISEOFields;
  sections: IArticleSection[];
  publishedAt?: Date;
}

export interface IArticleDocument extends IArticle, Document {
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Comment
// ============================================

export interface IComment {
  article: Types.ObjectId;
  author: string;
  email?: string;
  avatar?: string;
  content: string;
  status: 'pending' | 'approved' | 'spam';
  likes: number;
  parentId?: Types.ObjectId;
}

export interface ICommentDocument extends IComment, Document {
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// API Response Types
// ============================================

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  meta?: PaginationMeta;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

// ============================================
// Populated Types for API Responses
// ============================================

export interface ArticleWithRelations extends Omit<IArticle, 'category' | 'author' | 'tags' | 'featuredImage'> {
  _id: string;
  category: ICategory & { _id: string };
  author: IAuthor & { _id: string };
  tags: (ITag & { _id: string })[];
  featuredImage?: IMedia & { _id: string };
  createdAt: Date;
  updatedAt: Date;
}

export interface CommentWithReplies {
  _id: string;
  author: string;
  email?: string;
  avatar?: string;
  content: string;
  likes: number;
  replies?: CommentWithReplies[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PageWithGroup extends Omit<IPage, 'group'> {
  _id: string;
  group?: IPageGroup & { _id: string };
  createdAt: Date;
  updatedAt: Date;
}

export interface NavigationWithPages extends Omit<INavigation, 'items'> {
  _id: string;
  items: (Omit<INavItem, 'page' | 'children'> & {
    page?: IPage & { _id: string };
    children?: NavigationWithPages['items'];
  })[];
  createdAt: Date;
  updatedAt: Date;
}
