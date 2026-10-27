import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { 
  Home, 
  TrendingUp, 
  History, 
  PiggyBank, 
  User,
  Wallet
} from 'lucide-react-native';
import colors from '@/constants/colors';

const TabIcon = ({ name, focused }: { name: string; focused: boolean }) => {
  const iconColor = focused ? colors.primary : colors.secondaryText;
  const iconSize = 24;

  switch (name) {
    case 'index':
      return <Home size={iconSize} color={iconColor} />;
    case 'portfolio':
      return <TrendingUp size={iconSize} color={iconColor} />;
    case 'history':
      return <History size={iconSize} color={iconColor} />;
    case 'sip':
      return <PiggyBank size={iconSize} color={iconColor} />;
    case 'trading':
      return <Wallet size={iconSize} color={iconColor} />;
    default:
      return <Home size={iconSize} color={iconColor} />;
  }
};

const getTabLabel = (routeName: string) => {
  switch (routeName) {
    case 'index':
      return 'Home';
    case 'portfolio':
      return 'Portfolio';
    case 'history':
      return 'History';
    case 'sip':
      return 'SIP';
    case 'trading':
      return 'Trading';
    default:
      return routeName;
  }
};

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = getTabLabel(route.name);
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={[styles.tab, isFocused && styles.activeTab]}
            >
              <View style={[styles.iconContainer, isFocused && styles.activeIconContainer]}>
                <TabIcon name={route.name} focused={isFocused} />
              </View>
              <Text style={[styles.label, isFocused && styles.activeLabel]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },
  tabBar: {
    flexDirection: 'row',
    paddingTop: 12,
    paddingHorizontal: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  activeTab: {
    // Additional styling for active tab if needed
  },
  iconContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  activeIconContainer: {
    backgroundColor: colors.primary + '20',
    borderRadius: 16,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.secondaryText,
    textAlign: 'center',
  },
  activeLabel: {
    color: colors.primary,
    fontWeight: '600',
  },
});