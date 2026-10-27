import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TextInput, 
  Alert,
  SafeAreaView,
  ScrollView,
  Switch 
} from 'react-native';
import { X, CreditCard, Clock, TrendingUp, Shield } from 'lucide-react-native';
import { Stock } from '@/types/stock';
import { usePortfolioStore } from '@/store/portfolioStore';
import { useTransactionStore } from '@/store/transactionStore';
import colors from '@/constants/colors';

interface BuySellModalProps {
  visible: boolean;
  onClose: () => void;
  stock: Stock;
  type: 'buy' | 'sell';
}

export default function BuySellModal({ visible, onClose, stock, type }: BuySellModalProps) {
  const [quantity, setQuantity] = useState('1');
  const [loading, setLoading] = useState(false);
  const [orderType, setOrderType] = useState<'market' | 'limit' | 'stop'>('market');
  const [limitPrice, setLimitPrice] = useState('');
  const [stopPrice, setStopPrice] = useState('');
  const [timeInForce, setTimeInForce] = useState<'day' | 'gtc'>('day');
  const [extendedHours, setExtendedHours] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('default');
  const { addStock, updateStock, stocks } = usePortfolioStore();
  const addTransaction = useTransactionStore(state => state.addTransaction);

  const qty = parseFloat(quantity || '0');
  const price = orderType === 'limit' ? parseFloat(limitPrice || '0') : stock.price;
  const totalValue = qty * price;
  const estimatedFees = totalValue * 0.001; // 0.1% fee
  const totalCost = totalValue + (type === 'buy' ? estimatedFees : -estimatedFees);
  const existingStock = stocks.find(s => s.symbol === stock.symbol);

  const handleTransaction = async () => {
    const qty = parseInt(quantity);
    if (!qty || qty <= 0) {
      Alert.alert('Error', 'Please enter a valid quantity');
      return;
    }

    setLoading(true);
    
    try {
      // Add transaction to history
      addTransaction({
        type: type as 'buy' | 'sell',
        symbol: stock.symbol,
        name: stock.name,
        amount: totalValue,
        shares: qty,
        price: stock.price,
        status: 'completed',
        fees: totalValue * 0.001, // 0.1% fee
      });

      if (type === 'buy') {
        if (existingStock) {
          const newShares = existingStock.shares + qty;
          updateStock(existingStock.id, newShares);
        } else {
          addStock({
            ...stock,
            shares: qty,
            averageCost: stock.price,
          });
        }
        Alert.alert('Success', `Successfully bought ${qty} shares of ${stock.symbol}`);
      } else {
        if (!existingStock || existingStock.shares < qty) {
          Alert.alert('Error', 'Insufficient shares to sell');
          return;
        }
        const newShares = existingStock.shares - qty;
        if (newShares === 0) {
          // Remove stock if no shares left
          updateStock(existingStock.id, 0);
        } else {
          updateStock(existingStock.id, newShares);
        }
        Alert.alert('Success', `Successfully sold ${qty} shares of ${stock.symbol}`);
      }
      
      onClose();
      setQuantity('1');
    } catch (error) {
      Alert.alert('Error', 'Transaction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{type === 'buy' ? 'Buy' : 'Sell'} {stock.symbol}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#1A1A1A" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.stockInfo}>
            <Text style={styles.stockSymbol}>{stock.symbol}</Text>
            <Text style={styles.stockName}>{stock.name}</Text>
            <Text style={styles.stockPrice}>${stock.price.toFixed(2)} per share</Text>
          </View>

          {existingStock && (
            <View style={styles.currentHolding}>
              <Text style={styles.holdingText}>
                Current holding: {existingStock.shares} shares
              </Text>
            </View>
          )}

          {/* Order Type Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Type</Text>
            <View style={styles.orderTypeContainer}>
              {['market', 'limit', 'stop'].map((orderTypeOption) => (
                <TouchableOpacity
                  key={orderTypeOption}
                  style={[
                    styles.orderTypeButton,
                    orderType === orderTypeOption && styles.activeOrderType
                  ]}
                  onPress={() => setOrderType(orderTypeOption as any)}
                >
                  <Text style={[
                    styles.orderTypeText,
                    orderType === orderTypeOption && styles.activeOrderTypeText
                  ]}>
                    {orderTypeOption.charAt(0).toUpperCase() + orderTypeOption.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Quantity</Text>
            <TextInput
              style={styles.input}
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
              placeholder="Enter quantity"
            />
          </View>

          {orderType === 'limit' && (
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Limit Price</Text>
              <TextInput
                style={styles.input}
                value={limitPrice}
                onChangeText={setLimitPrice}
                keyboardType="numeric"
                placeholder={`Current: ${stock.price.toFixed(2)}`}
              />
            </View>
          )}

          {orderType === 'stop' && (
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Stop Price</Text>
              <TextInput
                style={styles.input}
                value={stopPrice}
                onChangeText={setStopPrice}
                keyboardType="numeric"
                placeholder={`Current: ${stock.price.toFixed(2)}`}
              />
            </View>
          )}

          {/* Advanced Options */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Advanced Options</Text>
            
            <View style={styles.optionRow}>
              <View style={styles.optionInfo}>
                <Clock size={16} color={colors.secondaryText} />
                <Text style={styles.optionLabel}>Time in Force</Text>
              </View>
              <View style={styles.timeInForceContainer}>
                <TouchableOpacity
                  style={[
                    styles.timeInForceButton,
                    timeInForce === 'day' && styles.activeTimeInForce
                  ]}
                  onPress={() => setTimeInForce('day')}
                >
                  <Text style={[
                    styles.timeInForceText,
                    timeInForce === 'day' && styles.activeTimeInForceText
                  ]}>Day</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.timeInForceButton,
                    timeInForce === 'gtc' && styles.activeTimeInForce
                  ]}
                  onPress={() => setTimeInForce('gtc')}
                >
                  <Text style={[
                    styles.timeInForceText,
                    timeInForce === 'gtc' && styles.activeTimeInForceText
                  ]}>GTC</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.optionRow}>
              <View style={styles.optionInfo}>
                <TrendingUp size={16} color={colors.secondaryText} />
                <Text style={styles.optionLabel}>Extended Hours Trading</Text>
              </View>
              <Switch
                value={extendedHours}
                onValueChange={setExtendedHours}
                trackColor={{ false: '#E5E5EA', true: colors.primary }}
                thumbColor={extendedHours ? 'white' : '#f4f3f4'}
              />
            </View>
          </View>

          {/* Payment Method */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <TouchableOpacity style={styles.paymentMethod}>
              <CreditCard size={20} color={colors.primary} />
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentTitle}>Default Card</Text>
                <Text style={styles.paymentSubtitle}>•••• •••• •••• 1234</Text>
              </View>
              <Shield size={16} color={colors.success} />
            </TouchableOpacity>
          </View>

          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Quantity:</Text>
              <Text style={styles.summaryValue}>{quantity || '0'} shares</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Price per share:</Text>
              <Text style={styles.summaryValue}>${price.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal:</Text>
              <Text style={styles.summaryValue}>${totalValue.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Estimated fees:</Text>
              <Text style={styles.summaryValue}>${estimatedFees.toFixed(2)}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total {type === 'buy' ? 'Cost' : 'Proceeds'}:</Text>
              <Text style={styles.totalValue}>${Math.abs(totalCost).toFixed(2)}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: type === 'buy' ? '#00C896' : '#FF3B30' },
              loading && styles.disabledButton
            ]}
            onPress={handleTransaction}
            disabled={loading}
          >
            <Text style={styles.actionButtonText}>
              {loading ? 'Processing...' : `${type === 'buy' ? 'Buy' : 'Sell'} ${stock.symbol}`}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  stockInfo: {
    alignItems: 'center',
    marginBottom: 32,
  },
  stockSymbol: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  stockName: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 8,
  },
  stockPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  currentHolding: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  holdingText: {
    fontSize: 14,
    color: '#1A1A1A',
    textAlign: 'center',
  },
  inputSection: {
    marginBottom: 32,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#F8F9FA',
  },
  summary: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingTop: 12,
    marginTop: 8,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  orderTypeContainer: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 4,
  },
  orderTypeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeOrderType: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  orderTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
  },
  activeOrderTypeText: {
    color: '#1A1A1A',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  optionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  optionLabel: {
    fontSize: 14,
    color: '#1A1A1A',
  },
  timeInForceContainer: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 2,
  },
  timeInForceButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  activeTimeInForce: {
    backgroundColor: 'white',
  },
  timeInForceText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  activeTimeInForceText: {
    color: '#1A1A1A',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  paymentSubtitle: {
    fontSize: 12,
    color: '#8E8E93',
  },
  actionButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  disabledButton: {
    opacity: 0.6,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});