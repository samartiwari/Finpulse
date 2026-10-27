import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import colors from '@/constants/colors';

interface BadgeProps {
  count?: number;
  text?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium' | 'large';
  dot?: boolean;
  showZero?: boolean;
  max?: number;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Badge({
  count,
  text,
  variant = 'error',
  size = 'medium',
  dot = false,
  showZero = false,
  max = 99,
  style,
  textStyle,
}: BadgeProps) {
  // Don't render if count is 0 and showZero is false
  if (count === 0 && !showZero && !text && !dot) {
    return null;
  }

  // Don't render if count is undefined/null and no text
  if (count === undefined && count === null && !text && !dot) {
    return null;
  }

  const displayText = text || (count !== undefined && count !== null ? 
    (count > max ? `${max}+` : count.toString()) : '');

  const badgeStyle = [
    styles.badge,
    styles[variant],
    styles[size],
    dot && styles.dot,
    style,
  ];

  const badgeTextStyle = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    textStyle,
  ];

  return (
    <View style={badgeStyle}>
      {!dot && displayText && (
        <Text style={badgeTextStyle}>{displayText}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    minWidth: 20,
  },
  
  // Variants
  default: {
    backgroundColor: colors.secondaryText,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  success: {
    backgroundColor: colors.success,
  },
  warning: {
    backgroundColor: colors.warning,
  },
  error: {
    backgroundColor: colors.error,
  },
  
  // Sizes
  small: {
    minWidth: 16,
    height: 16,
    borderRadius: 8,
  },
  medium: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
  },
  large: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
  },
  
  // Dot variant
  dot: {
    width: 8,
    height: 8,
    minWidth: 8,
    borderRadius: 4,
  },
  
  // Text styles
  text: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
  defaultText: {
    color: 'white',
  },
  primaryText: {
    color: 'white',
  },
  successText: {
    color: 'white',
  },
  warningText: {
    color: 'white',
  },
  errorText: {
    color: 'white',
  },
  
  // Size text styles
  smallText: {
    fontSize: 10,
    paddingHorizontal: 4,
  },
  mediumText: {
    fontSize: 12,
    paddingHorizontal: 6,
  },
  largeText: {
    fontSize: 14,
    paddingHorizontal: 8,
  },
});