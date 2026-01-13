import { Navigation } from '../models/Navigation';
import { INavigationDocument } from '../types';

export const navigationService = {
  // Get all navigation menus
  async getNavigations(): Promise<INavigationDocument[]> {
    return Navigation.find()
      .populate({
        path: 'items.page',
        select: 'slug title',
      })
      .populate({
        path: 'items.children.page',
        select: 'slug title',
      })
      .lean() as Promise<INavigationDocument[]>;
  },

  // Get navigation by slug
  async getNavigationBySlug(slug: string): Promise<INavigationDocument | null> {
    return Navigation.findOne({ slug })
      .populate({
        path: 'items.page',
        select: 'slug title',
      })
      .populate({
        path: 'items.children.page',
        select: 'slug title',
      })
      .lean() as Promise<INavigationDocument | null>;
  },
};
