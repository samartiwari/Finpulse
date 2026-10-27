import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Stock, PortfolioStock } from '@/types/stock';
import colors from '@/constants/colors';
import StockChart from './StockChart';

interface StockItemProps {
  stock: Stock | PortfolioStock;
  onPress: () => void;
  showChart?: boolean;
  compact?: boolean;
  showHoldings?: boolean;
}

export default function StockItem({ stock, onPress, showChart = false, compact = false, showHoldings = false }: StockItemProps) {
  const isPortfolioStock = 'shares' in stock;
  const isPositive = stock.change >= 0;
  
  if (compact) {
    return (
      <TouchableOpacity style={styles.compactContainer} onPress={onPress}>
        <View style={styles.compactHeader}>
          <View style={[styles.logoContainer, { backgroundColor: (stock as PortfolioStock).color || '#007AFF' }]}>
            <Text style={styles.logoText}>{stock.symbol.charAt(0)}</Text>
          </View>
          <Text style={styles.compactSymbol}>{stock.symbol}</Text>
        </View>
        <Text style={styles.compactName}>{stock.name}</Text>
        <Text style={styles.compactPrice}>${stock.price.toFixed(2)}</Text>
        <Text style={[styles.compactChange, { color: isPositive ? '#00C896' : '#FF3B30' }]}>
          {isPositive ? '+' : ''}{stock.changePercent.toFixed(1)}%
        </Text>
      </TouchableOpacity>
    );
  }
  
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.leftSection}>
        <View style={styles.logoWrapper}>
          <View style={[styles.logoContainer, { backgroundColor: getLogoColor(stock.symbol) }]}>
            <Text style={styles.logoText}>{stock.symbol.charAt(0)}</Text>
          </View>
        </View>
        <View style={styles.stockInfo}>
          <Text style={styles.symbol}>{stock.symbol}</Text>
          <Text style={styles.name}>{stock.name}</Text>
        </View>
      </View>
      
      <View style={styles.rightSection}>
        {showChart && (
          <View style={styles.chartContainer}>
            <StockChart 
              data={generateMiniChartData()} 
              width={60} 
              height={30} 
              color={isPositive ? '#00C896' : '#FF3B30'}
            />
          </View>
        )}
        
        <View style={styles.priceSection}>
          <Text style={styles.price}>${stock.price.toFixed(2)}</Text>
          <Text style={[styles.change, { color: isPositive ? '#00C896' : '#FF3B30' }]}>
            {isPositive ? '+' : ''}{stock.changePercent.toFixed(1)}%
          </Text>
          {showHoldings && isPortfolioStock && (
            <Text style={styles.holdings}>
              {(stock as PortfolioStock).shares} shares
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

function getLogoColor(symbol: string): string {
  const colors = ['#007AFF', '#FF3B30', '#00C896', '#FF9500', '#AF52DE', '#FF2D92'];
  const index = symbol.charCodeAt(0) % colors.length;
  return colors[index];
}

function generateMiniChartData() {
  return Array.from({ length: 20 }, (_, i) => ({
    date: `day-${i}`,
    value: Math.random() * 100 + 50
  }));
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  compactContainer: {
    padding: 16,
    alignItems: 'flex-start',
  },
  compactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoWrapper: {
    marginRight: 12,
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  stockInfo: {
    flex: 1,
  },
  symbol: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  compactSymbol: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginLeft: 8,
  },
  name: {
    fontSize: 14,
    color: '#8E8E93',
  },
  compactName: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 8,
  },
  rightSection: {
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
  chartContainer: {
    marginRight: 16,
  },
  priceSection: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  compactPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  change: {
    fontSize: 14,
    fontWeight: '500',
  },
  compactChange: {
    fontSize: 14,
    fontWeight: '500',
  },
  holdings: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
});