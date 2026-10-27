import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  country: string;
}

const currencies: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', country: 'United States' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', country: 'India' },
  { code: 'EUR', symbol: '€', name: 'Euro', country: 'European Union' },
  { code: 'GBP', symbol: '£', name: 'British Pound', country: 'United Kingdom' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', country: 'Japan' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', country: 'Canada' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', country: 'Australia' },
];

interface CurrencyState {
  selectedCurrency: Currency;
  availableCurrencies: Currency[];
  exchangeRates: Record<string, number>;
  setCurrency: (currency: Currency) => void;
  formatAmount: (amount: number) => string;
  convertAmount: (amount: number, fromCurrency?: string) => number;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      selectedCurrency: currencies[1], // Default to INR
      availableCurrencies: currencies,
      exchangeRates: {
        USD: 1,
        INR: 83.12,
        EUR: 0.85,
        GBP: 0.73,
        JPY: 110.0,
        CAD: 1.25,
        AUD: 1.35,
      },
      
      setCurrency: (currency) => {
        set({ selectedCurrency: currency });
      },
      
      formatAmount: (amount) => {
        const { selectedCurrency } = get();
        const convertedAmount = get().convertAmount(amount);
        
        return `${selectedCurrency.symbol}${convertedAmount.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
      },
      
      convertAmount: (amount, fromCurrency = 'USD') => {
        const { selectedCurrency, exchangeRates } = get();
        
        if (fromCurrency === selectedCurrency.code) {
          return amount;
        }
        
        // Convert to USD first if not already
        const usdAmount = fromCurrency === 'USD' ? amount : amount / exchangeRates[fromCurrency];
        
        // Convert from USD to selected currency
        return selectedCurrency.code === 'USD' ? usdAmount : usdAmount * exchangeRates[selectedCurrency.code];
      },
    }),
    {
      name: 'currency-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);