import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './constants';

// Generic storage interface
interface StorageInterface {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
}

// Storage wrapper with error handling
class Storage implements StorageInterface {
  private storage: StorageInterface;

  constructor(storage: StorageInterface = AsyncStorage) {
    this.storage = storage;
  }

  async getItem(key: string): Promise<string | null> {
    try {
      return await this.storage.getItem(key);
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      await this.storage.setItem(key, value);
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await this.storage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
    }
  }

  async clear(): Promise<void> {
    try {
      await this.storage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }

  // JSON helpers
  async getJSON<T>(key: string): Promise<T | null> {
    try {
      const item = await this.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error parsing JSON for key ${key}:`, error);
      return null;
    }
  }

  async setJSON<T>(key: string, value: T): Promise<void> {
    try {
      await this.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error stringifying JSON for key ${key}:`, error);
    }
  }

  // Batch operations
  async getMultiple(keys: string[]): Promise<Record<string, string | null>> {
    const result: Record<string, string | null> = {};
    
    await Promise.all(
      keys.map(async (key) => {
        result[key] = await this.getItem(key);
      })
    );
    
    return result;
  }

  async setMultiple(items: Record<string, string>): Promise<void> {
    await Promise.all(
      Object.entries(items).map(([key, value]) => 
        this.setItem(key, value)
      )
    );
  }

  async removeMultiple(keys: string[]): Promise<void> {
    await Promise.all(
      keys.map(key => this.removeItem(key))
    );
  }
}

// Create storage instance
export const storage = new Storage();

// Specific storage functions for common use cases
export const authStorage = {
  async getToken(): Promise<string | null> {
    return storage.getItem(STORAGE_KEYS.authToken);
  },

  async setToken(token: string): Promise<void> {
    await storage.setItem(STORAGE_KEYS.authToken, token);
  },

  async getRefreshToken(): Promise<string | null> {
    return storage.getItem(STORAGE_KEYS.refreshToken);
  },

  async setRefreshToken(token: string): Promise<void> {
    await storage.setItem(STORAGE_KEYS.refreshToken, token);
  },

  async clearTokens(): Promise<void> {
    await storage.removeMultiple([STORAGE_KEYS.authToken, STORAGE_KEYS.refreshToken]);
  },

  async getUser<T>(): Promise<T | null> {
    return storage.getJSON<T>(STORAGE_KEYS.user);
  },

  async setUser<T>(user: T): Promise<void> {
    await storage.setJSON(STORAGE_KEYS.user, user);
  },

  async clearUser(): Promise<void> {
    await storage.removeItem(STORAGE_KEYS.user);
  },
};

export const settingsStorage = {
  async getTheme(): Promise<'light' | 'dark' | 'system' | null> {
    return storage.getItem(STORAGE_KEYS.theme) as Promise<'light' | 'dark' | 'system' | null>;
  },

  async setTheme(theme: 'light' | 'dark' | 'system'): Promise<void> {
    await storage.setItem(STORAGE_KEYS.theme, theme);
  },

  async getCurrency(): Promise<string | null> {
    return storage.getItem(STORAGE_KEYS.currency);
  },

  async setCurrency(currency: string): Promise<void> {
    await storage.setItem(STORAGE_KEYS.currency, currency);
  },

  async getBiometricEnabled(): Promise<boolean> {
    const value = await storage.getItem(STORAGE_KEYS.biometric);
    return value === 'true';
  },

  async setBiometricEnabled(enabled: boolean): Promise<void> {
    await storage.setItem(STORAGE_KEYS.biometric, enabled.toString());
  },

  async getNotificationsEnabled(): Promise<boolean> {
    const value = await storage.getItem(STORAGE_KEYS.notifications);
    return value !== 'false'; // Default to true
  },

  async setNotificationsEnabled(enabled: boolean): Promise<void> {
    await storage.setItem(STORAGE_KEYS.notifications, enabled.toString());
  },

  async getOnboardingCompleted(): Promise<boolean> {
    const value = await storage.getItem(STORAGE_KEYS.onboarding);
    return value === 'true';
  },

  async setOnboardingCompleted(completed: boolean): Promise<void> {
    await storage.setItem(STORAGE_KEYS.onboarding, completed.toString());
  },
};

// Cache storage with expiration
interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

export const cacheStorage = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const item = await storage.getJSON<CacheItem<T>>(`cache_${key}`);
      
      if (!item) return null;
      
      const now = Date.now();
      if (now > item.timestamp + item.ttl) {
        // Item has expired
        await this.remove(key);
        return null;
      }
      
      return item.data;
    } catch (error) {
      console.error(`Error getting cached item ${key}:`, error);
      return null;
    }
  },

  async set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): Promise<void> {
    try {
      const item: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        ttl,
      };
      
      await storage.setJSON(`cache_${key}`, item);
    } catch (error) {
      console.error(`Error setting cached item ${key}:`, error);
    }
  },

  async remove(key: string): Promise<void> {
    await storage.removeItem(`cache_${key}`);
  },

  async clear(): Promise<void> {
    // This is a simplified implementation
    // In a real app, you might want to track cache keys
    console.warn('Cache clear not fully implemented');
  },
};

// Export default storage instance
export default storage;
