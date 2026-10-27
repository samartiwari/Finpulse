"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  Dimensions,
} from "react-native"
import { Stack, useRouter } from "expo-router"
import { TrendingUp, TrendingDown, Plus, MoveHorizontal as MoreHorizontal, ChartPie as PieChart, ChartBar as BarChart3, DollarSign, Percent, Eye, Settings } from "lucide-react-native"
import colors from "@/constants/colors"
import StockItem from "@/components/StockItem"
import TimeframeSelector from "@/components/TimeframeSelector"
import type { PortfolioStock, ChartData } from "@/types/stock"
import { mockPortfolioStocks } from "@/mocks/stocks"

const { width } = Dimensions.get("window")

interface PortfolioSummary {
  totalValue: number
  totalCost: number
  totalGainLoss: number
  totalGainLossPercent: number
  dayChange: number
  dayChangePercent: number
}

export default function PortfolioScreen() {
  const router = useRouter()
  const [timeframe, setTimeframe] = useState("1D")
  const [refreshing, setRefreshing] = useState(false)
  const [portfolioStocks, setPortfolioStocks] = useState<PortfolioStock[]>(mockPortfolioStocks)
  const [portfolioSummary, setPortfolioSummary] = useState<PortfolioSummary>({
    totalValue: 0,
    totalCost: 0,
    totalGainLoss: 0,
    totalGainLossPercent: 0,
    dayChange: 0,
    dayChangePercent: 0,
  })
  const [chartData, setChartData] = useState<ChartData[]>([])

  useEffect(() => {
    calculatePortfolioSummary()
    generateChartData()
  }, [portfolioStocks, timeframe])

  const calculatePortfolioSummary = () => {
    const totalValue = portfolioStocks.reduce((sum, stock) => sum + stock.price * stock.shares, 0)
    const totalCost = portfolioStocks.reduce((sum, stock) => sum + stock.averageCost * stock.shares, 0)
    const totalGainLoss = totalValue - totalCost
    const totalGainLossPercent = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0
    const dayChange = portfolioStocks.reduce((sum, stock) => sum + stock.change * stock.shares, 0)
    const dayChangePercent = totalValue > 0 ? (dayChange / (totalValue - dayChange)) * 100 : 0

    setPortfolioSummary({
      totalValue,
      totalCost,
      totalGainLoss,
      totalGainLossPercent,
      dayChange,
      dayChangePercent,
    })
  }

  const generateChartData = () => {
    const days =
      timeframe === "1D"
        ? 1
        : timeframe === "1W"
          ? 7
          : timeframe === "1M"
            ? 30
            : timeframe === "3M"
              ? 90
              : timeframe === "6M"
                ? 180
                : 365
    const data: ChartData[] = []

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const baseValue = portfolioSummary.totalValue || 50000
      const variation = (Math.random() - 0.5) * baseValue * 0.1
      data.push({
        date: date.toISOString().split("T")[0],
        value: baseValue + variation,
      })
    }

    setChartData(data)
  }

  const onRefresh = async () => {
    setRefreshing(true)
    // Simulate API call
    setTimeout(() => {
      const updatedStocks = portfolioStocks.map((stock) => ({
        ...stock,
        price: stock.price + (Math.random() - 0.5) * 10,
        change: (Math.random() - 0.5) * 20,
        changePercent: (Math.random() - 0.5) * 10,
      }))
      setPortfolioStocks(updatedStocks)
      setRefreshing(false)
    }, 2000)
  }

  const handleStockPress = (stock: PortfolioStock) => {
    router.push(`/stock/${stock.id}`)
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const formatPercent = (percent: number): string => {
    return `${percent >= 0 ? "+" : ""}${percent.toFixed(2)}%`
  }

  const isPositive = portfolioSummary.totalGainLoss >= 0
  const isDayPositive = portfolioSummary.dayChange >= 0

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Portfolio",
          headerStyle: { backgroundColor: colors.background },
          headerTitleStyle: { color: colors.text, fontWeight: "600" },
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push("/profile")}>
              <Settings size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Portfolio Summary */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>Total Portfolio Value</Text>
            <TouchableOpacity onPress={() => router.push("/portfolio")}>
              <Eye size={20} color={colors.secondaryText} />
            </TouchableOpacity>
          </View>

          <Text style={styles.totalValue}>{formatCurrency(portfolioSummary.totalValue)}</Text>

          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Gain/Loss</Text>
              <Text style={[styles.summaryValue, { color: isPositive ? colors.green : colors.red }]}>
                {formatCurrency(portfolioSummary.totalGainLoss)} ({formatPercent(portfolioSummary.totalGainLossPercent)}
                )
              </Text>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Today's Change</Text>
              <View style={styles.changeContainer}>
                {isDayPositive ? (
                  <TrendingUp size={16} color={colors.green} />
                ) : (
                  <TrendingDown size={16} color={colors.red} />
                )}
                <Text style={[styles.summaryValue, { color: isDayPositive ? colors.green : colors.red }]}>
                  {formatCurrency(portfolioSummary.dayChange)} ({formatPercent(portfolioSummary.dayChangePercent)})
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Chart Section */}
        <View style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Performance</Text>
            <TimeframeSelector selectedTimeframe={timeframe} onTimeframeChange={setTimeframe} />
          </View>

          {/* Simple Chart Placeholder */}
          <View style={styles.chartPlaceholder}>
            <Text style={styles.chartPlaceholderText}>Portfolio Chart ({timeframe})</Text>
            <Text style={styles.chartPlaceholderSubtext}>Chart visualization would go here</Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <DollarSign size={20} color={colors.primary} />
              <Text style={styles.statValue}>{formatCurrency(portfolioSummary.totalCost)}</Text>
              <Text style={styles.statLabel}>Total Invested</Text>
            </View>
            <View style={styles.statCard}>
              <PieChart size={20} color={colors.blue} />
              <Text style={styles.statValue}>{portfolioStocks.length}</Text>
              <Text style={styles.statLabel}>Holdings</Text>
            </View>
            <View style={styles.statCard}>
              <Percent size={20} color={colors.orange} />
              <Text style={styles.statValue}>{formatPercent(portfolioSummary.totalGainLossPercent)}</Text>
              <Text style={styles.statLabel}>Total Return</Text>
            </View>
            <View style={styles.statCard}>
              <BarChart3 size={20} color={colors.green} />
              <Text style={styles.statValue}>{formatPercent(portfolioSummary.dayChangePercent)}</Text>
              <Text style={styles.statLabel}>Day Return</Text>
            </View>
          </View>
        </View>

        {/* Holdings */}
        <View style={styles.holdingsContainer}>
          <View style={styles.holdingsHeader}>
            <Text style={styles.holdingsTitle}>Your Holdings</Text>
            <TouchableOpacity onPress={() => router.push("/trading")}>
              <Plus size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {portfolioStocks.length > 0 ? (
            portfolioStocks.map((stock, index) => {
              const currentValue = stock.price * stock.shares
              const costBasis = stock.averageCost * stock.shares
              const gainLoss = currentValue - costBasis
              const gainLossPercent = (gainLoss / costBasis) * 100

              return (
                <View key={`portfolio-stock-${stock.id}-${index}`} style={styles.holdingItem}>
                  <StockItem stock={stock} onPress={() => handleStockPress(stock)} showHoldings={true} />
                  <View style={styles.holdingDetails}>
                    <View style={styles.holdingRow}>
                      <Text style={styles.holdingLabel}>Shares: {stock.shares}</Text>
                      <Text style={styles.holdingLabel}>Avg Cost: {formatCurrency(stock.averageCost)}</Text>
                    </View>
                    <View style={styles.holdingRow}>
                      <Text style={styles.holdingLabel}>Value: {formatCurrency(currentValue)}</Text>
                      <Text style={[styles.holdingGainLoss, { color: gainLoss >= 0 ? colors.green : colors.red }]}>
                        {formatCurrency(gainLoss)} ({formatPercent(gainLossPercent)})
                      </Text>
                    </View>
                  </View>
                </View>
              )
            })
          ) : (
            <View style={styles.emptyState}>
              <PieChart size={48} color={colors.secondaryText} />
              <Text style={styles.emptyStateTitle}>No Holdings Yet</Text>
              <Text style={styles.emptyStateText}>Start building your portfolio by buying your first stock</Text>
              <TouchableOpacity style={styles.emptyStateButton} onPress={() => router.push("/trading")}>
                <Text style={styles.emptyStateButtonText}>Browse Stocks</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity style={styles.quickActionButton} onPress={() => router.push("/trading")}>
            <Plus size={20} color={colors.primary} />
            <Text style={styles.quickActionText}>Buy Stocks</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickActionButton} onPress={() => router.push("/portfolio")}>
            <BarChart3 size={20} color={colors.primary} />
            <Text style={styles.quickActionText}>Analytics</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickActionButton} onPress={() => router.push("/history")}>
            <TrendingUp size={20} color={colors.primary} />
            <Text style={styles.quickActionText}>History</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickActionButton} onPress={() => router.push("/profile")}>
            <MoreHorizontal size={20} color={colors.primary} />
            <Text style={styles.quickActionText}>More</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  summaryContainer: {
    backgroundColor: "white",
    margin: 16,
    borderRadius: 12,
    padding: 20,
  },
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryTitle: {
    fontSize: 16,
    color: colors.secondaryText,
    fontWeight: "500",
  },
  totalValue: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 16,
  },
  summaryRow: {
    marginBottom: 12,
  },
  summaryItem: {
    flexDirection: "column",
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.secondaryText,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  changeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  chartContainer: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  chartPlaceholder: {
    height: 200,
    backgroundColor: colors.background,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  chartPlaceholderText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  chartPlaceholderSubtext: {
    fontSize: 14,
    color: colors.secondaryText,
  },
  statsContainer: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 12,
    color: colors.secondaryText,
    textAlign: "center",
  },
  holdingsContainer: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
  },
  holdingsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  holdingsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  holdingItem: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 16,
    marginBottom: 16,
  },
  holdingDetails: {
    marginTop: 8,
    paddingLeft: 52,
  },
  holdingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  holdingLabel: {
    fontSize: 12,
    color: colors.secondaryText,
  },
  holdingGainLoss: {
    fontSize: 12,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.secondaryText,
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  emptyStateButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  quickActionsContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    marginHorizontal: 16,
    marginBottom: 32,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
    gap: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: "600",
  },
})
