import * as yup from 'yup';

// Auth validation schemas
export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export const signupSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .required('Full name is required'),
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    )
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

// Profile validation schemas
export const profileEditSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .required('Full name is required'),
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  phone: yup
    .string()
    .matches(/^\+?[\d\s-()]+$/, 'Please enter a valid phone number')
    .min(10, 'Phone number must be at least 10 digits')
    .required('Phone number is required'),
  dateOfBirth: yup
    .date()
    .max(new Date(), 'Date of birth cannot be in the future')
    .required('Date of birth is required'),
});

export const changePasswordSchema = yup.object().shape({
  currentPassword: yup
    .string()
    .required('Current password is required'),
  newPassword: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    )
    .required('New password is required'),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your new password'),
});

// Trading validation schemas
export const buyStockSchema = yup.object().shape({
  quantity: yup
    .number()
    .positive('Quantity must be positive')
    .integer('Quantity must be a whole number')
    .min(1, 'Minimum quantity is 1')
    .required('Quantity is required'),
  orderType: yup
    .string()
    .oneOf(['market', 'limit'], 'Invalid order type')
    .required('Order type is required'),
  limitPrice: yup
    .number()
    .when('orderType', {
      is: 'limit',
      then: (schema) => schema
        .positive('Limit price must be positive')
        .required('Limit price is required for limit orders'),
      otherwise: (schema) => schema.notRequired(),
    }),
});

export const sellStockSchema = yup.object().shape({
  quantity: yup
    .number()
    .positive('Quantity must be positive')
    .integer('Quantity must be a whole number')
    .min(1, 'Minimum quantity is 1')
    .required('Quantity is required'),
  orderType: yup
    .string()
    .oneOf(['market', 'limit'], 'Invalid order type')
    .required('Order type is required'),
  limitPrice: yup
    .number()
    .when('orderType', {
      is: 'limit',
      then: (schema) => schema
        .positive('Limit price must be positive')
        .required('Limit price is required for limit orders'),
      otherwise: (schema) => schema.notRequired(),
    }),
});

// SIP validation schemas
export const sipCreateSchema = yup.object().shape({
  stockId: yup
    .string()
    .required('Please select a stock'),
  amount: yup
    .number()
    .positive('Amount must be positive')
    .min(500, 'Minimum SIP amount is ₹500')
    .max(100000, 'Maximum SIP amount is ₹1,00,000')
    .required('SIP amount is required'),
  frequency: yup
    .string()
    .oneOf(['monthly', 'quarterly'], 'Invalid frequency')
    .required('Frequency is required'),
  startDate: yup
    .date()
    .min(new Date(), 'Start date cannot be in the past')
    .required('Start date is required'),
  duration: yup
    .number()
    .positive('Duration must be positive')
    .integer('Duration must be a whole number')
    .min(6, 'Minimum duration is 6 months')
    .max(120, 'Maximum duration is 120 months')
    .required('Duration is required'),
});

// IPO validation schemas
export const ipoApplicationSchema = yup.object().shape({
  quantity: yup
    .number()
    .positive('Quantity must be positive')
    .integer('Quantity must be a whole number')
    .min(1, 'Minimum quantity is 1')
    .required('Quantity is required'),
  bidPrice: yup
    .number()
    .positive('Bid price must be positive')
    .required('Bid price is required'),
  category: yup
    .string()
    .oneOf(['retail', 'hni', 'institutional'], 'Invalid category')
    .required('Category is required'),
  upiId: yup
    .string()
    .matches(/^[\w.-]+@[\w.-]+$/, 'Please enter a valid UPI ID')
    .required('UPI ID is required'),
});

// Payment validation schemas
export const addBankAccountSchema = yup.object().shape({
  accountNumber: yup
    .string()
    .matches(/^\d{9,18}$/, 'Account number must be 9-18 digits')
    .required('Account number is required'),
  confirmAccountNumber: yup
    .string()
    .oneOf([yup.ref('accountNumber')], 'Account numbers must match')
    .required('Please confirm your account number'),
  ifscCode: yup
    .string()
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Please enter a valid IFSC code')
    .required('IFSC code is required'),
  accountHolderName: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .required('Account holder name is required'),
  bankName: yup
    .string()
    .required('Bank name is required'),
});

export const addFundsSchema = yup.object().shape({
  amount: yup
    .number()
    .positive('Amount must be positive')
    .min(100, 'Minimum amount is ₹100')
    .max(200000, 'Maximum amount is ₹2,00,000')
    .required('Amount is required'),
  paymentMethod: yup
    .string()
    .oneOf(['upi', 'netbanking', 'card'], 'Invalid payment method')
    .required('Payment method is required'),
});

export const withdrawFundsSchema = yup.object().shape({
  amount: yup
    .number()
    .positive('Amount must be positive')
    .min(100, 'Minimum withdrawal amount is ₹100')
    .required('Amount is required'),
  bankAccountId: yup
    .string()
    .required('Please select a bank account'),
});

// Watchlist validation schemas
export const priceAlertSchema = yup.object().shape({
  targetPrice: yup
    .number()
    .positive('Target price must be positive')
    .required('Target price is required'),
  alertType: yup
    .string()
    .oneOf(['above', 'below'], 'Invalid alert type')
    .required('Alert type is required'),
});

// Contact/Support validation schemas
export const contactSupportSchema = yup.object().shape({
  subject: yup
    .string()
    .min(5, 'Subject must be at least 5 characters')
    .max(100, 'Subject must be less than 100 characters')
    .required('Subject is required'),
  message: yup
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters')
    .required('Message is required'),
  category: yup
    .string()
    .oneOf(['technical', 'account', 'trading', 'general'], 'Invalid category')
    .required('Category is required'),
});

// Feedback validation schema
export const feedbackSchema = yup.object().shape({
  rating: yup
    .number()
    .min(1, 'Please provide a rating')
    .max(5, 'Rating cannot exceed 5')
    .required('Rating is required'),
  feedback: yup
    .string()
    .min(10, 'Feedback must be at least 10 characters')
    .max(500, 'Feedback must be less than 500 characters')
    .required('Feedback is required'),
});

export type LoginFormData = yup.InferType<typeof loginSchema>;
export type SignupFormData = yup.InferType<typeof signupSchema>;
export type ProfileEditFormData = yup.InferType<typeof profileEditSchema>;
export type ChangePasswordFormData = yup.InferType<typeof changePasswordSchema>;
export type BuyStockFormData = yup.InferType<typeof buyStockSchema>;
export type SellStockFormData = yup.InferType<typeof sellStockSchema>;
export type SipCreateFormData = yup.InferType<typeof sipCreateSchema>;
export type IpoApplicationFormData = yup.InferType<typeof ipoApplicationSchema>;
export type AddBankAccountFormData = yup.InferType<typeof addBankAccountSchema>;
export type AddFundsFormData = yup.InferType<typeof addFundsSchema>;
export type WithdrawFundsFormData = yup.InferType<typeof withdrawFundsSchema>;
export type PriceAlertFormData = yup.InferType<typeof priceAlertSchema>;
export type ContactSupportFormData = yup.InferType<typeof contactSupportSchema>;
export type FeedbackFormData = yup.InferType<typeof feedbackSchema>;