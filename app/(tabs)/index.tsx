import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, StatusBar, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, ChevronDown } from 'lucide-react-native';
import colors from '@/constants/colors';
import PortfolioCard from '@/components/PortfolioCard';
import SectionHeader from '@/components/SectionHeader';
import StockItem from '@/components/StockItem';
import NotificationIcon from '@/components/NotificationIcon';
import MarketNews from '@/components/MarketNews';
import QuickActions from '@/components/QuickActions';
import CustomHeader from '@/components/CustomHeader';
import { WatchlistPreview } from '@/components/Watchlist';
import { usePortfolioStore } from '@/store/portfolioStore';
import { useUserStore } from '@/store/userStore';
import { useCurrencyStore } from '@/store/currencyStore';
import Toast from 'react-native-toast-message';

// Add missing imports
import { mockStocks } from '@/mocks/stocks';

export default function HomeScreen() {
  const router = useRouter();
  const portfolio = usePortfolioStore();
  const { user, isAuthenticated } = useUserStore();
  const { formatAmount } = useCurrencyStore();
  const [refreshing, setRefreshing] = React.useState(false);

  const openTrade = React.useCallback((symbol: string) => router.push(`/trade/${symbol}`), [router]);

  // Ensure we have default values to prevent undefined errors
  const portfolioStocks = portfolio.stocks || [];
  const portfolioChartData = portfolio.chartData || [];

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; // Show nothing while redirecting
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const navigateToStock = (stockId: string) => {
    router.push(`/stock/${stockId}`);
  };

  const navigateToPortfolio = () => {
    router.push('/portfolio');
  };

  const navigateToWatchlist = () => {
    router.push('/watchlist');
  };

  const handleQuickAction = (actionId: string) => {
    Toast.show({
      type: 'info',
      text1: 'Quick Action',
      text2: `Opening ${actionId}...`
    });

    switch (actionId) {
      case 'search':
        router.push('/screener');
        break;
      case 'watchlist':
        router.push('/watchlist');
        break;
      case 'analytics':
        router.push('/analysis');
        break;
      case 'alerts':
        router.push('/notifications');
        break;
      case 'dividends':
        // Navigate to dividends page
        console.log('Dividends');
        break;
      case 'sectors':
        // Navigate to sectors page
        console.log('Sectors');
        break;
      case 'trending':
        // Navigate to trending stocks
        console.log('Trending');
        break;
      case 'quick-trade':
        router.push('/trading');
        break;
      case 'social':
        router.push('/social');
        break;
      case 'education':
        router.push('/education');
        break;
      case 'paper-trading':
        router.push('/paper-trading');
        break;
      case 'calculator':
        router.push('/calculator');
        break;
      case 'ipo':
        router.push('/ipo');
        break;
      case 'sip':
        router.push('/(tabs)/sip');
        break;
      case 'payment':
        router.push('/payment');
        break;
      default:
        console.log('Unknown action:', actionId);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <CustomHeader title="FinX Stock" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}, {user?.name?.split(' ')[0] || 'John'}</Text>
            <Text style={styles.welcomeText}>Ready to invest today?</Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.stockGainsCard}>
            <View style={styles.stockGainsHeader}>
              <Text style={styles.stockGainsTitle}>Stock Gains</Text>
              <TouchableOpacity style={styles.weekSelector}>
                <Text style={styles.weekText}>This week</Text>
                <ChevronDown size={16} color={colors.secondaryText} />
              </TouchableOpacity>
            </View>
            <Text style={styles.stockGainsValue}>{formatAmount(portfolio.totalValue)}</Text>
            <Text style={styles.stockGainsChange}>+{portfolio.changePercent}%</Text>
            <View style={styles.chartContainer}>
              <PortfolioCard
                title=""
                value={0}
                change={0}
                changePercent={0}
                chartData={portfolioChartData}
                onViewAll={() => { }}
                hideDetails={true}
              />
            </View>
          </View>

          <SectionHeader title="Portfolio" onViewAll={navigateToPortfolio} />

          <View style={styles.portfolioGrid}>
            {(portfolioStocks || []).slice(0, 2).map((stock, index) => (
              <View key={`${stock.id}-${stock.symbol}`} style={[styles.portfolioItem, index === 1 && styles.portfolioItemRight]}>
                <StockItem
                  stock={stock}
                  onPress={() => navigateToStock(stock.id)}
                  compact={true}
                />
              </View>
            ))}
          </View>

          <QuickActions onActionPress={handleQuickAction} />

          <MarketNews onViewAll={() => console.log('View all news')} />

          <SectionHeader title="Watchlist" onViewAll={navigateToWatchlist} />

          <View style={styles.watchlistList}>
            <WatchlistPreview onSelectSymbol={openTrade} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: 'white',
  },
  greeting: {
    fontSize: 14,
    color: colors.secondaryText,
    marginBottom: 4,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  stockGainsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  stockGainsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  stockGainsTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  weekSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  weekText: {
    fontSize: 14,
    color: colors.secondaryText,
    marginRight: 4,
  },
  stockGainsValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  stockGainsChange: {
    fontSize: 14,
    color: '#00C896',
    fontWeight: '500',
    marginBottom: 20,
  },
  chartContainer: {
    height: 120,
    marginTop: 10,
  },
  portfolioGrid: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  portfolioItem: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  portfolioItemRight: {
    marginLeft: 0,
  },
  watchlistList: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
});