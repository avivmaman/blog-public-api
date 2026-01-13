import { Media } from '../models/Media';
import { IMediaDocument } from '../types';

interface PaginationOptions {
  page: number;
  limit: number;
  folder?: string;
}

interface MediaListResult {
  media: IMediaDocument[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const mediaService = {
  // Get all media with pagination
  async getMedia(options: PaginationOptions): Promise<MediaListResult> {
    const { page, limit, folder } = options;
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = {};
    if (folder) {
      query.folder = folder;
    }

    const [media, total] = await Promise.all([
      Media.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Media.countDocuments(query),
    ]);

    return {
      media: media as IMediaDocument[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  // Get media by ID
  async getMediaById(id: string): Promise<IMediaDocument | null> {
    return Media.findById(id).lean() as Promise<IMediaDocument | null>;
  },

  // Get media folders
  async getFolders(): Promise<string[]> {
    const folders = await Media.distinct('folder');
    return folders.filter((f): f is string => f !== null && f !== undefined);
  },
};
