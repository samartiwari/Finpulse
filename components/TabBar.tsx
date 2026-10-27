import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Home, PieChart, TrendingUp, Repeat, User, Clock } from 'lucide-react-native';
import colors from '@/constants/colors';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Platform } from 'react-native';

const { width } = Dimensions.get('window');
const TAB_WIDTH = width / 5;

interface TabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export default function TabBar({ state, descriptors, navigation }: TabBarProps) {
  const router = useRouter();
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withSpring(state.index * TAB_WIDTH);
  }, [state.index, translateX]);

  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  // Skip animation on web to avoid layout issues
  const shouldAnimate = Platform.OS !== 'web';

  const getIcon = (routeName: string, isFocused: boolean) => {
    const color = isFocused ? colors.primary : '#8E8E93';
    const size = 22;

    switch (routeName) {
      case 'index':
        return <Home size={size} color={color} />;
      case 'portfolio':
        return <PieChart size={size} color={color} />;
      case 'trading':
        return <TrendingUp size={size} color={color} />;
      case 'sip':
        return <Repeat size={size} color={color} />;
      case 'history':
        return <Clock size={size} color={color} />;
      case 'profile':
        return <User size={size} color={color} />;
      default:
        return <Home size={size} color={color} />;
    }
  };

  const getLabel = (routeName: string) => {
    switch (routeName) {
      case 'index':
        return 'Home';
      case 'portfolio':
        return 'Portfolio';
      case 'trading':
        return 'Trading';
      case 'sip':
        return 'SIP';
      case 'history':
        return 'History';
      case 'profile':
        return 'Profile';
      default:
        return routeName;
    }
  };

  return (
    <View style={styles.container}>
      {shouldAnimate && (
        <Animated.View style={[styles.indicator, indicatorStyle]} />
      )}
      
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label = getLabel(route.name);
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={styles.tab}
          >
            <View style={[styles.iconContainer, isFocused && styles.activeIconContainer]}>
              {getIcon(route.name, isFocused)}
            </View>
            <Text style={[
              styles.label,
              { color: isFocused ? colors.primary : '#8E8E93' }
            ]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    height: 84,
    position: 'relative',
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 15,
  },
  indicator: {
    position: 'absolute',
    top: 0,
    width: TAB_WIDTH,
    height: 3,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  activeIconContainer: {
    backgroundColor: colors.primary + '20',
  },
  label: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '500',
  },
});