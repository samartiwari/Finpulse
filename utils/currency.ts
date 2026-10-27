import { useCurrencyStore, Currency } from '@/store/currencyStore';

export function formatCurrency(
  amount: number,
  currencyCode?: string,
  options?: {
    showSymbol?: boolean;
    showCode?: boolean;
    decimals?: number;
  }
): string {
  const { showSymbol = true, showCode = false, decimals = 2 } = options || {};
  
  // Get current currency from store or use provided currency
  const store = useCurrencyStore.getState();
  const currentCurrency = currencyCode ? 
    store.availableCurrencies.find(c => c.code === currencyCode) || store.selectedCurrency :
    store.selectedCurrency;
  
  // Format the number
  const formattedAmount = amount.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  
  let result = formattedAmount;
  
  if (showSymbol) {
    result = `${currentCurrency.symbol}${result}`;
  }
  
  if (showCode) {
    result = `${result} ${currentCurrency.code}`;
  }
  
  return result;
}

export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): number {
  const store = useCurrencyStore.getState();
  const { exchangeRates } = store;
  
  if (fromCurrency === toCurrency) {
    return amount;
  }
  
  // Convert to USD first if not already
  const usdAmount = fromCurrency === 'USD' ? amount : amount / (exchangeRates[fromCurrency] || 1);
  
  // Convert from USD to target currency
  return toCurrency === 'USD' ? usdAmount : usdAmount * (exchangeRates[toCurrency] || 1);
}

export function getCurrencySymbol(currencyCode?: string): string {
  const store = useCurrencyStore.getState();
  if (currencyCode) {
    const currency = store.availableCurrencies.find(c => c.code === currencyCode);
    return currency?.symbol || '₹';
  }
  return store.selectedCurrency.symbol;
}

export function getCurrencyInfo(currencyCode?: string): Currency {
  const store = useCurrencyStore.getState();
  if (currencyCode) {
    return store.availableCurrencies.find(c => c.code === currencyCode) || store.selectedCurrency;
  }
  return store.selectedCurrency;
}

// Hook to use currency formatting
export function useCurrency() {
  const { selectedCurrency, availableCurrencies, setCurrency, formatAmount, convertAmount } = useCurrencyStore();
  
  const format = (amount: number, options?: Parameters<typeof formatCurrency>[2]) => {
    return formatCurrency(amount, selectedCurrency.code, options);
  };
  
  const convert = (amount: number, fromCurrency: string) => {
    return convertCurrency(amount, fromCurrency, selectedCurrency.code);
  };
  
  return {
    currency: selectedCurrency.code,
    selectedCurrency,
    availableCurrencies,
    setCurrency,
    format,
    convert,
    symbol: selectedCurrency.symbol,
    info: selectedCurrency,
  };
}