import React from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { Bell } from 'lucide-react-native';
import { router } from 'expo-router';
import colors from '@/constants/colors';
import { useNotificationStore } from '@/store/notificationStore';

interface NotificationIconProps {
  onPress?: () => void;
}

export default function NotificationIcon({ onPress }: NotificationIconProps) {
  const unreadCount = useNotificationStore(state => state.unreadCount);

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push('/notifications');
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <Bell size={24} color={colors.text} />
      {unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    padding: 8,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
});