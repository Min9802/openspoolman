import AsyncStorage from '@react-native-async-storage/async-storage';

const CONFIG_KEY = '@openspoolman_config';

export interface AppConfig {
  baseUrl: string;
  spoolmanUrl: string;
}

const DEFAULT_CONFIG: AppConfig = {
  baseUrl: 'https://openspoolman.min-services.com',
  spoolmanUrl: 'https://spoolman.min-services.com',
};

export const ConfigService = {
  async getConfig(): Promise<AppConfig> {
    try {
      const config = await AsyncStorage.getItem(CONFIG_KEY);
      return config ? JSON.parse(config) : DEFAULT_CONFIG;
    } catch (error) {
      console.error('Error loading config:', error);
      return DEFAULT_CONFIG;
    }
  },

  async saveConfig(config: AppConfig): Promise<void> {
    try {
      await AsyncStorage.setItem(CONFIG_KEY, JSON.stringify(config));
    } catch (error) {
      console.error('Error saving config:', error);
    }
  },

  async updateBaseUrl(baseUrl: string): Promise<void> {
    const config = await this.getConfig();
    await this.saveConfig({ ...config, baseUrl });
  },

  async updateSpoolmanUrl(spoolmanUrl: string): Promise<void> {
    const config = await this.getConfig();
    await this.saveConfig({ ...config, spoolmanUrl });
  },
};
