"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Alert, Dimensions } from "react-native"
import { Stack, useRouter, useLocalSearchParams } from "expo-router"
import { Star, Bell, Share, TrendingUp, TrendingDown, Plus, Minus } from "lucide-react-native"
import colors from "@/constants/colors"
import StockStatistics from "@/components/StockStatistics"
import AdvancedChart from "@/components/AdvancedChart"
import TimeframeSelector from "@/components/TimeframeSelector"
import type { StockDetail } from "@/types/stock"
import { mockStockDetails } from "@/mocks/stocks"

const { width } = Dimensions.get("window")

export default function StockDetailScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const [stock, setStock] = useState<StockDetail | null>(null)
  const [timeframe, setTimeframe] = useState("1D")
  const [isWatchlisted, setIsWatchlisted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStockData()
  }, [id])

  const loadStockData = () => {
    try {
      console.log("Loading stock data for ID:", id)

      // Try to find stock by exact ID match first
      let foundStock = mockStockDetails.find((s) => s.id === id)

      // If not found by ID, try by symbol
      if (!foundStock) {
        foundStock = mockStockDetails.find((s) => s.symbol === id)
      }

      // If still not found, try partial matches
      if (!foundStock) {
        foundStock = mockStockDetails.find(
          (s) => s.id.includes(id as string) || s.symbol.toLowerCase().includes((id as string).toLowerCase()),
        )
      }

      console.log("Found stock:", foundStock)

      if (foundStock) {
        setStock(foundStock)
      } else {
        console.log(
          "Stock not found, available stocks:",
          mockStockDetails.map((s) => ({ id: s.id, symbol: s.symbol })),
        )
      }
    } catch (error) {
      console.error("Error loading stock data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleBuyPress = () => {
    if (!stock) return
    Alert.alert("Buy Stock", `Buy shares of ${stock.symbol}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Buy", onPress: () => router.push("/trading") },
    ])
  }

  const handleSellPress = () => {
    if (!stock) return
    Alert.alert("Sell Stock", `Sell shares of ${stock.symbol}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Sell", onPress: () => router.push("/trading") },
    ])
  }

  const handleWatchlistToggle = () => {
    setIsWatchlisted(!isWatchlisted)
    Alert.alert("Watchlist", isWatchlisted ? "Removed from watchlist" : "Added to watchlist")
  }

  const handleSetAlert = () => {
    if (!stock) return
    Alert.alert("Set Price Alert", `Set a price alert for ${stock.symbol}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Set Alert", onPress: () => router.push("/notifications") },
    ])
  }

  const handleShare = () => {
    if (!stock) return
    Alert.alert("Share", `Share ${stock.symbol} stock information`)
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen
          options={{
            title: "Loading...",
            headerStyle: { backgroundColor: colors.background },
            headerTitleStyle: { color: colors.text, fontWeight: "600" },
          }}
        />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading stock data...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (!stock) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen
          options={{
            title: "Stock Details",
            headerStyle: { backgroundColor: colors.background },
            headerTitleStyle: { color: colors.text, fontWeight: "600" },
          }}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Stock not found</Text>
          <Text style={styles.errorSubtext}>The requested stock could not be found. Please try again.</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  const isPositive = stock.change >= 0
  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`
  const formatPercent = (percent: number) => `${percent >= 0 ? "+" : ""}${percent.toFixed(2)}%`

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: stock.symbol,
          headerStyle: { backgroundColor: colors.background },
          headerTitleStyle: { color: colors.text, fontWeight: "600" },
          headerRight: () => (
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={handleWatchlistToggle} style={styles.headerButton}>
                <Star
                  size={24}
                  color={isWatchlisted ? colors.primary : colors.secondaryText}
                  fill={isWatchlisted ? colors.primary : "none"}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSetAlert} style={styles.headerButton}>
                <Bell size={24} color={colors.secondaryText} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
                <Share size={24} color={colors.secondaryText} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Stock Header */}
        <View style={styles.stockHeader}>
          <View style={styles.stockInfo}>
            <Text style={styles.stockName}>{stock.name}</Text>
            <Text style={styles.stockSymbol}>{stock.symbol}</Text>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.currentPrice}>{formatCurrency(stock.price)}</Text>
            <View style={styles.changeContainer}>
              {isPositive ? (
                <TrendingUp size={16} color={colors.green} />
              ) : (
                <TrendingDown size={16} color={colors.red} />
              )}
              <Text style={[styles.priceChange, { color: isPositive ? colors.green : colors.red }]}>
                {formatCurrency(stock.change)} ({formatPercent(stock.changePercent)})
              </Text>
            </View>
          </View>
        </View>

        {/* Chart Section */}
        <View style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <TimeframeSelector selectedTimeframe={timeframe} onSelectTimeframe={setTimeframe} />
          </View>
          <AdvancedChart data={stock.chart || []} timeframe={timeframe} width={width - 32} height={250} />
        </View>

        {/* Stock Statistics */}
        <StockStatistics stock={stock} />

        {/* Trading Actions */}
        <View style={styles.tradingActions}>
          <TouchableOpacity style={[styles.actionButton, styles.buyButton]} onPress={handleBuyPress}>
            <Plus size={20} color="white" />
            <Text style={styles.buyButtonText}>Buy</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.sellButton]} onPress={handleSellPress}>
            <Minus size={20} color="white" />
            <Text style={styles.sellButtonText}>Sell</Text>
          </TouchableOpacity>
        </View>

        {/* Additional Actions */}
        <View style={styles.additionalActions}>
          <TouchableOpacity style={styles.additionalActionButton} onPress={() => router.push("/analysis")}>
            <Text style={styles.additionalActionText}>Technical Analysis</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.additionalActionButton} onPress={() => router.push("/social")}>
            <Text style={styles.additionalActionText}>Community Sentiment</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.additionalActionButton} onPress={() => router.push("/education")}>
            <Text style={styles.additionalActionText}>Learn More</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: colors.secondaryText,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 16,
    color: colors.secondaryText,
    textAlign: "center",
    marginBottom: 32,
  },
  backButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  headerButton: {
    padding: 4,
  },
  stockHeader: {
    backgroundColor: "white",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  stockInfo: {
    marginBottom: 16,
  },
  stockName: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  stockSymbol: {
    fontSize: 16,
    color: colors.secondaryText,
  },
  priceContainer: {
    alignItems: "flex-start",
  },
  currentPrice: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },
  changeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  priceChange: {
    fontSize: 16,
    fontWeight: "600",
  },
  chartContainer: {
    backgroundColor: "white",
    marginTop: 8,
    paddingTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  chartHeader: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tradingActions: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  buyButton: {
    backgroundColor: colors.green,
  },
  sellButton: {
    backgroundColor: colors.red,
  },
  buyButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  sellButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  additionalActions: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 12,
  },
  additionalActionButton: {
    backgroundColor: "white",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  additionalActionText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
  },
})
