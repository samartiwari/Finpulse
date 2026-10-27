import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import {
  CreditCard,
  Wallet,
  Building,
  Shield,
  Plus,
  Check,
  ArrowRight,
  DollarSign,
  Clock,
  Star,
  Zap,
} from 'lucide-react-native';
import colors from '@/constants/colors';
import { useCurrency } from '@/utils/currency';
import { useForm } from '@/hooks/useForm';
import { addFundsSchema, withdrawFundsSchema, addBankAccountSchema } from '@/validation/schemas';
import FormInput from '@/components/common/FormInput';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import Modal from '@/components/common/Modal';
import BackButton from '@/components/common/BackButton';
import { showSuccessToast, showErrorToast } from '@/utils/toast';
import { TOAST_MESSAGES } from '@/utils/toast';

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'wallet';
  name: string;
  details: string;
  isDefault: boolean;
  icon: any;
  color: string;
}

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  method: string;
}

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'card',
    name: 'Visa ****1234',
    details: 'Expires 12/25',
    isDefault: true,
    icon: CreditCard,
    color: '#1A1F71',
  },
  {
    id: '2',
    type: 'bank',
    name: 'Chase Bank',
    details: 'Account ****5678',
    isDefault: false,
    icon: Building,
    color: '#0066CC',
  },
  {
    id: '3',
    type: 'wallet',
    name: 'PayPal',
    details: 'john@example.com',
    isDefault: false,
    icon: Wallet,
    color: '#003087',
  },
];

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'deposit',
    amount: 1000,
    status: 'completed',
    date: '2024-07-15',
    method: 'Visa ****1234',
  },
  {
    id: '2',
    type: 'withdrawal',
    amount: 500,
    status: 'pending',
    date: '2024-07-14',
    method: 'Chase Bank',
  },
  {
    id: '3',
    type: 'deposit',
    amount: 2500,
    status: 'completed',
    date: '2024-07-13',
    method: 'PayPal',
  },
];

export default function PaymentScreen() {
  const router = useRouter();
  const { format } = useCurrency();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [showAddMethod, setShowAddMethod] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const accountBalance = 12450.75;
  const availableBalance = 11200.50;

  const addFundsForm = useForm({
    initialValues: {
      amount: '',
      paymentMethod: 'upi',
    },
    validationSchema: addFundsSchema,
    onSubmit: async (values) => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        showSuccessToast(TOAST_MESSAGES.FUNDS_ADDED);
        setShowDepositModal(false);
        addFundsForm.resetForm();
      } catch (error) {
        showErrorToast(TOAST_MESSAGES.PAYMENT_ERROR);
      }
    },
  });

  const withdrawForm = useForm({
    initialValues: {
      amount: '',
      bankAccountId: '1',
    },
    validationSchema: withdrawFundsSchema,
    onSubmit: async (values) => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        showSuccessToast(TOAST_MESSAGES.FUNDS_WITHDRAWN);
        setShowWithdrawModal(false);
        withdrawForm.resetForm();
      } catch (error) {
        showErrorToast(TOAST_MESSAGES.PAYMENT_ERROR);
      }
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return colors.success;
      case 'pending':
        return colors.warning;
      case 'failed':
        return colors.error;
      default:
        return colors.secondaryText;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check size={16} color={colors.success} />;
      case 'pending':
        return <Clock size={16} color={colors.warning} />;
      case 'failed':
        return <Check size={16} color={colors.error} />;
      default:
        return <Clock size={16} color={colors.secondaryText} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Payment & Wallet',
          headerLeft: () => <BackButton />,
        }} 
      />
      
      <ScrollView style={styles.content}>
        {/* Balance Card */}
        <Card style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <View>
              <Text style={styles.balanceLabel}>Available Balance</Text>
              <Text style={styles.balanceAmount}>{format(availableBalance)}</Text>
            </View>
            <View style={styles.walletIcon}>
              <Wallet size={24} color={colors.primary} />
            </View>
          </View>
          
          <View style={styles.balanceDetails}>
            <View style={styles.balanceItem}>
              <Text style={styles.balanceItemLabel}>Total Balance</Text>
              <Text style={styles.balanceItemValue}>{format(accountBalance)}</Text>
            </View>
            <View style={styles.balanceItem}>
              <Text style={styles.balanceItemLabel}>Used in Orders</Text>
              <Text style={styles.balanceItemValue}>{format(accountBalance - availableBalance)}</Text>
            </View>
          </View>
        </Card>

        {/* Quick Actions */}
        <Card style={styles.actionsCard}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setShowDepositModal(true)}
            >
              <View style={[styles.actionIcon, { backgroundColor: colors.success + '20' }]}>
                <Plus size={20} color={colors.success} />
              </View>
              <Text style={styles.actionText}>Add Funds</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setShowWithdrawModal(true)}
            >
              <View style={[styles.actionIcon, { backgroundColor: colors.primary + '20' }]}>
                <DollarSign size={20} color={colors.primary} />
              </View>
              <Text style={styles.actionText}>Withdraw</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: colors.warning + '20' }]}>
                <Star size={20} color={colors.warning} />
              </View>
              <Text style={styles.actionText}>Rewards</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: colors.secondary + '20' }]}>
                <Zap size={20} color={colors.secondary} />
              </View>
              <Text style={styles.actionText}>Auto Pay</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Payment Methods */}
        <Card style={styles.methodsCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Payment Methods</Text>
            <TouchableOpacity onPress={() => setShowAddMethod(true)}>
              <Plus size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          {paymentMethods.map((method) => {
            const IconComponent = method.icon;
            return (
              <TouchableOpacity key={method.id} style={styles.methodItem}>
                <View style={styles.methodInfo}>
                  <View style={[styles.methodIcon, { backgroundColor: method.color + '20' }]}>
                    <IconComponent size={20} color={method.color} />
                  </View>
                  <View style={styles.methodDetails}>
                    <Text style={styles.methodName}>{method.name}</Text>
                    <Text style={styles.methodSubtext}>{method.details}</Text>
                  </View>
                </View>
                <View style={styles.methodActions}>
                  {method.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultText}>Default</Text>
                    </View>
                  )}
                  <ArrowRight size={16} color={colors.secondaryText} />
                </View>
              </TouchableOpacity>
            );
          })}
        </Card>

        {/* Recent Transactions */}
        <Card style={styles.transactionsCard}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          
          {transactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionInfo}>
                <View style={styles.transactionIcon}>
                  {getStatusIcon(transaction.status)}
                </View>
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionType}>
                    {transaction.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                  </Text>
                  <Text style={styles.transactionMethod}>{transaction.method}</Text>
                  <Text style={styles.transactionDate}>{transaction.date}</Text>
                </View>
              </View>
              <View style={styles.transactionAmount}>
                <Text style={[
                  styles.transactionAmountText,
                  { color: transaction.type === 'deposit' ? colors.success : colors.error }
                ]}>
                  {transaction.type === 'deposit' ? '+' : '-'}{format(transaction.amount)}
                </Text>
                <Text style={[styles.transactionStatus, { color: getStatusColor(transaction.status) }]}>
                  {transaction.status}
                </Text>
              </View>
            </View>
          ))}
        </Card>

        {/* Security Info */}
        <Card style={styles.securityCard}>
          <View style={styles.securityHeader}>
            <Shield size={20} color={colors.primary} />
            <Text style={styles.securityTitle}>Secure & Protected</Text>
          </View>
          <Text style={styles.securityText}>
            We use bank-level encryption and never store your payment information
          </Text>
        </Card>
      </ScrollView>

      {/* Add Funds Modal */}
      <Modal
        visible={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        title="Add Funds"
        size="medium"
      >
        <View style={styles.modalContent}>
          <FormInput
            label="Amount"
            value={addFundsForm.values.amount}
            onChangeText={(text) => addFundsForm.setValue('amount', text)}
            onBlur={() => addFundsForm.setFieldTouched('amount')}
            placeholder="Enter amount"
            keyboardType="numeric"
            error={addFundsForm.errors.amount}
            touched={addFundsForm.touched.amount}
            required
          />
          
          <View style={styles.quickAmounts}>
            {[100, 500, 1000, 2500].map((amount) => (
              <TouchableOpacity
                key={amount}
                style={styles.quickAmountButton}
                onPress={() => addFundsForm.setValue('amount', amount.toString())}
              >
                <Text style={styles.quickAmountText}>{format(amount)}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <Button
            title="Add Funds"
            onPress={addFundsForm.handleSubmit}
            loading={addFundsForm.isSubmitting}
            style={styles.modalButton}
          />
        </View>
      </Modal>

      {/* Withdraw Modal */}
      <Modal
        visible={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        title="Withdraw Funds"
        size="medium"
      >
        <View style={styles.modalContent}>
          <FormInput
            label="Amount"
            value={withdrawForm.values.amount}
            onChangeText={(text) => withdrawForm.setValue('amount', text)}
            onBlur={() => withdrawForm.setFieldTouched('amount')}
            placeholder="Enter amount"
            keyboardType="numeric"
            error={withdrawForm.errors.amount}
            touched={withdrawForm.touched.amount}
            required
          />
          
          <Button
            title="Withdraw Funds"
            onPress={withdrawForm.handleSubmit}
            loading={withdrawForm.isSubmitting}
            style={styles.modalButton}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  balanceCard: {
    marginBottom: 16,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 14,
    color: colors.secondaryText,
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  walletIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  balanceItem: {
    alignItems: 'center',
  },
  balanceItemLabel: {
    fontSize: 12,
    color: colors.secondaryText,
    marginBottom: 4,
  },
  balanceItemValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  actionsCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
  },
  methodsCard: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  methodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  methodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  methodDetails: {
    flex: 1,
  },
  methodName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  methodSubtext: {
    fontSize: 14,
    color: colors.secondaryText,
  },
  methodActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  defaultBadge: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  transactionsCard: {
    marginBottom: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  transactionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  transactionMethod: {
    fontSize: 14,
    color: colors.secondaryText,
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: colors.secondaryText,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionAmountText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  transactionStatus: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  securityCard: {
    marginBottom: 16,
  },
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  securityText: {
    fontSize: 14,
    color: colors.secondaryText,
    lineHeight: 20,
  },
  modalContent: {
    gap: 16,
  },
  quickAmounts: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  quickAmountButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.surface,
    borderRadius: 8,
    alignItems: 'center',
  },
  quickAmountText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  modalButton: {
    marginTop: 8,
  },
});