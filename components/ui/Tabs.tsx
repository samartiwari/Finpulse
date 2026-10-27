import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import colors from '@/constants/colors';

interface Tab {
  id: string;
  label: string;
  badge?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  style?: any;
  tabStyle?: any;
  activeTabStyle?: any;
  labelStyle?: any;
  activeLabelStyle?: any;
  scrollable?: boolean;
}

export default function Tabs({
  tabs,
  activeTab,
  onTabChange,
  style,
  tabStyle,
  activeTabStyle,
  labelStyle,
  activeLabelStyle,
  scrollable = false,
}: TabsProps) {
  const TabContainer = scrollable ? ScrollView : View;
  const containerProps = scrollable 
    ? { horizontal: true, showsHorizontalScrollIndicator: false }
    : { style: styles.tabsContainer };

  return (
    <TabContainer {...containerProps} style={[scrollable && styles.scrollContainer, style]}>
      <View style={scrollable ? styles.scrollContent : styles.tabsContainer}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          
          return (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                tabStyle,
                isActive && styles.activeTab,
                isActive && activeTabStyle,
              ]}
              onPress={() => onTabChange(tab.id)}
            >
              <Text
                style={[
                  styles.tabLabel,
                  labelStyle,
                  isActive && styles.activeTabLabel,
                  isActive && activeLabelStyle,
                ]}
              >
                {tab.label}
              </Text>
              
              {tab.badge !== undefined && tab.badge > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {tab.badge > 99 ? '99+' : tab.badge}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </TabContainer>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 0,
  },
  scrollContent: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: colors.surface,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  activeTabLabel: {
    color: 'white',
  },
  badge: {
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});