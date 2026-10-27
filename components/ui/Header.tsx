import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell, Menu, Search } from 'lucide-react-native';
import colors from '@/constants/colors';
import Avatar from '@/components/common/Avatar';
import BackButton from '@/components/common/BackButton';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showAvatar?: boolean;
  showNotifications?: boolean;
  showSearch?: boolean;
  showMenu?: boolean;
  onAvatarPress?: () => void;
  onNotificationPress?: () => void;
  onSearchPress?: () => void;
  onMenuPress?: () => void;
  rightComponent?: React.ReactNode;
  leftComponent?: React.ReactNode;
}

export default function Header({
  title,
  showBack = false,
  showAvatar = false,
  showNotifications = false,
  showSearch = false,
  showMenu = false,
  onAvatarPress,
  onNotificationPress,
  onSearchPress,
  onMenuPress,
  rightComponent,
  leftComponent,
}: HeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        {/* Left Side */}
        <View style={styles.leftSection}>
          {leftComponent || (
            <>
              {showBack && <BackButton />}
              {showMenu && (
                <TouchableOpacity onPress={onMenuPress} style={styles.iconButton}>
                  <Menu size={24} color={colors.text} />
                </TouchableOpacity>
              )}
            </>
          )}
        </View>

        {/* Center */}
        <View style={styles.centerSection}>
          {title && <Text style={styles.title}>{title}</Text>}
        </View>

        {/* Right Side */}
        <View style={styles.rightSection}>
          {rightComponent || (
            <>
              {showSearch && (
                <TouchableOpacity onPress={onSearchPress} style={styles.iconButton}>
                  <Search size={24} color={colors.text} />
                </TouchableOpacity>
              )}
              
              {showNotifications && (
                <TouchableOpacity onPress={onNotificationPress} style={styles.iconButton}>
                  <Bell size={24} color={colors.text} />
                </TouchableOpacity>
              )}
              
              {showAvatar && (
                <Avatar
                  name="John Doe"
                  size={32}
                  onPress={onAvatarPress}
                />
              )}
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 56,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  centerSection: {
    flex: 2,
    alignItems: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
  },
});