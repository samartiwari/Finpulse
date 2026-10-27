import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import colors from '@/constants/colors';
import StockItem from '@/components/StockItem';
import { useWatchlistStore } from '@/store/watchlistStore';

export default function WatchlistScreen() {
  const router = useRouter();
  const watchlist = useWatchlistStore();

  const navigateToStock = (stockId: string) => {
    router.push(`/stock/${stockId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Watchlist' }} />

      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>My Watchlist</Text>
          <Text style={styles.subtitle}>Track your favorite stocks</Text>
        </View>

        <View style={styles.watchlistList}>
          {(watchlist.stocks || []).map((stock) => (
            <StockItem
              key={stock.id}
              stock={stock}
              onPress={() => navigateToStock(stock.id)}
              showChart={true}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: colors.secondaryText,
    marginTop: 4,
  },
  watchlistList: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 24,
    overflow: 'hidden',
  },
});