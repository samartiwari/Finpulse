import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useForm } from '@/hooks/useForm';
import { buyStockSchema, sellStockSchema, BuyStockFormData, SellStockFormData } from '@/validation/schemas';
import FormInput from '@/components/common/FormInput';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import colors from '@/constants/colors';
import { useCurrency } from '@/utils/currency';

interface TradingFormProps {
  type: 'buy' | 'sell';
  stock: {
    symbol: string;
    name: string;
    price: number;
  };
  onSubmit: (data: BuyStockFormData | SellStockFormData) => Promise<void>;
  availableQuantity?: number;
}

export default function TradingForm({ 
  type, 
  stock, 
  onSubmit, 
  availableQuantity = 0 
}: TradingFormProps) {
  const { format } = useCurrency();
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');

  const form = useForm({
    initialValues: {
      quantity: '',
      orderType: 'market' as 'market' | 'limit',
      limitPrice: '',
    },
    validationSchema: type === 'buy' ? buyStockSchema : sellStockSchema,
    onSubmit,
  });

  const quantity = parseInt(form.values.quantity) || 0;
  const price = orderType === 'market' ? stock.price : (parseFloat(form.values.limitPrice) || 0);
  const totalAmount = quantity * price;

  const isBuy = type === 'buy';

  return (
    <View style={styles.container}>
      {/* Stock Info */}
      <Card style={styles.stockInfo}>
        <Text style={styles.stockSymbol}>{stock.symbol}</Text>
        <Text style={styles.stockName}>{stock.name}</Text>
        <Text style={styles.stockPrice}>{format(stock.price)}</Text>
      </Card>

      {/* Order Type Selector */}
      <Card style={styles.orderTypeCard}>
        <Text style={styles.sectionTitle}>Order Type</Text>
        <View style={styles.orderTypeButtons}>
          <TouchableOpacity
            style={[
              styles.orderTypeButton,
              orderType === 'market' && styles.orderTypeButtonActive,
            ]}
            onPress={() => {
              setOrderType('market');
              form.setValue('orderType', 'market');
            }}
          >
            <Text style={[
              styles.orderTypeText,
              orderType === 'market' && styles.orderTypeTextActive,
            ]}>
              Market
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.orderTypeButton,
              orderType === 'limit' && styles.orderTypeButtonActive,
            ]}
            onPress={() => {
              setOrderType('limit');
              form.setValue('orderType', 'limit');
            }}
          >
            <Text style={[
              styles.orderTypeText,
              orderType === 'limit' && styles.orderTypeTextActive,
            ]}>
              Limit
            </Text>
          </TouchableOpacity>
        </View>
      </Card>

      {/* Form Fields */}
      <Card style={styles.formCard}>
        <FormInput
          label="Quantity"
          value={form.values.quantity}
          onChangeText={(text) => form.setValue('quantity', text)}
          onBlur={() => form.setFieldTouched('quantity')}
          placeholder="Enter quantity"
          keyboardType="numeric"
          error={form.errors.quantity}
          touched={form.touched.quantity}
          required
        />

        {orderType === 'limit' && (
          <FormInput
            label="Limit Price"
            value={form.values.limitPrice}
            onChangeText={(text) => form.setValue('limitPrice', text)}
            onBlur={() => form.setFieldTouched('limitPrice')}
            placeholder="Enter limit price"
            keyboardType="numeric"
            error={form.errors.limitPrice}
            touched={form.touched.limitPrice}
            required
          />
        )}

        {/* Order Summary */}
        <View style={styles.orderSummary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Quantity:</Text>
            <Text style={styles.summaryValue}>{quantity || 0}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Price:</Text>
            <Text style={styles.summaryValue}>
              {orderType === 'market' ? 'Market Price' : format(price)}
            </Text>
          </View>
          
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Amount:</Text>
            <Text style={styles.totalValue}>{format(totalAmount)}</Text>
          </View>
        </View>

        {!isBuy && availableQuantity > 0 && (
          <Text style={styles.availableText}>
            Available: {availableQuantity} shares
          </Text>
        )}

        <Button
          title={`${isBuy ? 'Buy' : 'Sell'} ${stock.symbol}`}
          onPress={form.handleSubmit}
          loading={form.isSubmitting}
          disabled={form.isSubmitting || quantity === 0}
          variant={isBuy ? 'primary' : 'secondary'}
          style={styles.submitButton}
        />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  stockInfo: {
    alignItems: 'center',
  },
  stockSymbol: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  stockName: {
    fontSize: 16,
    color: colors.secondaryText,
    marginBottom: 8,
  },
  stockPrice: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primary,
  },
  orderTypeCard: {},
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  orderTypeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  orderTypeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  orderTypeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  orderTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  orderTypeTextActive: {
    color: 'white',
  },
  formCard: {},
  orderSummary: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.secondaryText,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  availableText: {
    fontSize: 12,
    color: colors.secondaryText,
    textAlign: 'center',
    marginTop: 8,
  },
  submitButton: {
    marginTop: 16,
  },
});