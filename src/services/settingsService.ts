import { SiteSetting } from '../models/SiteSetting';
import { ISiteSettingDocument, SettingGroup } from '../types';

export const settingsService = {
  // Get all public settings
  async getPublicSettings(): Promise<ISiteSettingDocument[]> {
    return SiteSetting.find({ isPublic: true })
      .select('-isPublic')
      .lean() as Promise<ISiteSettingDocument[]>;
  },

  // Get setting by key
  async getSettingByKey(key: string): Promise<ISiteSettingDocument | null> {
    return SiteSetting.findOne({ key, isPublic: true })
      .select('-isPublic')
      .lean() as Promise<ISiteSettingDocument | null>;
  },

  // Get settings by group
  async getSettingsByGroup(group: SettingGroup): Promise<ISiteSettingDocument[]> {
    return SiteSetting.find({ group, isPublic: true })
      .select('-isPublic')
      .lean() as Promise<ISiteSettingDocument[]>;
  },

  // Get settings as key-value object
  async getSettingsObject(): Promise<Record<string, unknown>> {
    const settings = await SiteSetting.find({ isPublic: true }).lean();
    return settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, unknown>);
  },
};
