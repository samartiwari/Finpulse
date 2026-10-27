import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Bell, BellRing } from 'lucide-react-native';
import colors from '@/constants/colors';
import type { WatchlistRowData } from '@/hooks/useWatchlistQuotes';
import { formatAssetPrice, formatPercentage } from '@/utils/formatters';

export const WATCHLIST_ROW_HEIGHT = 72;

const LOGO_COLORS = ['#007AFF', '#FF3B30', '#00C896', '#FF9500', '#AF52DE', '#FF2D92'];

export interface WatchlistRowProps {
  item: WatchlistRowData;
  onPress: (symbol: string) => void;
  onLongPress: (symbol: string) => void;
  onToggleAlert: (symbol: string) => void;
}

const priceLabel = (price: number | null) => (price === null ? null : formatAssetPrice(price));
const changeLabel = (percent: number | null) => (percent === null ? null : formatPercentage(percent));

function WatchlistRow({ item, onPress, onLongPress, onToggleAlert }: WatchlistRowProps) {
  const price = priceLabel(item.lastPrice);
  const change = changeLabel(item.priceChangePercent);
  const isPositive = (item.priceChangePercent ?? 0) >= 0;
  const logoColor = LOGO_COLORS[item.baseAsset.charCodeAt(0) % LOGO_COLORS.length];

  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      onPress={() => onPress(item.symbol)}
      onLongPress={() => onLongPress(item.symbol)}
      accessibilityRole="button"
      accessibilityLabel={price ? `${item.baseAsset}, ${price}, ${change}` : item.baseAsset}
      accessibilityHint="Opens the order ticket. Long press for more options."
    >
      <View style={[styles.logo, { backgroundColor: logoColor }]}>
        <Text style={styles.logoText}>{item.baseAsset.charAt(0)}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.symbol}>{item.baseAsset}</Text>
        <Text style={styles.pair}>{item.quoteAsset ? `${item.baseAsset} / ${item.quoteAsset}` : item.symbol}</Text>
      </View>

      {price !== null ? (
        <View style={styles.quote}>
          <Text style={styles.price}>{price}</Text>
          <Text style={[styles.change, { color: isPositive ? colors.green : colors.red }]}>{change}</Text>
        </View>
      ) : (
        <View style={styles.quote}>
          <View style={[styles.placeholder, styles.pricePlaceholder]} />
          <View style={[styles.placeholder, styles.changePlaceholder]} />
        </View>
      )}

      <Pressable
        onPress={() => onToggleAlert(item.symbol)}
        hitSlop={12}
        style={styles.alertButton}
        accessibilityRole="switch"
        accessibilityState={{ checked: item.alertEnabled }}
        accessibilityLabel={`Price alert for ${item.baseAsset}`}
      >
        {item.alertEnabled ? (
          <BellRing size={18} color={colors.primary} />
        ) : (
          <Bell size={18} color={colors.placeholderText} />
        )}
      </Pressable>
    </Pressable>
  );
}

/**
 * Row data is rebuilt as fresh objects on every flushed frame, so React.memo's
 * default shallow compare would re-render every visible row whenever any one
 * symbol ticks. Compare what actually reaches the screen instead: a price move
 * below display precision, or a tick on another symbol, skips the render.
 * Callbacks are compared by reference; the list passes stable ones.
 */
export function areWatchlistRowPropsEqual(prev: WatchlistRowProps, next: WatchlistRowProps): boolean {
  const a = prev.item;
  const b = next.item;
  return (
    a.symbol === b.symbol &&
    a.alertEnabled === b.alertEnabled &&
    priceLabel(a.lastPrice) === priceLabel(b.lastPrice) &&
    changeLabel(a.priceChangePercent) === changeLabel(b.priceChangePercent) &&
    prev.onPress === next.onPress &&
    prev.onLongPress === next.onLongPress &&
    prev.onToggleAlert === next.onToggleAlert
  );
}

export default React.memo(WatchlistRow, areWatchlistRowPropsEqual);

const styles = StyleSheet.create({
  row: {
    height: WATCHLIST_ROW_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: colors.secondaryBackground,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  rowPressed: {
    backgroundColor: colors.background,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  info: {
    flex: 1,
  },
  symbol: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  pair: {
    fontSize: 13,
    color: colors.secondaryText,
  },
  quote: {
    alignItems: 'flex-end',
    marginRight: 12,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
    fontVariant: ['tabular-nums'],
  },
  change: {
    fontSize: 13,
    fontWeight: '500',
    fontVariant: ['tabular-nums'],
  },
  placeholder: {
    height: 12,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  pricePlaceholder: {
    width: 72,
    marginBottom: 6,
  },
  changePlaceholder: {
    width: 44,
  },
  alertButton: {
    padding: 4,
  },
});
