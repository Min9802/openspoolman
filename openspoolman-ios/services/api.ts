import axios from 'axios';
import { ConfigService } from './config';

export interface Spool {
  id: number;
  filament: {
    id: number;
    name: string;
    vendor: {
      name: string;
    };
    material: string;
    color_hex: string;
  };
  remaining_weight: number;
  extra?: {
    tag?: string;
    active_tray?: string;
  };
}

export interface AMSData {
  id: number;
  tray: Array<{
    id: number;
    tray_type: string;
    tray_color: string;
  }>;
}

export const SpoolManAPI = {
  async getSpools(): Promise<Spool[]> {
    try {
      const config = await ConfigService.getConfig();
      const response = await axios.get(`${config.spoolmanUrl}/api/v1/spool`);
      return response.data;
    } catch (error) {
      console.error('Error fetching spools:', error);
      throw error;
    }
  },

  async getSpoolById(id: number): Promise<Spool> {
    try {
      const config = await ConfigService.getConfig();
      const response = await axios.get(`${config.spoolmanUrl}/api/v1/spool/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching spool:', error);
      throw error;
    }
  },

  async getSpoolByTagId(tagId: string): Promise<Spool | null> {
    try {
      const spools = await this.getSpools();
      return spools.find(s => s.extra?.tag === JSON.stringify(tagId)) || null;
    } catch (error) {
      console.error('Error finding spool by tag:', error);
      return null;
    }
  },

  async updateSpoolTag(spoolId: number, tagId: string): Promise<void> {
    try {
      const config = await ConfigService.getConfig();
      await axios.patch(`${config.spoolmanUrl}/api/v1/spool/${spoolId}`, {
        extra: {
          tag: JSON.stringify(tagId),
        },
      });
    } catch (error) {
      console.error('Error updating spool tag:', error);
      throw error;
    }
  },

  async setActiveTray(spoolId: number, amsId: string, trayId: string): Promise<void> {
    try {
      const config = await ConfigService.getConfig();
      const trayUid = JSON.stringify({ ams: amsId, tray: trayId });
      await axios.patch(`${config.spoolmanUrl}/api/v1/spool/${spoolId}`, {
        extra: {
          active_tray: trayUid,
        },
      });
    } catch (error) {
      console.error('Error setting active tray:', error);
      throw error;
    }
  },
};
