import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, RefreshControl } from 'react-native';
import { ShoppingCart, TrendingUp, Clock } from 'lucide-react-native';
import { router } from 'expo-router';
import colors from '@/constants/colors';
import { useTransactionStore } from '@/store/transactionStore';
import { useCurrencyStore } from '@/store/currencyStore';
import Toast from 'react-native-toast-message';
import CustomHeader from '@/components/CustomHeader';



export default function HistoryScreen() {
  const { filteredTransactions, activeFilter, setFilter } = useTransactionStore();
  const { formatAmount } = useCurrencyStore();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleFilterPress = (filter: 'all' | 'buy' | 'sell') => {
    setFilter(filter);
  };

  const handleTransactionPress = (transactionId: string) => {
    Toast.show({
      type: 'info',
      text1: 'Transaction Details',
      text2: 'Opening transaction details...'
    });
    router.push(`/transaction/${transactionId}`);
  };

  return (
    <View style={styles.container}>
      <CustomHeader title="History" />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.subtitle}>Your trading activity</Text>
        </View>

        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterButton, activeFilter === 'all' && styles.activeFilter]}
            onPress={() => handleFilterPress('all')}
          >
            <Text style={activeFilter === 'all' ? styles.activeFilterText : styles.filterText}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, activeFilter === 'buy' && styles.activeFilter]}
            onPress={() => handleFilterPress('buy')}
          >
            <Text style={activeFilter === 'buy' ? styles.activeFilterText : styles.filterText}>Buy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, activeFilter === 'sell' && styles.activeFilter]}
            onPress={() => handleFilterPress('sell')}
          >
            <Text style={activeFilter === 'sell' ? styles.activeFilterText : styles.filterText}>Sell</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.transactionList}>
          {(filteredTransactions || []).map((transaction) => (
            <TouchableOpacity
              key={transaction.id}
              style={styles.transactionItem}
              onPress={() => handleTransactionPress(transaction.id)}
            >
              <View style={[
                styles.iconContainer,
                { backgroundColor: transaction.type === 'buy' ? colors.success + '20' : colors.error + '20' }
              ]}>
                {transaction.type === 'buy' ? (
                  <ShoppingCart size={20} color={colors.success} />
                ) : (
                  <TrendingUp size={20} color={colors.error} />
                )}
              </View>

              <View style={styles.transactionDetails}>
                <Text style={styles.transactionSymbol}>{transaction.symbol}</Text>
                <Text style={styles.transactionName}>{transaction.name}</Text>
                <Text style={styles.transactionDate}>
                  {transaction.date} • {transaction.time}
                </Text>
              </View>

              <View style={styles.transactionAmount}>
                <Text style={[
                  styles.amountText,
                  { color: transaction.type === 'buy' ? colors.success : colors.error }
                ]}>
                  {transaction.type === 'buy' ? '+' : '-'}{formatAmount(transaction.amount)}
                </Text>
                <Text style={styles.sharesText}>
                  {transaction.shares} {transaction.shares === 1 ? 'share' : 'shares'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
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
  subtitle: {
    fontSize: 16,
    color: colors.secondaryText,
    fontWeight: '500',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  activeFilter: {
    backgroundColor: colors.primary,
  },
  filterText: {
    color: colors.secondaryText,
    fontWeight: '500',
  },
  activeFilterText: {
    color: 'white',
    fontWeight: '500',
  },
  transactionList: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionSymbol: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  transactionName: {
    color: colors.secondaryText,
    fontSize: 14,
    marginBottom: 2,
  },
  transactionDate: {
    color: colors.secondaryText,
    fontSize: 12,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  sharesText: {
    color: colors.secondaryText,
    fontSize: 12,
  },
});