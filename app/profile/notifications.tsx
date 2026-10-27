import React from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Stack } from 'expo-router';
import colors from '@/constants/colors';
import { useNotificationStore } from '@/store/notificationStore';

export default function NotificationSettingsScreen() {
  const { settings, updateSettings } = useNotificationStore();

  const handleToggle = (key: keyof typeof settings) => {
    updateSettings({ [key]: !settings[key] });
  };

  const settingsConfig = [
    {
      title: 'Price Alerts',
      subtitle: 'Get notified when stocks reach your target prices',
      key: 'priceAlerts' as const,
    },
    {
      title: 'Trade Notifications',
      subtitle: 'Notifications for buy/sell order executions',
      key: 'tradeNotifications' as const,
    },
    {
      title: 'News Updates',
      subtitle: 'Market news and stock-related updates',
      key: 'newsUpdates' as const,
    },
    {
      title: 'System Notifications',
      subtitle: 'App updates and system messages',
      key: 'systemNotifications' as const,
    },
  ];

  const deliveryConfig = [
    {
      title: 'Push Notifications',
      subtitle: 'Receive notifications on your device',
      key: 'pushNotifications' as const,
    },
    {
      title: 'Email Notifications',
      subtitle: 'Receive notifications via email',
      key: 'emailNotifications' as const,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Notifications' }} />
      
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Types</Text>
          <View style={styles.settingsCard}>
            {settingsConfig.map((setting, index) => (
              <View key={setting.key}>
                <View style={styles.settingItem}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingTitle}>{setting.title}</Text>
                    <Text style={styles.settingSubtitle}>{setting.subtitle}</Text>
                  </View>
                  <Switch
                    value={settings[setting.key]}
                    onValueChange={() => handleToggle(setting.key)}
                    trackColor={{ false: colors.border, true: colors.primary }}
                    thumbColor="white"
                  />
                </View>
                {index < settingsConfig.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Method</Text>
          <View style={styles.settingsCard}>
            {deliveryConfig.map((setting, index) => (
              <View key={setting.key}>
                <View style={styles.settingItem}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingTitle}>{setting.title}</Text>
                    <Text style={styles.settingSubtitle}>{setting.subtitle}</Text>
                  </View>
                  <Switch
                    value={settings[setting.key]}
                    onValueChange={() => handleToggle(setting.key)}
                    trackColor={{ false: colors.border, true: colors.primary }}
                    thumbColor="white"
                  />
                </View>
                {index < deliveryConfig.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoText}>
            You can customize your notification preferences here. Changes will take effect immediately.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  settingsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
    color: colors.secondaryText,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 16,
  },
  infoSection: {
    marginTop: 32,
    marginBottom: 32,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
  },
  infoText: {
    fontSize: 14,
    color: colors.secondaryText,
    textAlign: 'center',
    lineHeight: 20,
  },
});