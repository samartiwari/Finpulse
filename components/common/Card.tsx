import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import colors from '@/constants/colors';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: number;
  margin?: number;
  shadow?: boolean;
}

export default function Card({
  children,
  style,
  padding = 16,
  margin = 0,
  shadow = true,
}: CardProps) {
  const cardStyle = [
    styles.card,
    shadow && styles.shadow,
    { padding, margin },
    style,
  ];

  return (
    <View style={cardStyle}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
});