import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  ViewStyle,
} from 'react-native';
import colors from '@/constants/colors';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
  animated?: boolean;
}

export default function Skeleton({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
  animated = true,
}: SkeletonProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animated) return;

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [animated, animatedValue]);

  const backgroundColor = animated
    ? animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [colors.surface, colors.border],
      })
    : colors.surface;

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          backgroundColor,
        },
        style,
      ]}
    />
  );
}

// Predefined skeleton components
export function SkeletonText({ lines = 1, style }: { lines?: number; style?: ViewStyle }) {
  return (
    <View style={[styles.textContainer, style]}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          height={16}
          width={index === lines - 1 ? '70%' : '100%'}
          style={index > 0 && styles.textLine}
        />
      ))}
    </View>
  );
}

export function SkeletonCard({ style }: { style?: ViewStyle }) {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.cardHeader}>
        <Skeleton width={40} height={40} borderRadius={20} />
        <View style={styles.cardHeaderText}>
          <Skeleton width="60%" height={16} />
          <Skeleton width="40%" height={12} style={styles.cardSubtext} />
        </View>
      </View>
      <SkeletonText lines={3} style={styles.cardContent} />
    </View>
  );
}

export function SkeletonList({ 
  items = 5, 
  itemHeight = 60, 
  style 
}: { 
  items?: number; 
  itemHeight?: number; 
  style?: ViewStyle;
}) {
  return (
    <View style={[styles.list, style]}>
      {Array.from({ length: items }).map((_, index) => (
        <View key={index} style={[styles.listItem, { height: itemHeight }]}>
          <Skeleton width={40} height={40} borderRadius={20} />
          <View style={styles.listItemContent}>
            <Skeleton width="70%" height={16} />
            <Skeleton width="50%" height={12} style={styles.listItemSubtext} />
          </View>
          <Skeleton width={60} height={16} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.surface,
  },
  textContainer: {
    gap: 8,
  },
  textLine: {
    marginTop: 8,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardHeaderText: {
    marginLeft: 12,
    flex: 1,
  },
  cardSubtext: {
    marginTop: 4,
  },
  cardContent: {
    marginTop: 8,
  },
  list: {
    gap: 12,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  listItemContent: {
    flex: 1,
    marginLeft: 12,
  },
  listItemSubtext: {
    marginTop: 4,
  },
});