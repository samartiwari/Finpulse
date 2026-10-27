import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import colors from '@/constants/colors';
import StockChart from './StockChart';

interface PortfolioCardProps {
  title: string;
  value: number;
  change: number;
  changePercent: number;
  chartData: { date: string; value: number }[];
  onViewAll: () => void;
  hideDetails?: boolean;
}

export default function PortfolioCard({
  title,
  value,
  change,
  changePercent,
  chartData,
  onViewAll,
  hideDetails = false
}: PortfolioCardProps) {
  const isPositive = (change || 0) >= 0;
  const safeChartData = chartData || [];

  if (hideDetails) {
    return (
      <View style={styles.chartOnlyContainer}>
        <StockChart
          data={safeChartData}
          width={300}
          height={120}
          color="#007AFF"
          showGradient={true}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={onViewAll} style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View all</Text>
          <ChevronRight size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <Text style={styles.value}>${value.toLocaleString()}</Text>

      <Text style={[styles.change, { color: isPositive ? colors.success : colors.error }]}>
        {isPositive ? '+' : ''}${(change || 0).toFixed(2)} ({isPositive ? '+' : ''}{(changePercent || 0).toFixed(2)}%)
      </Text>

      <View style={styles.chartContainer}>
        <StockChart
          data={safeChartData}
          width={300}
          height={120}
          color={isPositive ? colors.success : colors.error}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chartOnlyContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: colors.primary,
    marginRight: 4,
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  change: {
    fontSize: 16,
    marginBottom: 16,
  },
  chartContainer: {
    height: 120,
  },
});