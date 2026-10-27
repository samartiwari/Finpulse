import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Award,
  BarChart3,
  RefreshCw,
  Play,
  Pause,
  RotateCcw,
} from 'lucide-react-native';
import colors from '@/constants/colors';

interface PaperTrade {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  timestamp: Date;
  pnl: number;
  pnlPercent: number;
}

export default function PaperTradingScreen() {
  const router = useRouter();
  const [isActive, setIsActive] = useState(true);
  const [balance, setBalance] = useState(100000); // Starting with $100k virtual money
  const [totalPnL, setTotalPnL] = useState(2450.75);
  const [totalReturn, setTotalReturn] = useState(2.45);
  const [winRate, setWinRate] = useState(68.5);

  const paperTrades: PaperTrade[] = [
    {
      id: '1',
      symbol: 'AAPL',
      type: 'buy',
      quantity: 50,
      entryPrice: 150.25,
      currentPrice: 155.80,
      timestamp: new Date('2024-01-15T10:30:00'),
      pnl: 277.50,
      pnlPercent: 3.69,
    },
    {
      id: '2',
      symbol: 'GOOGL',
      type: 'buy',
      quantity: 10,
      entryPrice: 2750.00,
      currentPrice: 2680.50,
      timestamp: new Date('2024-01-14T14:15:00'),
      pnl: -695.00,
      pnlPercent: -2.53,
    },
    {
      id: '3',
      symbol: 'TSLA',
      type: 'buy',
      quantity: 25,
      entryPrice: 245.80,
      currentPrice: 268.90,
      timestamp: new Date('2024-01-13T11:45:00'),
      pnl: 577.50,
      pnlPercent: 9.40,
    },
    {
      id: '4',
      symbol: 'MSFT',
      type: 'buy',
      quantity: 30,
      entryPrice: 380.50,
      currentPrice: 375.20,
      timestamp: new Date('2024-01-12T09:20:00'),
      pnl: -159.00,
      pnlPercent: -1.39,
    },
  ];

  const achievements = [
    { title: 'First Trade', description: 'Complete your first paper trade', earned: true },
    { title: 'Profit Maker', description: 'Achieve 5% total return', earned: true },
    { title: 'Risk Manager', description: 'Keep max loss under 2%', earned: false },
    { title: 'Consistency', description: '10 consecutive profitable days', earned: false },
  ];

  const handleResetPortfolio = () => {
    Alert.alert(
      'Reset Portfolio',
      'This will reset your paper trading portfolio to $100,000. All trades and statistics will be cleared.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            setBalance(100000);
            setTotalPnL(0);
            setTotalReturn(0);
            setWinRate(0);
            Alert.alert('Success', 'Portfolio has been reset!');
          }
        }
      ]
    );
  };

  const handleToggleTrading = () => {
    setIsActive(!isActive);
    Alert.alert(
      isActive ? 'Trading Paused' : 'Trading Resumed',
      isActive ? 'Paper trading has been paused' : 'Paper trading has been resumed'
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Paper Trading',
          headerStyle: { backgroundColor: colors.background },
          headerTitleStyle: { color: colors.text, fontWeight: '600' },
          headerRight: () => (
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={handleToggleTrading} style={styles.headerButton}>
                {isActive ? <Pause size={20} color={colors.primary} /> : <Play size={20} color={colors.green} />}
              </TouchableOpacity>
              <TouchableOpacity onPress={handleResetPortfolio} style={styles.headerButton}>
                <RotateCcw size={20} color={colors.red} />
              </TouchableOpacity>
            </View>
          ),
        }} 
      />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Portfolio Overview */}
        <View style={styles.overviewCard}>
          <View style={styles.balanceSection}>
            <Text style={styles.balanceLabel}>Virtual Balance</Text>
            <Text style={styles.balanceValue}>${balance.toLocaleString()}</Text>
            <View style={styles.pnlContainer}>
              <Text style={[
                styles.pnlValue,
                { color: totalPnL >= 0 ? colors.green : colors.red }
              ]}>
                {totalPnL >= 0 ? '+' : ''}${totalPnL.toLocaleString()}
              </Text>
              <Text style={[
                styles.pnlPercent,
                { color: totalReturn >= 0 ? colors.green : colors.red }
              ]}>
                ({totalReturn >= 0 ? '+' : ''}{totalReturn}%)
              </Text>
            </View>
          </View>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Target size={20} color={colors.primary} />
              <Text style={styles.statValue}>{winRate}%</Text>
              <Text style={styles.statLabel}>Win Rate</Text>
            </View>
            <View style={styles.statItem}>
              <BarChart3 size={20} color={colors.blue} />
              <Text style={styles.statValue}>{paperTrades.length}</Text>
              <Text style={styles.statLabel}>Total Trades</Text>
            </View>
            <View style={styles.statItem}>
              <Award size={20} color={colors.orange} />
              <Text style={styles.statValue}>4</Text>
              <Text style={styles.statLabel}>Achievements</Text>
            </View>
          </View>
        </View>

        {/* Status Indicator */}
        <View style={[
          styles.statusCard,
          { backgroundColor: isActive ? colors.green + '10' : colors.red + '10' }
        ]}>
          <View style={[
            styles.statusIndicator,
            { backgroundColor: isActive ? colors.green : colors.red }
          ]} />
          <Text style={[
            styles.statusText,
            { color: isActive ? colors.green : colors.red }
          ]}>
            Paper Trading {isActive ? 'Active' : 'Paused'}
          </Text>
        </View>

        {/* Current Positions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Positions</Text>
          {paperTrades.map((trade) => (
            <View key={trade.id} style={styles.tradeCard}>
              <View style={styles.tradeHeader}>
                <View style={styles.tradeInfo}>
                  <Text style={styles.tradeSymbol}>{trade.symbol}</Text>
                  <Text style={styles.tradeQuantity}>{trade.quantity} shares</Text>
                </View>
                <View style={styles.tradePnL}>
                  <Text style={[
                    styles.tradePnLValue,
                    { color: trade.pnl >= 0 ? colors.green : colors.red }
                  ]}>
                    {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                  </Text>
                  <Text style={[
                    styles.tradePnLPercent,
                    { color: trade.pnlPercent >= 0 ? colors.green : colors.red }
                  ]}>
                    ({trade.pnlPercent >= 0 ? '+' : ''}{trade.pnlPercent}%)
                  </Text>
                </View>
              </View>
              
              <View style={styles.tradeDetails}>
                <View style={styles.priceInfo}>
                  <Text style={styles.priceLabel}>Entry</Text>
                  <Text style={styles.priceValue}>${trade.entryPrice.toFixed(2)}</Text>
                </View>
                <View style={styles.priceInfo}>
                  <Text style={styles.priceLabel}>Current</Text>
                  <Text style={styles.priceValue}>${trade.currentPrice.toFixed(2)}</Text>
                </View>
                <View style={styles.priceInfo}>
                  <Text style={styles.priceLabel}>Date</Text>
                  <Text style={styles.priceValue}>
                    {trade.timestamp.toLocaleDateString()}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          {achievements.map((achievement, index) => (
            <View key={index} style={[
              styles.achievementCard,
              !achievement.earned && styles.lockedAchievement
            ]}>
              <Award 
                size={24} 
                color={achievement.earned ? colors.orange : colors.secondaryText} 
              />
              <View style={styles.achievementInfo}>
                <Text style={[
                  styles.achievementTitle,
                  !achievement.earned && styles.lockedText
                ]}>
                  {achievement.title}
                </Text>
                <Text style={[
                  styles.achievementDescription,
                  !achievement.earned && styles.lockedText
                ]}>
                  {achievement.description}
                </Text>
              </View>
              {achievement.earned && (
                <View style={styles.earnedBadge}>
                  <Text style={styles.earnedText}>✓</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => router.push('/trading')}
          >
            <DollarSign size={20} color="white" />
            <Text style={styles.actionButtonText}>Place Paper Trade</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.secondaryButton]} 
            onPress={() => router.push('/analysis')}
          >
            <BarChart3 size={20} color={colors.primary} />
            <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>View Analysis</Text>
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
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
  },
  overviewCard: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  balanceSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  balanceLabel: {
    fontSize: 14,
    color: colors.secondaryText,
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  pnlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pnlValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  pnlPercent: {
    fontSize: 16,
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: colors.secondaryText,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  tradeCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tradeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tradeInfo: {
    flex: 1,
  },
  tradeSymbol: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  tradeQuantity: {
    fontSize: 12,
    color: colors.secondaryText,
  },
  tradePnL: {
    alignItems: 'flex-end',
  },
  tradePnLValue: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  tradePnLPercent: {
    fontSize: 12,
    fontWeight: '500',
  },
  tradeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  priceInfo: {
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 10,
    color: colors.secondaryText,
    marginBottom: 2,
  },
  priceValue: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  lockedAchievement: {
    opacity: 0.6,
  },
  achievementInfo: {
    flex: 1,
    marginLeft: 12,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: 12,
    color: colors.secondaryText,
  },
  lockedText: {
    color: colors.secondaryText,
  },
  earnedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.green,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  earnedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  actionButtons: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: colors.primary,
  },
});