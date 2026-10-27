import React from 'react';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import CustomTabBar from '@/components/CustomTabBar';
import colors from '@/constants/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
      }}
      tabBar={props => <CustomTabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
        }}
      />
      <Tabs.Screen
        name="portfolio"
        options={{
          title: 'Portfolio',
          tabBarLabel: 'Portfolio',
        }}
      />
      <Tabs.Screen
        name="trading"
        options={{
          title: 'Trading',
          tabBarLabel: 'Trading',
        }}
      />
      <Tabs.Screen
        name="sip"
        options={{
          title: 'SIP',
          tabBarLabel: 'SIP',
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarLabel: 'History',
        }}
      />

    </Tabs>
  );
}