import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Check } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useCurrencyStore, Currency } from '@/store/currencyStore';

export default function CurrencySettingsScreen() {
  const router = useRouter();
  const { selectedCurrency, availableCurrencies, setCurrency } = useCurrencyStore();

  const handleCurrencySelect = (currency: Currency) => {
    setCurrency(currency);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Currency Settings',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color="#1A1A1A" />
            </TouchableOpacity>
          ),
        }} 
      />

      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Select Currency</Text>
          <Text style={styles.subtitle}>
            Choose your preferred currency for displaying prices and values
          </Text>
        </View>

        <View style={styles.currencyList}>
          {availableCurrencies.map((currency) => (
            <TouchableOpacity
              key={currency.code}
              style={[
                styles.currencyItem,
                selectedCurrency.code === currency.code && styles.selectedCurrency
              ]}
              onPress={() => handleCurrencySelect(currency)}
            >
              <View style={styles.currencyInfo}>
                <View style={styles.currencyHeader}>
                  <Text style={styles.currencySymbol}>{currency.symbol}</Text>
                  <Text style={styles.currencyCode}>{currency.code}</Text>
                </View>
                <Text style={styles.currencyName}>{currency.name}</Text>
                <Text style={styles.currencyCountry}>{currency.country}</Text>
              </View>
              
              {selectedCurrency.code === currency.code && (
                <View style={styles.checkIcon}>
                  <Check size={20} color={colors.primary} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.note}>
          <Text style={styles.noteText}>
            Note: Exchange rates are updated regularly. Actual trading prices may vary based on real-time market rates.
          </Text>
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
  backButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: 'white',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.secondaryText,
    lineHeight: 20,
  },
  currencyList: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  selectedCurrency: {
    backgroundColor: colors.primary + '10',
  },
  currencyInfo: {
    flex: 1,
  },
  currencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 12,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    width: 32,
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  currencyName: {
    fontSize: 14,
    color: colors.secondaryText,
    marginBottom: 2,
  },
  currencyCountry: {
    fontSize: 12,
    color: colors.secondaryText,
  },
  checkIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  note: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  noteText: {
    fontSize: 14,
    color: colors.secondaryText,
    lineHeight: 20,
    textAlign: 'center',
  },
});