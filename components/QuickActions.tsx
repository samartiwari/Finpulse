import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TrendingUp, Search, Bell, ChartBar as BarChart3, DollarSign, ChartPie as PieChart, Target, Zap, Users, BookOpen, Gamepad2, Calculator } from 'lucide-react-native';
import colors from '@/constants/colors';

interface QuickAction {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  onPress: () => void;
}

interface QuickActionsProps {
  onActionPress: (actionId: string) => void;
}

export default function QuickActions({ onActionPress }: QuickActionsProps) {
  const actions: QuickAction[] = [
    {
      id: 'search',
      title: 'Screener',
      icon: <Search size={24} color="white" />,
      color: colors.primary,
      onPress: () => onActionPress('search'),
    },
    {
      id: 'ipo',
      title: 'IPO',
      icon: <TrendingUp size={24} color="white" />,
      color: '#FF6B6B',
      onPress: () => onActionPress('ipo'),
    },
    {
      id: 'sip',
      title: 'SIP',
      icon: <Target size={24} color="white" />,
      color: '#4ECDC4',
      onPress: () => onActionPress('sip'),
    },
    {
      id: 'quick-trade',
      title: 'Trading',
      icon: <Zap size={24} color="white" />,
      color: '#45B7D1',
      onPress: () => onActionPress('quick-trade'),
    },
    {
      id: 'watchlist',
      title: 'Watchlist',
      icon: <Target size={24} color="white" />,
      color: '#96CEB4',
      onPress: () => onActionPress('watchlist'),
    },
    {
      id: 'analytics',
      title: 'Analytics',
      icon: <BarChart3 size={24} color="white" />,
      color: '#FECA57',
      onPress: () => onActionPress('analytics'),
    },
    {
      id: 'alerts',
      title: 'Alerts',
      icon: <Bell size={24} color="white" />,
      color: '#FF9FF3',
      onPress: () => onActionPress('alerts'),
    },
    {
      id: 'dividends',
      title: 'Dividends',
      icon: <DollarSign size={24} color="white" />,
      color: '#54A0FF',
      onPress: () => onActionPress('dividends'),
    },
    {
      id: 'social',
      title: 'Social',
      icon: <Users size={24} color="white" />,
      color: '#A55EEA',
      onPress: () => onActionPress('social'),
    },
    {
      id: 'education',
      title: 'Learn',
      icon: <BookOpen size={24} color="white" />,
      color: '#26C6DA',
      onPress: () => onActionPress('education'),
    },
    {
      id: 'paper-trading',
      title: 'Paper Trade',
      icon: <Gamepad2 size={24} color="white" />,
      color: '#FF7043',
      onPress: () => onActionPress('paper-trading'),
    },
    {
      id: 'payment',
      title: 'Payment',
      icon: <DollarSign size={24} color="white" />,
      color: '#66BB6A',
      onPress: () => onActionPress('payment'),
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Actions</Text>
      <View style={styles.actionsGrid}>
        {actions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={[styles.actionButton, { backgroundColor: action.color }]}
            onPress={action.onPress}
          >
            {action.icon}
            <Text style={styles.actionTitle}>{action.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    width: '22%',
    aspectRatio: 1,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionTitle: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
  },
});