import React, { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { CloudOff, Star } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useStockMarketStream } from '@/hooks/useStockMarketStream';
import { splitSymbol } from '@/services/binance';
import type { Order, OrderSide, OrderStatus } from '@/store/orderLedger';
import { useOrderStore } from '@/store/useOrderStore';
import { useIsWatchlisted, useWatchlistStore } from '@/store/useWatchlistStore';
import { formatAssetPrice, formatPercentage } from '@/utils/formatters';
import { showInfoToast } from '@/utils/toast';

const RECENT_ORDER_LIMIT = 20;

const STATUS_APPEARANCE: Record<OrderStatus, { label: string; color: string }> = {
  PENDING_SYNC: { label: 'Pending sync', color: colors.warning },
  SYNCING: { label: 'Sending', color: colors.info },
  EXECUTED: { label: 'Executed', color: colors.green },
  REJECTED: { label: 'Rejected', color: colors.red },
};

export default function TradeScreen() {
  const params = useLocalSearchParams<{ symbol: string }>();
  const symbol = (params.symbol ?? '').toUpperCase();
  const { baseAsset, quoteAsset } = splitSymbol(symbol);

  const { price, priceChangePercent, isConnected, isConnecting } = useStockMarketStream(symbol);

  const cashBalance = useOrderStore((state) => state.optimistic.cashBalance);
  const position = useOrderStore((state) => state.optimistic.positions[symbol]);
  const isOnline = useOrderStore((state) => state.isOnline);
  const queuedCount = useOrderStore((state) => state.queue.length);
  const allOrders = useOrderStore((state) => state.orders);
  const placeOrder = useOrderStore((state) => state.placeOrder);

  const recentOrders = useMemo(
    () => allOrders.filter((order) => order.symbol === symbol).slice(0, RECENT_ORDER_LIMIT),
    [allOrders, symbol],
  );

  const isWatchlisted = useIsWatchlisted(symbol);
  const addSymbol = useWatchlistStore((state) => state.addSymbol);
  const removeSymbol = useWatchlistStore((state) => state.removeSymbol);

  const [quantityText, setQuantityText] = useState('');
  const quantity = Number(quantityText);
  const canSubmit = price !== null && quantity > 0;

  const submit = (side: OrderSide) => {
    if (price === null) return;
    const result = placeOrder({ symbol, side, quantity, price });
    if (!result.ok) {
      Alert.alert('Order not placed', result.reason);
      return;
    }
    setQuantityText('');
    if (result.order.placedOffline) {
      showInfoToast('Order queued', "It will be sent as soon as you're back online.");
    }
  };

  const toggleWatchlist = () => {
    if (isWatchlisted) removeSymbol(symbol);
    else void addSymbol(symbol);
  };

  const isPositive = (priceChangePercent ?? 0) >= 0;
  const liveLabel = isConnected ? 'Live' : isConnecting ? 'Connecting' : 'Offline';

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Stack.Screen
        options={{
          title: baseAsset,
          headerRight: () => (
            <Pressable onPress={toggleWatchlist} hitSlop={12} accessibilityLabel="Toggle watchlist">
              <Star
                size={22}
                color={isWatchlisted ? colors.warning : colors.secondaryText}
                fill={isWatchlisted ? colors.warning : 'transparent'}
              />
            </Pressable>
          ),
        }}
      />

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {!isOnline && (
          <View style={styles.offlineBanner}>
            <CloudOff size={18} color={colors.warning} />
            <Text style={styles.offlineText}>
              You're offline. Orders are saved on this device and sent in order once you reconnect.
              {queuedCount > 0 ? ` ${queuedCount} waiting.` : ''}
            </Text>
          </View>
        )}

        <View style={styles.card}>
          <View style={styles.quoteHeader}>
            <Text style={styles.pair}>{quoteAsset ? `${baseAsset} / ${quoteAsset}` : symbol}</Text>
            <View style={styles.liveBadge}>
              <View style={[styles.liveDot, { backgroundColor: isConnected ? colors.green : colors.warning }]} />
              <Text style={styles.liveText}>{liveLabel}</Text>
            </View>
          </View>
          <Text style={styles.price}>{price === null ? '--' : formatAssetPrice(price)}</Text>
          {priceChangePercent !== null && (
            <Text style={[styles.change, { color: isPositive ? colors.green : colors.red }]}>
              {formatPercentage(priceChangePercent)} today
            </Text>
          )}
        </View>

        <View style={[styles.card, styles.balances]}>
          <Balance label="Available cash" value={`${formatAssetPrice(cashBalance)} ${quoteAsset || 'USDT'}`} />
          <Balance label="Holding" value={position ? `${position.quantity} ${baseAsset}` : `0 ${baseAsset}`} />
          <Balance
            label="Avg. price"
            value={position ? formatAssetPrice(position.costBasis / position.quantity) : '--'}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Quantity ({baseAsset})</Text>
          <TextInput
            value={quantityText}
            onChangeText={setQuantityText}
            placeholder="0.00"
            placeholderTextColor={colors.placeholderText}
            keyboardType="decimal-pad"
            style={styles.input}
          />
          <Text style={styles.estimate}>
            {canSubmit ? `Est. value ${formatAssetPrice(quantity * price)} ${quoteAsset}` : 'Market order'}
          </Text>
          <View style={styles.actions}>
            <Pressable
              style={[styles.actionButton, styles.buyButton, !canSubmit && styles.disabled]}
              disabled={!canSubmit}
              onPress={() => submit('BUY')}
            >
              <Text style={styles.actionText}>Buy</Text>
            </Pressable>
            <Pressable
              style={[styles.actionButton, styles.sellButton, !canSubmit && styles.disabled]}
              disabled={!canSubmit}
              onPress={() => submit('SELL')}
            >
              <Text style={styles.actionText}>Sell</Text>
            </Pressable>
          </View>
        </View>

        {recentOrders.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Orders</Text>
            {recentOrders.map((order) => (
              <OrderRow key={order.id} order={order} />
            ))}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Balance({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.balance}>
      <Text style={styles.balanceLabel}>{label}</Text>
      <Text style={styles.balanceValue}>{value}</Text>
    </View>
  );
}

function OrderRow({ order }: { order: Order }) {
  const appearance = STATUS_APPEARANCE[order.status];
  const price = order.executedPrice ?? order.requestedPrice;

  return (
    <View style={styles.orderRow}>
      <View style={styles.orderInfo}>
        <Text style={styles.orderTitle}>
          <Text style={{ color: order.side === 'BUY' ? colors.green : colors.red }}>{order.side}</Text>
          {`  ${order.quantity} @ ${formatAssetPrice(price)}`}
        </Text>
        <Text style={styles.orderMeta}>
          {new Date(order.createdAt).toLocaleTimeString()}
          {order.placedOffline ? ' · placed offline' : ''}
        </Text>
        {order.rejectionReason && <Text style={styles.orderReason}>{order.rejectionReason}</Text>}
      </View>
      <View style={[styles.statusChip, { backgroundColor: `${appearance.color}1A` }]}>
        <Text style={[styles.statusText, { color: appearance.color }]}>{appearance.label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    gap: 12,
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#FFF4E5',
  },
  offlineText: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
  },
  card: {
    backgroundColor: colors.secondaryBackground,
    borderRadius: 12,
    padding: 16,
  },
  quoteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pair: {
    fontSize: 14,
    color: colors.secondaryText,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  liveText: {
    fontSize: 12,
    color: colors.secondaryText,
  },
  price: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
    fontVariant: ['tabular-nums'],
  },
  change: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  balances: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balance: {
    flex: 1,
  },
  balanceLabel: {
    fontSize: 12,
    color: colors.secondaryText,
  },
  balanceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginTop: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 18,
    color: colors.text,
  },
  estimate: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buyButton: {
    backgroundColor: colors.green,
  },
  sellButton: {
    backgroundColor: colors.red,
  },
  disabled: {
    opacity: 0.4,
  },
  actionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  orderInfo: {
    flex: 1,
    marginRight: 12,
  },
  orderTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  orderMeta: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 2,
  },
  orderReason: {
    fontSize: 12,
    color: colors.red,
    marginTop: 2,
  },
  statusChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
