import { Document, Types } from 'mongoose';

// Category
export interface ICategory {
  name: string;
  slug: string;
  description: string;
  icon: string;
  gradient: string;
  accentClass: string;
}

export interface ICategoryDocument extends ICategory, Document {
  createdAt: Date;
  updatedAt: Date;
}

// Author
export interface IAuthor {
  name: string;
  slug: string;
  avatar: string;
  role: string;
  bio?: string;
}

export interface IAuthorDocument extends IAuthor, Document {
  createdAt: Date;
  updatedAt: Date;
}

// Article Section (for table of contents)
export interface IArticleSection {
  id: string;
  title: string;
  level: number;
}

// Article
export interface IArticle {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: Types.ObjectId;
  categoryColor: 'primary' | 'secondary' | 'accent';
  author: Types.ObjectId;
  readTime: string;
  views: number;
  isPublished: boolean;
  publishedAt: Date;
  sections: IArticleSection[];
  tags: string[];
}

export interface IArticleDocument extends IArticle, Document {
  createdAt: Date;
  updatedAt: Date;
}

// Comment
export interface IComment {
  article: Types.ObjectId;
  author: string;
  avatar: string;
  content: string;
  likes: number;
  parentId?: Types.ObjectId;
}

export interface ICommentDocument extends IComment, Document {
  createdAt: Date;
  updatedAt: Date;
}

// API Response types
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
  error?: string;
}

// Populated types for API responses
export interface ArticleWithRelations extends Omit<IArticle, 'category' | 'author'> {
  _id: string;
  category: ICategory & { _id: string };
  author: IAuthor & { _id: string };
  createdAt: Date;
  updatedAt: Date;
}

export interface CommentWithReplies extends Omit<IComment, 'article' | 'parentId'> {
  _id: string;
  replies?: CommentWithReplies[];
  createdAt: Date;
  updatedAt: Date;
}
