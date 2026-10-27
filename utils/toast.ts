import Toast from 'react-native-toast-message';

export interface ToastOptions {
  type?: 'success' | 'error' | 'info';
  title: string;
  message?: string;
  duration?: number;
  position?: 'top' | 'bottom';
}

export const showToast = ({
  type = 'success',
  title,
  message,
  duration = 3000,
  position = 'top',
}: ToastOptions) => {
  Toast.show({
    type,
    text1: title,
    text2: message,
    position,
    visibilityTime: duration,
    autoHide: true,
    topOffset: 60,
    bottomOffset: 40,
  });
};

export const showSuccessToast = (title: string, message?: string) => {
  showToast({ type: 'success', title, message });
};

export const showErrorToast = (title: string, message?: string) => {
  showToast({ type: 'error', title, message });
};

export const showInfoToast = (title: string, message?: string) => {
  showToast({ type: 'info', title, message });
};

// Predefined toast messages
export const TOAST_MESSAGES = {
  // Auth
  LOGIN_SUCCESS: 'Welcome back!',
  LOGIN_ERROR: 'Login failed. Please check your credentials.',
  SIGNUP_SUCCESS: 'Account created successfully!',
  SIGNUP_ERROR: 'Failed to create account. Please try again.',
  LOGOUT_SUCCESS: 'Logged out successfully',
  
  // Trading
  BUY_ORDER_SUCCESS: 'Buy order placed successfully',
  SELL_ORDER_SUCCESS: 'Sell order placed successfully',
  ORDER_CANCELLED: 'Order cancelled successfully',
  ORDER_ERROR: 'Failed to place order. Please try again.',
  
  // Portfolio
  STOCK_ADDED_TO_WATCHLIST: 'Stock added to watchlist',
  STOCK_REMOVED_FROM_WATCHLIST: 'Stock removed from watchlist',
  PRICE_ALERT_SET: 'Price alert set successfully',
  PRICE_ALERT_REMOVED: 'Price alert removed',
  
  // SIP
  SIP_CREATED: 'SIP created successfully',
  SIP_MODIFIED: 'SIP modified successfully',
  SIP_PAUSED: 'SIP paused successfully',
  SIP_RESUMED: 'SIP resumed successfully',
  SIP_CANCELLED: 'SIP cancelled successfully',
  
  // IPO
  IPO_APPLICATION_SUCCESS: 'IPO application submitted successfully',
  IPO_APPLICATION_ERROR: 'Failed to submit IPO application',
  
  // Payment
  FUNDS_ADDED: 'Funds added successfully',
  FUNDS_WITHDRAWN: 'Withdrawal request submitted',
  BANK_ACCOUNT_ADDED: 'Bank account added successfully',
  PAYMENT_ERROR: 'Payment failed. Please try again.',
  
  // Profile
  PROFILE_UPDATED: 'Profile updated successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
  SETTINGS_SAVED: 'Settings saved successfully',
  
  // General
  COPIED_TO_CLIPBOARD: 'Copied to clipboard',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SOMETHING_WENT_WRONG: 'Something went wrong. Please try again.',
  FEATURE_COMING_SOON: 'This feature is coming soon!',
};