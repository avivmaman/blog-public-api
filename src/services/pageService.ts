import { Page } from '../models/Page';
import { PageGroup } from '../models/PageGroup';
import { IPageDocument, IPageGroupDocument } from '../types';

export const pageService = {
  // Get all published pages
  async getPages(): Promise<IPageDocument[]> {
    return Page.find({ status: 'published' })
      .populate('group', 'slug name')
      .sort({ order: 1 })
      .lean() as Promise<IPageDocument[]>;
  },

  // Get page by slug
  async getPageBySlug(slug: string): Promise<IPageDocument | null> {
    return Page.findOne({ slug, status: 'published' })
      .populate('group', 'slug name')
      .lean() as Promise<IPageDocument | null>;
  },

  // Get pages by group slug
  async getPagesByGroup(groupSlug: string): Promise<IPageDocument[]> {
    const group = await PageGroup.findOne({ slug: groupSlug }).lean();
    if (!group) return [];

    return Page.find({ group: group._id, status: 'published' })
      .populate('group', 'slug name')
      .sort({ order: 1 })
      .lean() as Promise<IPageDocument[]>;
  },

  // Get all page groups
  async getPageGroups(): Promise<IPageGroupDocument[]> {
    return PageGroup.find()
      .sort({ order: 1 })
      .lean() as Promise<IPageGroupDocument[]>;
  },

  // Get page group by slug with its pages
  async getPageGroupBySlug(slug: string): Promise<{ group: IPageGroupDocument; pages: IPageDocument[] } | null> {
    const group = await PageGroup.findOne({ slug }).lean() as IPageGroupDocument | null;
    if (!group) return null;

    const pages = await Page.find({ group: group._id, status: 'published' })
      .sort({ order: 1 })
      .lean() as IPageDocument[];

    return { group, pages };
  },
};
