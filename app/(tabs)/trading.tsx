"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  FlatList,
  RefreshControl,
  Alert,
} from "react-native"
import { Stack, useRouter } from "expo-router"
import { Search, TrendingUp, TrendingDown, ListFilter as Filter, ChartBar as BarChart3, Star, Activity, DollarSign, Percent, Volume2, Eye, Bell } from "lucide-react-native"
import colors from "@/constants/colors"
import StockItem from "@/components/StockItem"
import type { Stock } from "@/types/stock"
import { mockStocks, mockStockDetails } from "@/mocks/stocks"

type SortBy = "symbol" | "price" | "change" | "volume" | "marketCap"
type FilterBy = "all" | "gainers" | "losers" | "mostActive" | "trending"
type ViewMode = "list" | "grid"

interface MarketOverview {
  totalStocks: number
  gainers: number
  losers: number
  unchanged: number
  totalVolume: number
  totalMarketCap: number
}

export default function TradingScreen() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [stocks, setStocks] = useState(mockStocks)
  const [filteredStocks, setFilteredStocks] = useState<any>(mockStocks)
  const [refreshing, setRefreshing] = useState(false)
  const [sortBy, setSortBy] = useState<SortBy>("symbol")
  const [filterBy, setFilterBy] = useState<FilterBy>("all")
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [showFilters, setShowFilters] = useState(false)
  const [marketOverview, setMarketOverview] = useState<MarketOverview>({
    totalStocks: 0,
    gainers: 0,
    losers: 0,
    unchanged: 0,
    totalVolume: 0,
    totalMarketCap: 0,
  })

  useEffect(() => {
    filterAndSortStocks()
    calculateMarketOverview()
  }, [searchQuery, sortBy, filterBy, stocks])

  const calculateMarketOverview = () => {
    const safeStocks = stocks || []
    const overview: MarketOverview = {
      totalStocks: safeStocks.length,
      gainers: safeStocks.filter((stock) => stock.change > 0).length,
      losers: safeStocks.filter((stock) => stock.change < 0).length,
      unchanged: safeStocks.filter((stock) => stock.change === 0).length,
      totalVolume: safeStocks.reduce((sum, stock) => {
        const detail = mockStockDetails.find((d) => d.symbol === stock.symbol)
        return sum + (detail?.volume || 0)
      }, 0),
      totalMarketCap: safeStocks.reduce((sum, stock) => {
        const detail = mockStockDetails.find((d) => d.symbol === stock.symbol)
        return sum + (detail?.marketCap || 0)
      }, 0),
    }
    setMarketOverview(overview)
  }

  const filterAndSortStocks = () => {
    let filtered = [...(stocks || [])]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (stock) =>
          stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          stock.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply category filter
    switch (filterBy) {
      case "gainers":
        filtered = filtered.filter((stock) => stock.change > 0)
        break
      case "losers":
        filtered = filtered.filter((stock) => stock.change < 0)
        break
      case "mostActive":
        filtered = filtered
          .sort((a, b) => {
            const aDetail = mockStockDetails.find((d) => d.symbol === a.symbol)
            const bDetail = mockStockDetails.find((d) => d.symbol === b.symbol)
            return (bDetail?.volume || 0) - (aDetail?.volume || 0)
          })
          .slice(0, 20)
        break
      case "trending":
        filtered = filtered.filter((stock) => Math.abs(stock.changePercent) > 5)
        break
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "symbol":
          return a.symbol.localeCompare(b.symbol)
        case "price":
          return b.price - a.price
        case "change":
          return b.changePercent - a.changePercent
        case "volume":
          const aDetail = mockStockDetails.find((d) => d.symbol === a.symbol)
          const bDetail = mockStockDetails.find((d) => d.symbol === b.symbol)
          return (bDetail?.volume || 0) - (aDetail?.volume || 0)
        case "marketCap":
          const aMarketCap = mockStockDetails.find((d) => d.symbol === a.symbol)?.marketCap || 0
          const bMarketCap = mockStockDetails.find((d) => d.symbol === b.symbol)?.marketCap || 0
          return bMarketCap - aMarketCap
        default:
          return 0
      }
    })

    setFilteredStocks(filtered)
  }

  const onRefresh = async () => {
    setRefreshing(true)
    // Simulate API call
    setTimeout(() => {
      // Update stock prices with random changes
      const updatedStocks = (stocks || []).map((stock) => ({
        ...stock,
        price: stock.price + (Math.random() - 0.5) * 10,
        change: (Math.random() - 0.5) * 20,
        changePercent: (Math.random() - 0.5) * 10,
      }))
      setStocks(updatedStocks)
      setRefreshing(false)
    }, 2000)
  }

  const handleStockPress = (stock: Stock) => {
    router.push(`/stock/${stock.id}`)
  }

  const handleAddToWatchlist = (stock: Stock) => {
    Alert.alert("Add to Watchlist", `Add ${stock.symbol} to your watchlist?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Add", onPress: () => Alert.alert("Success", "Added to watchlist!") },
    ])
  }

  const handleSetAlert = (stock: Stock) => {
    Alert.alert("Set Price Alert", `Set a price alert for ${stock.symbol}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Set Alert", onPress: () => router.push("/notifications") },
    ])
  }

  const formatNumber = (num: number): string => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(1)}T`
    if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`
    if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`
    return `$${num.toFixed(0)}`
  }

  const formatVolume = (num: number): string => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`
    return num.toString()
  }

  const categories = [
    { id: "all", name: "All", icon: <BarChart3 size={16} color={colors.primary} /> },
    { id: "gainers", name: "Gainers", icon: <TrendingUp size={16} color={colors.green} /> },
    { id: "losers", name: "Losers", icon: <TrendingDown size={16} color={colors.red} /> },
    { id: "mostActive", name: "Most Active", icon: <Activity size={16} color={colors.blue} /> },
    { id: "trending", name: "Trending", icon: <Volume2 size={16} color={colors.orange} /> },
  ]

  const sortOptions = [
    { id: "symbol", name: "Symbol", icon: <Text style={styles.sortIcon}>A-Z</Text> },
    { id: "price", name: "Price", icon: <DollarSign size={16} color={colors.text} /> },
    { id: "change", name: "Change", icon: <Percent size={16} color={colors.text} /> },
    { id: "volume", name: "Volume", icon: <Volume2 size={16} color={colors.text} /> },
    { id: "marketCap", name: "Market Cap", icon: <BarChart3 size={16} color={colors.text} /> },
  ]

  const renderStockItem = ({ item, index }: { item: Stock; index: number }) => (
    <View key={`stock-item-${item.id}-${index}`} style={styles.stockItemContainer}>
      <StockItem stock={item} onPress={() => handleStockPress(item)} showChart={true} compact={viewMode === "grid"} />
      <View style={styles.stockActions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleAddToWatchlist(item)}>
          <Star size={16} color={colors.secondaryText} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleSetAlert(item)}>
          <Bell size={16} color={colors.secondaryText} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleStockPress(item)}>
          <Eye size={16} color={colors.secondaryText} />
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Trading",
          headerStyle: { backgroundColor: colors.background },
          headerTitleStyle: { color: colors.text, fontWeight: "600" },
        }}
      />

      {/* Market Overview */}
      <View style={styles.marketOverview}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.overviewCard}>
            <Text style={styles.overviewLabel}>Total Stocks</Text>
            <Text style={styles.overviewValue}>{marketOverview.totalStocks}</Text>
          </View>
          <View style={styles.overviewCard}>
            <Text style={styles.overviewLabel}>Gainers</Text>
            <Text style={[styles.overviewValue, { color: colors.green }]}>{marketOverview.gainers}</Text>
          </View>
          <View style={styles.overviewCard}>
            <Text style={styles.overviewLabel}>Losers</Text>
            <Text style={[styles.overviewValue, { color: colors.red }]}>{marketOverview.losers}</Text>
          </View>
          <View style={styles.overviewCard}>
            <Text style={styles.overviewLabel}>Volume</Text>
            <Text style={styles.overviewValue}>{formatVolume(marketOverview.totalVolume)}</Text>
          </View>
          <View style={styles.overviewCard}>
            <Text style={styles.overviewLabel}>Market Cap</Text>
            <Text style={styles.overviewValue}>{formatNumber(marketOverview.totalMarketCap)}</Text>
          </View>
        </ScrollView>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={colors.secondaryText} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search stocks..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.secondaryText}
          />
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilters(!showFilters)}>
          <Filter size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          {/* Categories */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Categories</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterOptions}>
                {(categories || []).map((category, index) => (
                  <TouchableOpacity
                    key={`category-${category.id}-${index}`}
                    style={[styles.filterOption, filterBy === category.id && styles.activeFilterOption]}
                    onPress={() => setFilterBy(category.id as FilterBy)}
                  >
                    {category.icon}
                    <Text style={[styles.filterOptionText, filterBy === category.id && styles.activeFilterOptionText]}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Sort Options */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Sort By</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterOptions}>
                {(sortOptions || []).map((option, index) => (
                  <TouchableOpacity
                    key={`sort-${option.id}-${index}`}
                    style={[styles.filterOption, sortBy === option.id && styles.activeFilterOption]}
                    onPress={() => setSortBy(option.id as SortBy)}
                  >
                    {option.icon}
                    <Text style={[styles.filterOptionText, sortBy === option.id && styles.activeFilterOptionText]}>
                      {option.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* View Mode */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>View</Text>
            <View style={styles.viewModeContainer}>
              <TouchableOpacity
                style={[styles.viewModeButton, viewMode === "list" && styles.activeViewModeButton]}
                onPress={() => setViewMode("list")}
              >
                <Text style={[styles.viewModeText, viewMode === "list" && styles.activeViewModeText]}>List</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.viewModeButton, viewMode === "grid" && styles.activeViewModeButton]}
                onPress={() => setViewMode("grid")}
              >
                <Text style={[styles.viewModeText, viewMode === "grid" && styles.activeViewModeText]}>Grid</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Results Header */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>{(filteredStocks || []).length} stocks found</Text>
        <TouchableOpacity onPress={() => router.push("/screener")}>
          <Text style={styles.advancedLink}>Advanced Screener</Text>
        </TouchableOpacity>
      </View>

      {/* Stock List */}
      <FlatList
        data={filteredStocks || []}
        renderItem={renderStockItem}
        keyExtractor={(item, index) => `stock-list-${item.id}-${index}`}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
        numColumns={viewMode === "grid" ? 2 : 1}
        key={viewMode} // Force re-render when view mode changes
        contentContainerStyle={styles.stockList}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No stocks found</Text>
            <Text style={styles.emptyStateSubtext}>Try adjusting your search or filters</Text>
          </View>
        )}
      />

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickActionButton} onPress={() => router.push("/watchlist")}>
          <Star size={20} color={colors.primary} />
          <Text style={styles.quickActionText}>Watchlist</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton} onPress={() => router.push("/screener")}>
          <Filter size={20} color={colors.primary} />
          <Text style={styles.quickActionText}>Screener</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton} onPress={() => router.push("/analysis")}>
          <BarChart3 size={20} color={colors.primary} />
          <Text style={styles.quickActionText}>Analysis</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton} onPress={() => router.push("/paper-trading")}>
          <Activity size={20} color={colors.primary} />
          <Text style={styles.quickActionText}>Paper Trade</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  marketOverview: {
    backgroundColor: "white",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  overviewCard: {
    alignItems: "center",
    paddingHorizontal: 16,
    minWidth: 80,
  },
  overviewLabel: {
    fontSize: 12,
    color: colors.secondaryText,
    marginBottom: 4,
  },
  overviewValue: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: colors.text,
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  filtersContainer: {
    backgroundColor: "white",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  filterOptions: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 8,
  },
  filterOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    gap: 4,
  },
  activeFilterOption: {
    backgroundColor: colors.primary,
  },
  filterOptionText: {
    fontSize: 12,
    color: colors.text,
  },
  activeFilterOptionText: {
    color: "white",
  },
  sortIcon: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text,
  },
  viewModeContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 8,
  },
  viewModeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
  },
  activeViewModeButton: {
    backgroundColor: colors.primary,
  },
  viewModeText: {
    fontSize: 12,
    color: colors.text,
  },
  activeViewModeText: {
    color: "white",
  },
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  resultsCount: {
    fontSize: 14,
    color: colors.secondaryText,
  },
  advancedLink: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "500",
  },
  stockList: {
    paddingBottom: 100,
  },
  stockItemContainer: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
  },
  stockActions: {
    flexDirection: "row",
    paddingHorizontal: 8,
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: colors.background,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.secondaryText,
  },
  quickActions: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  quickActionButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    gap: 4,
  },
  quickActionText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: "500",
  },
})