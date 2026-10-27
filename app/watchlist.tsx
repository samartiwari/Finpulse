import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import colors from '@/constants/colors';
import Watchlist from '@/components/Watchlist';

export default function WatchlistScreen() {
  const router = useRouter();

  const openTrade = useCallback((symbol: string) => router.push(`/trade/${symbol}`), [router]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Watchlist' }} />
      <Watchlist onSelectSymbol={openTrade} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
