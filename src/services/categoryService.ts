import { Category } from '../models/Category';
import { Article } from '../models/Article';
import { Types } from 'mongoose';

interface CategoryWithCount {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  color?: string;
  order: number;
  articleCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export const categoryService = {
  async getAllCategories(): Promise<CategoryWithCount[]> {
    const categories = await Category.find().sort({ order: 1 }).lean();

    // Get article counts for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const articleCount = await Article.countDocuments({ category: category._id, status: 'published' });
        return {
          _id: category._id,
          name: category.name,
          slug: category.slug,
          description: category.description,
          icon: category.icon,
          color: category.color,
          order: category.order,
          articleCount,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt,
        } as CategoryWithCount;
      })
    );

    return categoriesWithCounts;
  },

  async getCategoryBySlug(slug: string): Promise<CategoryWithCount | null> {
    const category = await Category.findOne({ slug }).lean();

    if (!category) {
      return null;
    }

    const articleCount = await Article.countDocuments({ category: category._id, status: 'published' });

    return {
      _id: category._id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      icon: category.icon,
      color: category.color,
      order: category.order,
      articleCount,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    } as CategoryWithCount;
  },
};
