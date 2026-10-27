import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import {
  TrendingUp,
  TrendingDown,
  Clock,
  Target,
  Shield,
  Zap,
  BarChart3,
  Settings,
  AlertTriangle,
  DollarSign,
  Percent,
} from 'lucide-react-native';
import colors from '@/constants/colors';

type OrderType = 'market' | 'limit' | 'stop' | 'stopLimit';
type TimeInForce = 'day' | 'gtc' | 'ioc' | 'fok';

export default function AdvancedTradingScreen() {
  const router = useRouter();
  const [orderType, setOrderType] = useState<OrderType>('market');
  const [timeInForce, setTimeInForce] = useState<TimeInForce>('day');
  const [quantity, setQuantity] = useState('');
  const [limitPrice, setLimitPrice] = useState('');
  const [stopPrice, setStopPrice] = useState('');
  const [extendedHours, setExtendedHours] = useState(false);
  const [fractionalShares, setFractionalShares] = useState(false);
  const [marginTrading, setMarginTrading] = useState(false);

  const orderTypes = [
    { id: 'market', name: 'Market', icon: <Zap size={20} color={colors.primary} />, description: 'Execute immediately at current price' },
    { id: 'limit', name: 'Limit', icon: <Target size={20} color={colors.blue} />, description: 'Execute at specified price or better' },
    { id: 'stop', name: 'Stop Loss', icon: <Shield size={20} color={colors.red} />, description: 'Sell when price drops to stop price' },
    { id: 'stopLimit', name: 'Stop Limit', icon: <BarChart3 size={20} color={colors.orange} />, description: 'Stop order that becomes limit order' },
  ];

  const timeInForceOptions = [
    { id: 'day', name: 'Day', description: 'Valid until market close' },
    { id: 'gtc', name: 'GTC', description: 'Good Till Canceled' },
    { id: 'ioc', name: 'IOC', description: 'Immediate or Cancel' },
    { id: 'fok', name: 'FOK', description: 'Fill or Kill' },
  ];

  const handlePlaceOrder = () => {
    if (!quantity) {
      Alert.alert('Error', 'Please enter quantity');
      return;
    }

    if (orderType === 'limit' && !limitPrice) {
      Alert.alert('Error', 'Please enter limit price');
      return;
    }

    if ((orderType === 'stop' || orderType === 'stopLimit') && !stopPrice) {
      Alert.alert('Error', 'Please enter stop price');
      return;
    }

    Alert.alert(
      'Confirm Order',
      `Place ${orderType} order for ${quantity} shares?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Place Order', onPress: () => {
          Alert.alert('Success', 'Order placed successfully!');
          router.back();
        }}
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Advanced Trading',
          headerStyle: { backgroundColor: colors.background },
          headerTitleStyle: { color: colors.text, fontWeight: '600' },
        }} 
      />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Order Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Type</Text>
          <View style={styles.orderTypeGrid}>
            {orderTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.orderTypeCard,
                  orderType === type.id && styles.selectedOrderType
                ]}
                onPress={() => setOrderType(type.id as OrderType)}
              >
                {type.icon}
                <Text style={[
                  styles.orderTypeName,
                  orderType === type.id && styles.selectedOrderTypeName
                ]}>{type.name}</Text>
                <Text style={styles.orderTypeDescription}>{type.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Order Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Details</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Quantity</Text>
            <TextInput
              style={styles.input}
              value={quantity}
              onChangeText={setQuantity}
              placeholder="Enter shares"
              keyboardType="numeric"
            />
          </View>

          {orderType === 'limit' || orderType === 'stopLimit' ? (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Limit Price</Text>
              <TextInput
                style={styles.input}
                value={limitPrice}
                onChangeText={setLimitPrice}
                placeholder="$0.00"
                keyboardType="numeric"
              />
            </View>
          ) : null}

          {orderType === 'stop' || orderType === 'stopLimit' ? (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Stop Price</Text>
              <TextInput
                style={styles.input}
                value={stopPrice}
                onChangeText={setStopPrice}
                placeholder="$0.00"
                keyboardType="numeric"
              />
            </View>
          ) : null}
        </View>

        {/* Time in Force */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Time in Force</Text>
          <View style={styles.timeInForceContainer}>
            {timeInForceOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.timeInForceOption,
                  timeInForce === option.id && styles.selectedTimeInForce
                ]}
                onPress={() => setTimeInForce(option.id as TimeInForce)}
              >
                <Text style={[
                  styles.timeInForceName,
                  timeInForce === option.id && styles.selectedTimeInForceName
                ]}>{option.name}</Text>
                <Text style={styles.timeInForceDescription}>{option.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Advanced Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Advanced Options</Text>
          
          <View style={styles.optionRow}>
            <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>Extended Hours Trading</Text>
              <Text style={styles.optionDescription}>Trade before and after market hours</Text>
            </View>
            <Switch
              value={extendedHours}
              onValueChange={setExtendedHours}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
          </View>

          <View style={styles.optionRow}>
            <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>Fractional Shares</Text>
              <Text style={styles.optionDescription}>Buy partial shares with dollar amounts</Text>
            </View>
            <Switch
              value={fractionalShares}
              onValueChange={setFractionalShares}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
          </View>

          <View style={styles.optionRow}>
            <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>Margin Trading</Text>
              <Text style={styles.optionDescription}>Use borrowed funds to increase buying power</Text>
            </View>
            <Switch
              value={marginTrading}
              onValueChange={setMarginTrading}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
          </View>
        </View>

        {/* Risk Warning */}
        <View style={styles.warningContainer}>
          <AlertTriangle size={20} color={colors.orange} />
          <Text style={styles.warningText}>
            Advanced trading features involve higher risk. Please ensure you understand the implications before proceeding.
          </Text>
        </View>

        {/* Place Order Button */}
        <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
          <Text style={styles.placeOrderText}>Place Order</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  section: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  orderTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  orderTypeCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOrderType: {
    borderColor: colors.primary,
    backgroundColor: colors.card,
  },
  orderTypeName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  selectedOrderTypeName: {
    color: colors.primary,
  },
  orderTypeDescription: {
    fontSize: 12,
    color: colors.secondaryText,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timeInForceContainer: {
    gap: 8,
  },
  timeInForceOption: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedTimeInForce: {
    borderColor: colors.primary,
    backgroundColor: colors.card,
  },
  timeInForceName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  selectedTimeInForceName: {
    color: colors.primary,
  },
  timeInForceDescription: {
    fontSize: 12,
    color: colors.secondaryText,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 12,
    color: colors.secondaryText,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    color: '#856404',
    lineHeight: 16,
  },
  placeOrderButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginBottom: 32,
    alignItems: 'center',
  },
  placeOrderText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});