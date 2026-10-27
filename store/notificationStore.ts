import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'price_alert' | 'trade' | 'news' | 'system';
  timestamp: string;
  read: boolean;
  stockSymbol?: string;
}

interface NotificationSettings {
  priceAlerts: boolean;
  tradeNotifications: boolean;
  newsUpdates: boolean;
  systemNotifications: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
}

interface NotificationState {
  notifications: Notification[];
  settings: NotificationSettings;
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  updateSettings: (settings: Partial<NotificationSettings>) => void;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Price Alert',
    message: 'AAPL has reached your target price of $250.00',
    type: 'price_alert',
    timestamp: '2024-01-15T10:30:00Z',
    read: false,
    stockSymbol: 'AAPL',
  },
  {
    id: '2',
    title: 'Trade Executed',
    message: 'Your buy order for 5 shares of AAPL has been executed',
    type: 'trade',
    timestamp: '2024-01-15T09:15:00Z',
    read: false,
    stockSymbol: 'AAPL',
  },
  {
    id: '3',
    title: 'Market News',
    message: 'Apple announces new product launch event',
    type: 'news',
    timestamp: '2024-01-14T16:45:00Z',
    read: true,
    stockSymbol: 'AAPL',
  },
  {
    id: '4',
    title: 'System Update',
    message: 'New features available in the app',
    type: 'system',
    timestamp: '2024-01-14T12:00:00Z',
    read: true,
  },
];

const defaultSettings: NotificationSettings = {
  priceAlerts: true,
  tradeNotifications: true,
  newsUpdates: true,
  systemNotifications: true,
  pushNotifications: true,
  emailNotifications: false,
};

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: mockNotifications,
      settings: defaultSettings,
      unreadCount: mockNotifications.filter(n => !n.read).length,
      
      addNotification: (notificationData) => {
        const newNotification: Notification = {
          ...notificationData,
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          read: false,
        };
        
        const updatedNotifications = [newNotification, ...get().notifications];
        
        set({
          notifications: updatedNotifications,
          unreadCount: updatedNotifications.filter(n => !n.read).length,
        });
      },
      
      markAsRead: (id) => {
        const updatedNotifications = get().notifications.map(n => 
          n.id === id ? { ...n, read: true } : n
        );
        
        set({
          notifications: updatedNotifications,
          unreadCount: updatedNotifications.filter(n => !n.read).length,
        });
      },
      
      markAllAsRead: () => {
        const updatedNotifications = get().notifications.map(n => ({ ...n, read: true }));
        
        set({
          notifications: updatedNotifications,
          unreadCount: 0,
        });
      },
      
      deleteNotification: (id) => {
        const updatedNotifications = get().notifications.filter(n => n.id !== id);
        
        set({
          notifications: updatedNotifications,
          unreadCount: updatedNotifications.filter(n => !n.read).length,
        });
      },
      
      updateSettings: (newSettings) => {
        set({
          settings: { ...get().settings, ...newSettings },
        });
      },
    }),
    {
      name: 'notification-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);