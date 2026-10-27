import { useCurrency } from './currency';

// Number formatting utilities
export const formatNumber = (
  num: number,
  options?: {
    decimals?: number;
    compact?: boolean;
    showSign?: boolean;
  }
): string => {
  const { decimals = 2, compact = false, showSign = false } = options || {};
  
  if (isNaN(num)) return '0';
  
  let formatted: string;
  
  if (compact && Math.abs(num) >= 1000) {
    // Format large numbers with K, M, B suffixes
    const suffixes = ['', 'K', 'M', 'B', 'T'];
    const suffixNum = Math.floor(Math.log10(Math.abs(num)) / 3);
    const shortValue = num / Math.pow(1000, suffixNum);
    
    formatted = shortValue.toFixed(decimals) + suffixes[suffixNum];
  } else {
    formatted = num.toLocaleString('en-IN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }
  
  if (showSign && num > 0) {
    formatted = '+' + formatted;
  }
  
  return formatted;
};

// Percentage formatting
export const formatPercentage = (
  value: number,
  options?: {
    decimals?: number;
    showSign?: boolean;
  }
): string => {
  const { decimals = 2, showSign = true } = options || {};
  
  if (isNaN(value)) return '0%';
  
  const formatted = value.toFixed(decimals);
  const sign = showSign && value > 0 ? '+' : '';
  
  return `${sign}${formatted}%`;
};

// Date formatting utilities
export const formatDate = (
  date: Date | string,
  format: 'short' | 'medium' | 'long' | 'time' = 'medium'
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return 'Invalid Date';
  
  const optionsByFormat: Record<typeof format, Intl.DateTimeFormatOptions> = {
    short: { day: '2-digit', month: '2-digit', year: '2-digit' },
    medium: { day: '2-digit', month: 'short', year: 'numeric' },
    long: { day: '2-digit', month: 'long', year: 'numeric' },
    time: { hour: '2-digit', minute: '2-digit' },
  };
  const options = optionsByFormat[format];
  
  return dateObj.toLocaleDateString('en-IN', options);
};

// Time formatting
export const formatTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return 'Invalid Time';
  
  return dateObj.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Relative time formatting (e.g., "2 hours ago")
export const formatRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSecs < 60) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return formatDate(dateObj, 'short');
};

// Phone number formatting
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  }
  
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return cleaned.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '+$1 $2-$3-$4');
  }
  
  return phone;
};

// File size formatting
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Stock price change formatting
export const formatPriceChange = (
  change: number,
  changePercent: number,
  options?: {
    showCurrency?: boolean;
    currencyCode?: string;
  }
): {
  change: string;
  changePercent: string;
  isPositive: boolean;
  isNegative: boolean;
} => {
  const { showCurrency = true, currencyCode } = options || {};
  const { format } = useCurrency();
  
  const isPositive = change > 0;
  const isNegative = change < 0;
  
  let formattedChange: string;
  if (showCurrency) {
    formattedChange = format(Math.abs(change), { decimals: 2 });
  } else {
    formattedChange = formatNumber(Math.abs(change), { decimals: 2 });
  }
  
  const sign = isPositive ? '+' : isNegative ? '-' : '';
  const formattedChangePercent = formatPercentage(Math.abs(changePercent), { showSign: false });
  
  return {
    change: `${sign}${formattedChange}`,
    changePercent: `${sign}${formattedChangePercent}`,
    isPositive,
    isNegative,
  };
};

// Market cap formatting
export const formatMarketCap = (marketCap: number): string => {
  return formatNumber(marketCap, { compact: true, decimals: 1 });
};

// Volume formatting
export const formatVolume = (volume: number): string => {
  return formatNumber(volume, { compact: true, decimals: 1 });
};

// P/E ratio formatting
export const formatPERatio = (pe: number): string => {
  if (isNaN(pe) || pe <= 0) return 'N/A';
  return formatNumber(pe, { decimals: 2 });
};

// Dividend yield formatting
export const formatDividendYield = (yield_: number): string => {
  if (isNaN(yield_) || yield_ <= 0) return 'N/A';
  return formatPercentage(yield_);
};

// Order status formatting
export const formatOrderStatus = (status: string): string => {
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Transaction type formatting
export const formatTransactionType = (type: string): string => {
  const typeMap: Record<string, string> = {
    buy: 'Buy',
    sell: 'Sell',
    dividend: 'Dividend',
    bonus: 'Bonus',
    split: 'Stock Split',
    rights: 'Rights Issue',
    ipo: 'IPO',
    sip: 'SIP',
  };
  
  return typeMap[type.toLowerCase()] || type;
};

// Duration formatting (for SIP)
export const formatDuration = (months: number): string => {
  if (months < 12) {
    return `${months} month${months > 1 ? 's' : ''}`;
  }
  
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  let result = `${years} year${years > 1 ? 's' : ''}`;
  
  if (remainingMonths > 0) {
    result += ` ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
  }
  
  return result;
};

// Frequency formatting
export const formatFrequency = (frequency: string): string => {
  const frequencyMap: Record<string, string> = {
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    quarterly: 'Quarterly',
    yearly: 'Yearly',
  };
  
  return frequencyMap[frequency.toLowerCase()] || frequency;
};

// Risk level formatting
export const formatRiskLevel = (risk: string): string => {
  const riskMap: Record<string, string> = {
    low: 'Low Risk',
    medium: 'Medium Risk',
    high: 'High Risk',
    very_high: 'Very High Risk',
  };
  
  return riskMap[risk.toLowerCase()] || risk;
};

// Crypto prices span five figures down to fractions of a cent, so precision scales with magnitude
export const getPriceDecimals = (price: number): number => {
  const abs = Math.abs(price);
  if (abs >= 100) return 2;
  if (abs >= 1) return 4;
  if (abs >= 0.01) return 5;
  return 8;
};

export const formatAssetPrice = (price: number): string => {
  const decimals = getPriceDecimals(price);
  return price.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};