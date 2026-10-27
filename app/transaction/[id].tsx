import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Share,
  Platform,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowDownLeft, ArrowUpRight, CheckCircle, Clock, XCircle, Share2, Download, ArrowLeft } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useTransactionStore } from '@/store/transactionStore';
import { useCurrencyStore } from '@/store/currencyStore';
import Toast from 'react-native-toast-message';

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle size={20} color={colors.success} />;
    case 'pending':
      return <Clock size={20} color={colors.warning} />;
    case 'failed':
      return <XCircle size={20} color={colors.error} />;
    default:
      return <Clock size={20} color={colors.secondaryText} />;
  }
};

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

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const getTransactionById = useTransactionStore(state => state.getTransactionById);
  const { formatAmount } = useCurrencyStore();
  
  const transaction = getTransactionById(id!);

  if (!transaction) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen 
          options={{ 
            title: 'Transaction Details',
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <ArrowLeft size={24} color="#1A1A1A" />
              </TouchableOpacity>
            ),
          }} 
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Transaction not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isPositive = transaction.type === 'buy';
  
  const shareTransaction = async () => {
    try {
      const message = `Transaction Details\n\n${transaction.symbol} - ${transaction.name}\nType: ${transaction.type.toUpperCase()}\nShares: ${transaction.shares}\nAmount: ${formatAmount(transaction.amount)}\nStatus: ${transaction.status}\nDate: ${transaction.date}`;
      
      if (Platform.OS === 'web') {
        // Web fallback - create temporary textarea
        const textArea = document.createElement('textarea');
        textArea.value = message;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        Toast.show({
          type: 'success',
          text1: 'Copied!',
          text2: 'Transaction details copied to clipboard'
        });
      } else {
        await Share.share({
          message,
          title: 'Transaction Details',
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Unable to share transaction details'
      });
    }
  };
  
  const downloadReceipt = () => {
    // In a real app, this would generate and download a PDF receipt
    Toast.show({
      type: 'info',
      text1: 'Coming Soon',
      text2: 'Receipt download feature coming soon!'
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Transaction Details',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color="#1A1A1A" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={shareTransaction} style={styles.headerButton}>
                <Share2 size={20} color="#1A1A1A" />
              </TouchableOpacity>
              <TouchableOpacity onPress={downloadReceipt} style={styles.headerButton}>
                <Download size={20} color="#1A1A1A" />
              </TouchableOpacity>
            </View>
          ),
        }} 
      />
      
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: isPositive ? colors.success + '20' : colors.error + '20' }]}>
            {transaction.type === 'buy' ? (
              <ArrowDownLeft size={32} color={colors.success} />
            ) : (
              <ArrowUpRight size={32} color={colors.error} />
            )}
          </View>
          
          <Text style={styles.stockSymbol}>{transaction.symbol}</Text>
          <Text style={styles.stockName}>{transaction.name}</Text>
          
          <Text style={[
            styles.amount,
            { color: isPositive ? colors.error : colors.success }
          ]}>
            {transaction.type === 'buy' ? '-' : '+'}{formatAmount(transaction.amount)}
          </Text>
          
          <View style={styles.statusContainer}>
            {getStatusIcon(transaction.status)}
            <Text style={[
              styles.statusText,
              { color: getStatusColor(transaction.status) }
            ]}>
              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Transaction Details</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Order ID</Text>
            <Text style={styles.detailValue}>{transaction.orderId}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Type</Text>
            <Text style={[
              styles.detailValue,
              styles.typeText,
              { color: isPositive ? colors.green : colors.red }
            ]}>
              {transaction.type.toUpperCase()}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Shares</Text>
            <Text style={styles.detailValue}>
              {transaction.shares} {transaction.shares === 1 ? 'share' : 'shares'}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Price per Share</Text>
            <Text style={styles.detailValue}>{formatAmount(transaction.price)}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Total Amount</Text>
            <Text style={styles.detailValue}>{formatAmount(transaction.amount)}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Fees</Text>
            <Text style={styles.detailValue}>{formatAmount(transaction.fees)}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>{transaction.date}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Time</Text>
            <Text style={styles.detailValue}>{transaction.time}</Text>
          </View>
        </View>

        {transaction.status === 'completed' && (
          <View style={styles.summaryCard}>
            <Text style={styles.sectionTitle}>Transaction Summary</Text>
            <Text style={styles.summaryText}>
              You {transaction.type === 'buy' ? 'purchased' : 'sold'} {transaction.shares} {transaction.shares === 1 ? 'share' : 'shares'} of {transaction.name} ({transaction.symbol}) for {formatAmount(transaction.amount)} on {transaction.date} at {transaction.time}.
            </Text>
            
            <View style={styles.performanceCard}>
              <Text style={styles.performanceTitle}>Performance Impact</Text>
              <View style={styles.performanceRow}>
                <Text style={styles.performanceLabel}>Portfolio Impact</Text>
                <Text style={[styles.performanceValue, { color: isPositive ? colors.error : colors.success }]}>
                  {isPositive ? '-' : '+'}{formatAmount(transaction.amount)}
                </Text>
              </View>
              <View style={styles.performanceRow}>
                <Text style={styles.performanceLabel}>Shares {isPositive ? 'Added' : 'Removed'}</Text>
                <Text style={styles.performanceValue}>
                  {isPositive ? '+' : '-'}{transaction.shares}
                </Text>
              </View>
            </View>
          </View>
        )}
        
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={shareTransaction}>
            <Share2 size={20} color={colors.primary} />
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={downloadReceipt}>
            <Download size={20} color={colors.primary} />
            <Text style={styles.actionButtonText}>Download Receipt</Text>
          </TouchableOpacity>
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 18,
    color: colors.secondaryText,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  stockSymbol: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
    color: '#1A1A1A',
  },
  stockName: {
    fontSize: 16,
    color: colors.secondaryText,
    marginBottom: 16,
  },
  amount: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
  },
  detailsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    color: '#1A1A1A',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  detailLabel: {
    fontSize: 16,
    color: colors.secondaryText,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  typeText: {
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 8,
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryText: {
    fontSize: 14,
    color: colors.secondaryText,
    lineHeight: 20,
    marginBottom: 16,
  },
  performanceCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
  },
  performanceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  performanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  performanceLabel: {
    fontSize: 14,
    color: colors.secondaryText,
  },
  performanceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
});