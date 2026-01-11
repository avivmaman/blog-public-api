import { Comment } from '../models/Comment';
import { Article } from '../models/Article';
import { CommentWithReplies, ICommentDocument } from '../types';
import { Types } from 'mongoose';

export const commentService = {
  async getCommentsByArticleSlug(slug: string): Promise<CommentWithReplies[]> {
    // First find the article by slug
    const article = await Article.findOne({ slug }).lean();

    if (!article) {
      return [];
    }

    // Get all comments for this article
    const comments = await Comment.find({ article: article._id })
      .sort({ createdAt: -1 })
      .lean();

    // Build nested comment structure
    const commentMap = new Map<string, CommentWithReplies>();
    const rootComments: CommentWithReplies[] = [];

    // First pass: create map of all comments
    comments.forEach((comment) => {
      const commentWithReplies: CommentWithReplies = {
        _id: (comment._id as Types.ObjectId).toString(),
        author: comment.author,
        avatar: comment.avatar,
        content: comment.content,
        likes: comment.likes,
        replies: [],
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
      };
      commentMap.set((comment._id as Types.ObjectId).toString(), commentWithReplies);
    });

    // Second pass: build tree structure
    comments.forEach((comment) => {
      const commentWithReplies = commentMap.get((comment._id as Types.ObjectId).toString())!;

      if (comment.parentId) {
        const parent = commentMap.get(comment.parentId.toString());
        if (parent) {
          parent.replies = parent.replies || [];
          parent.replies.push(commentWithReplies);
        }
      } else {
        rootComments.push(commentWithReplies);
      }
    });

    // Sort replies by createdAt (oldest first for replies)
    rootComments.forEach((comment) => {
      if (comment.replies) {
        comment.replies.sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      }
    });

    return rootComments;
  },

  async getCommentCount(articleSlug: string): Promise<number> {
    const article = await Article.findOne({ slug: articleSlug }).lean();

    if (!article) {
      return 0;
    }

    return Comment.countDocuments({ article: article._id });
  },
};
