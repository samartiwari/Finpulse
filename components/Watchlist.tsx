import React, { memo, useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
  type AlertButton,
} from 'react-native';
import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import { Plus } from 'lucide-react-native';
import colors from '@/constants/colors';
import WatchlistRow, { WATCHLIST_ROW_HEIGHT } from '@/components/WatchlistRow';
import { useRefreshControl } from '@/hooks/useRefreshControl';
import { useWatchlistQuotes, type WatchlistRowData } from '@/hooks/useWatchlistQuotes';
import { useWatchlistStore, type WatchlistEntry } from '@/store/useWatchlistStore';
import type { StreamStatus } from '@/types/market';
import { showErrorToast, showInfoToast } from '@/utils/toast';

interface WatchlistProps {
  /** Must be referentially stable; rows skip re-rendering based on it. */
  onSelectSymbol: (symbol: string) => void;
}

const STATUS_LABELS: Record<StreamStatus, string> = {
  idle: 'Paused',
  connecting: 'Connecting',
  open: 'Live',
  reconnecting: 'Reconnecting',
};

const keyExtractor = (item: WatchlistRowData) => item.symbol;

// Rows still waiting for their first quote render a skeleton instead of price text.
// Separate recycling pools stop FlashList from recycling one layout into the other.
const getItemType = (item: WatchlistRowData) => (item.lastPrice === null ? 'pending' : 'quote');

const findIndex = (entries: WatchlistEntry[], symbol: string) =>
  entries.findIndex((entry) => entry.symbol === symbol);

export default function Watchlist({ onSelectSymbol }: WatchlistProps) {
  const entries = useWatchlistStore((state) => state.entries);
  const addSymbol = useWatchlistStore((state) => state.addSymbol);
  const removeSymbol = useWatchlistStore((state) => state.removeSymbol);
  const toggleAlert = useWatchlistStore((state) => state.toggleAlert);
  const reorderWatchlist = useWatchlistStore((state) => state.reorderWatchlist);

  const { rows, stream, snapshot } = useWatchlistQuotes(entries);
  const { status, error: streamError, isConnected, reconnect } = stream;
  const { refetch } = snapshot;

  const refresh = useCallback(async () => {
    // After an explicit pull, don't make the user sit out a reconnect backoff.
    if (!isConnected) reconnect();
    await refetch();
  }, [isConnected, reconnect, refetch]);
  const { refreshing, onRefresh } = useRefreshControl(refresh);

  const handleLongPress = useCallback(
    (symbol: string) => {
      // Read the index when the action runs, not when the row rendered; the list may have moved since.
      const currentIndex = () => findIndex(useWatchlistStore.getState().entries, symbol);
      const actions: AlertButton[] = [
        { text: 'Remove', style: 'destructive', onPress: () => removeSymbol(symbol) },
        { text: 'Cancel', style: 'cancel' },
      ];
      if (currentIndex() > 0) {
        actions.unshift({ text: 'Move to top', onPress: () => reorderWatchlist(currentIndex(), 0) });
      }
      Alert.alert(symbol, undefined, actions);
    },
    [removeSymbol, reorderWatchlist],
  );

  const handleAddSymbol = useCallback(
    async (symbol: string) => {
      const result = await addSymbol(symbol);
      if (result === 'invalid') {
        showErrorToast('Pair not found', `${symbol.toUpperCase()} isn't listed on Binance`);
      } else if (result === 'duplicate') {
        showInfoToast('Already watching', `${symbol.toUpperCase()} is in your watchlist`);
      }
    },
    [addSymbol],
  );

  const renderItem = useCallback<ListRenderItem<WatchlistRowData>>(
    ({ item }) => (
      <WatchlistRow
        item={item}
        onPress={onSelectSymbol}
        onLongPress={handleLongPress}
        onToggleAlert={toggleAlert}
      />
    ),
    [onSelectSymbol, handleLongPress, toggleAlert],
  );

  const hasAnyPrice = rows.some((row) => row.lastPrice !== null);
  const notice = snapshot.isError && !hasAnyPrice ? "Couldn't load prices. Pull down to retry." : null;

  const header = useMemo(
    () => <WatchlistHeader status={status} error={streamError} notice={notice} onAddSymbol={handleAddSymbol} />,
    [status, streamError, notice, handleAddSymbol],
  );

  return (
    <FlashList
      data={rows}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemType={getItemType}
      estimatedItemSize={WATCHLIST_ROW_HEIGHT}
      ListHeaderComponent={header}
      ListEmptyComponent={EmptyWatchlist}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }
    />
  );
}

interface WatchlistHeaderProps {
  status: StreamStatus;
  error: string | null;
  notice: string | null;
  onAddSymbol: (symbol: string) => Promise<void>;
}

// Owns the input's state so typing never re-renders the list.
const WatchlistHeader = memo(function WatchlistHeader({ status, error, notice, onAddSymbol }: WatchlistHeaderProps) {
  const [draft, setDraft] = useState('');

  const submit = () => {
    const symbol = draft.trim();
    if (!symbol) return;
    setDraft('');
    void onAddSymbol(symbol);
  };

  const isLive = status === 'open';

  return (
    <View style={styles.header}>
      <View style={styles.addRow}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={submit}
          placeholder="Add a pair, e.g. AVAXUSDT"
          placeholderTextColor={colors.placeholderText}
          autoCapitalize="characters"
          autoCorrect={false}
          returnKeyType="done"
          style={styles.input}
        />
        <Pressable onPress={submit} style={styles.addButton} accessibilityLabel="Add to watchlist">
          <Plus size={20} color="white" />
        </Pressable>
      </View>

      <View style={styles.statusRow}>
        <View style={[styles.statusDot, { backgroundColor: isLive ? colors.green : colors.warning }]} />
        <Text style={styles.statusText}>{STATUS_LABELS[status]}</Text>
        {!isLive && error ? <Text style={styles.statusError} numberOfLines={1}>{` · ${error}`}</Text> : null}
      </View>

      {notice ? <Text style={styles.notice}>{notice}</Text> : null}
    </View>
  );
});

const noop = () => {};

interface WatchlistPreviewProps extends WatchlistProps {
  limit?: number;
}

/** First few rows without virtualization, for embedding inside an existing ScrollView. */
export function WatchlistPreview({ onSelectSymbol, limit = 5 }: WatchlistPreviewProps) {
  const allEntries = useWatchlistStore((state) => state.entries);
  const toggleAlert = useWatchlistStore((state) => state.toggleAlert);
  const entries = useMemo(() => allEntries.slice(0, limit), [allEntries, limit]);
  const { rows } = useWatchlistQuotes(entries);

  if (rows.length === 0) return <EmptyWatchlist />;

  return (
    <View style={styles.preview}>
      {rows.map((item) => (
        <WatchlistRow
          key={item.symbol}
          item={item}
          onPress={onSelectSymbol}
          onLongPress={noop}
          onToggleAlert={toggleAlert}
        />
      ))}
    </View>
  );
}

function EmptyWatchlist() {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyTitle}>Your watchlist is empty</Text>
      <Text style={styles.emptyText}>Add a Binance pair above to start tracking live prices.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 24,
  },
  header: {
    padding: 16,
    backgroundColor: colors.background,
  },
  addRow: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: colors.secondaryBackground,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.text,
  },
  addButton: {
    width: 44,
    borderRadius: 10,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: colors.secondaryText,
  },
  statusError: {
    flex: 1,
    fontSize: 12,
    color: colors.secondaryText,
  },
  notice: {
    marginTop: 8,
    fontSize: 13,
    color: colors.red,
  },
  preview: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  emptyText: {
    fontSize: 14,
    color: colors.secondaryText,
    textAlign: 'center',
    marginTop: 6,
  },
});
