import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { User } from 'lucide-react-native';
import colors from '@/constants/colors';

interface AvatarProps {
  source?: string;
  name?: string;
  size?: number;
  onPress?: () => void;
  style?: any;
}

export default function Avatar({
  source,
  name,
  size = 40,
  onPress,
  style,
}: AvatarProps) {
  const getInitials = (fullName?: string) => {
    if (!fullName) return '';
    return fullName
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const avatarStyle = [
    styles.avatar,
    { width: size, height: size, borderRadius: size / 2 },
    style,
  ];

  const textStyle = [
    styles.initials,
    { fontSize: size * 0.4 },
  ];

  const content = (
    <View style={avatarStyle}>
      {source ? (
        <Image
          source={{ uri: source }}
          style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
        />
      ) : name ? (
        <Text style={textStyle}>{getInitials(name)}</Text>
      ) : (
        <User size={size * 0.6} color={colors.secondaryText} />
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} style={style}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: {
    resizeMode: 'cover',
  },
  initials: {
    color: colors.text,
    fontWeight: '600',
  },
});