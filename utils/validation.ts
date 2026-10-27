// Utility functions for validation

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s-()]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

export const validatePAN = (pan: string): boolean => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan);
};

export const validateAadhar = (aadhar: string): boolean => {
  const aadharRegex = /^\d{12}$/;
  return aadharRegex.test(aadhar);
};

export const validateIFSC = (ifsc: string): boolean => {
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  return ifscRegex.test(ifsc);
};

export const validateUPI = (upi: string): boolean => {
  const upiRegex = /^[\w.-]+@[\w.-]+$/;
  return upiRegex.test(upi);
};

export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateStockSymbol = (symbol: string): boolean => {
  const symbolRegex = /^[A-Z]{1,10}$/;
  return symbolRegex.test(symbol);
};

export const validateAmount = (amount: number, min = 0, max = Infinity): boolean => {
  return amount > min && amount <= max && !isNaN(amount);
};

export const validateQuantity = (quantity: number): boolean => {
  return Number.isInteger(quantity) && quantity > 0;
};

export const validateDate = (date: Date): boolean => {
  return date instanceof Date && !isNaN(date.getTime());
};

export const validateFutureDate = (date: Date): boolean => {
  return validateDate(date) && date > new Date();
};

export const validatePastDate = (date: Date): boolean => {
  return validateDate(date) && date < new Date();
};

// Format validation error messages
export const formatValidationError = (field: string, error: string): string => {
  return `${field}: ${error}`;
};

// Check if string is empty or only whitespace
export const isEmpty = (value: string): boolean => {
  return !value || value.trim().length === 0;
};

// Sanitize input to prevent XSS
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .trim();
};

// Validate file size (in bytes)
export const validateFileSize = (size: number, maxSize: number): boolean => {
  return size <= maxSize;
};

// Validate file type
export const validateFileType = (fileName: string, allowedTypes: string[]): boolean => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  return extension ? allowedTypes.includes(extension) : false;
};

// Common validation patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[\d\s-()]+$/,
  PAN: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  AADHAR: /^\d{12}$/,
  IFSC: /^[A-Z]{4}0[A-Z0-9]{6}$/,
  UPI: /^[\w.-]+@[\w.-]+$/,
  STOCK_SYMBOL: /^[A-Z]{1,10}$/,
  PINCODE: /^\d{6}$/,
  GST: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
};

// Error messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_PAN: 'Please enter a valid PAN number',
  INVALID_AADHAR: 'Please enter a valid Aadhar number',
  INVALID_IFSC: 'Please enter a valid IFSC code',
  INVALID_UPI: 'Please enter a valid UPI ID',
  INVALID_AMOUNT: 'Please enter a valid amount',
  INVALID_QUANTITY: 'Please enter a valid quantity',
  INVALID_DATE: 'Please enter a valid date',
  PASSWORD_TOO_SHORT: 'Password must be at least 6 characters long',
  PASSWORDS_DONT_MATCH: 'Passwords do not match',
  FILE_TOO_LARGE: 'File size is too large',
  INVALID_FILE_TYPE: 'Invalid file type',
};