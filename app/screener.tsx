import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import {
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  BarChart3,
  DollarSign,
  Target,
  Star,
  Plus,
  X,
  ArrowRight,
} from 'lucide-react-native';
import colors from '@/constants/colors';

interface Stock {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  pe: number;
  sector: string;
  logo: string;
}

const mockStocks: Stock[] = [
  {
    id: '1',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 198.24,
    change: 4.85,
    changePercent: 2.5,
    volume: 82345678,
    marketCap: 2450.5,
    pe: 28.5,
    sector: 'Technology',
    logo: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
  },
  {
    id: '2',
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    price: 213.10,
    change: 5.23,
    changePercent: 2.5,
    volume: 45234567,
    marketCap: 1890.3,
    pe: 24.8,
    sector: 'Technology',
    logo: 'https://images.unsplash.com/photo-1583339793403-3d9b001b6008?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
  },
  {
    id: '3',
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 2750.80,
    change: -15.20,
    changePercent: -0.55,
    volume: 23456789,
    marketCap: 1650.2,
    pe: 22.1,
    sector: 'Technology',
    logo: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
  },
  {
    id: '4',
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    price: 149.62,
    change: -1.23,
    changePercent: -0.82,
    volume: 67890123,
    marketCap: 475.8,
    pe: 45.2,
    sector: 'Automotive',
    logo: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
  },
  {
    id: '5',
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    price: 3245.67,
    change: 28.45,
    changePercent: 0.88,
    volume: 34567890,
    marketCap: 1320.4,
    pe: 52.3,
    sector: 'E-commerce',
    logo: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
  },
];

interface FilterCriteria {
  minPrice: string;
  maxPrice: string;
  minMarketCap: string;
  maxMarketCap: string;
  minPE: string;
  maxPE: string;
  sector: string;
  sortBy: 'price' | 'change' | 'volume' | 'marketCap' | 'pe';
  sortOrder: 'asc' | 'desc';
}

export default function ScreenerScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterCriteria>({
    minPrice: '',
    maxPrice: '',
    minMarketCap: '',
    maxMarketCap: '',
    minPE: '',
    maxPE: '',
    sector: '',
    sortBy: 'marketCap',
    sortOrder: 'desc',
  });

  const sectors = ['All', 'Technology', 'Healthcare', 'Finance', 'Energy', 'Automotive', 'E-commerce'];

  const getFilteredStocks = () => {
    let filtered = mockStocks.filter(stock => {
      const matchesSearch = stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           stock.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesPrice = (!filters.minPrice || stock.price >= parseFloat(filters.minPrice)) &&
                          (!filters.maxPrice || stock.price <= parseFloat(filters.maxPrice));
      
      const matchesMarketCap = (!filters.minMarketCap || stock.marketCap >= parseFloat(filters.minMarketCap)) &&
                              (!filters.maxMarketCap || stock.marketCap <= parseFloat(filters.maxMarketCap));
      
      const matchesPE = (!filters.minPE || stock.pe >= parseFloat(filters.minPE)) &&
                       (!filters.maxPE || stock.pe <= parseFloat(filters.maxPE));
      
      const matchesSector = !filters.sector || filters.sector === 'All' || stock.sector === filters.sector;
      
      return matchesSearch && matchesPrice && matchesMarketCap && matchesPE && matchesSector;
    });

    // Sort results
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (filters.sortBy) {
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'change':
          aValue = a.changePercent;
          bValue = b.changePercent;
          break;
        case 'volume':
          aValue = a.volume;
          bValue = b.volume;
          break;
        case 'marketCap':
          aValue = a.marketCap;
          bValue = b.marketCap;
          break;
        case 'pe':
          aValue = a.pe;
          bValue = b.pe;
          break;
        default:
          aValue = a.marketCap;
          bValue = b.marketCap;
      }
      
      return filters.sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

    return filtered;
  };

  const clearFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      minMarketCap: '',
      maxMarketCap: '',
      minPE: '',
      maxPE: '',
      sector: '',
      sortBy: 'marketCap',
      sortOrder: 'desc',
    });
  };

  const navigateToStock = (stockId: string) => {
    router.push(`/stock/${stockId}`);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Stock Screener', headerShown: false }} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Stock Screener</Text>
          <Text style={styles.subtitle}>Find stocks that match your criteria</Text>
        </View>

        {/* Search and Filter */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Search size={20} color={colors.secondaryText} />
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search stocks..."
              placeholderTextColor={colors.secondaryText}
            />
          </View>
          
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters(true)}
          >
            <Filter size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Quick Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.quickFilters}
          contentContainerStyle={styles.quickFiltersContent}
        >
          <TouchableOpacity
            style={[styles.quickFilter, filters.sortBy === 'change' && styles.activeQuickFilter]}
            onPress={() => setFilters({ ...filters, sortBy: 'change', sortOrder: 'desc' })}
          >
            <TrendingUp size={16} color={filters.sortBy === 'change' ? 'white' : colors.primary} />
            <Text style={[
              styles.quickFilterText,
              filters.sortBy === 'change' && styles.activeQuickFilterText
            ]}>
              Top Gainers
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.quickFilter, filters.sortBy === 'volume' && styles.activeQuickFilter]}
            onPress={() => setFilters({ ...filters, sortBy: 'volume', sortOrder: 'desc' })}
          >
            <BarChart3 size={16} color={filters.sortBy === 'volume' ? 'white' : colors.primary} />
            <Text style={[
              styles.quickFilterText,
              filters.sortBy === 'volume' && styles.activeQuickFilterText
            ]}>
              High Volume
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.quickFilter, filters.sortBy === 'marketCap' && styles.activeQuickFilter]}
            onPress={() => setFilters({ ...filters, sortBy: 'marketCap', sortOrder: 'desc' })}
          >
            <Target size={16} color={filters.sortBy === 'marketCap' ? 'white' : colors.primary} />
            <Text style={[
              styles.quickFilterText,
              filters.sortBy === 'marketCap' && styles.activeQuickFilterText
            ]}>
              Large Cap
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Results */}
        <View style={styles.section}>
          <View style={styles.resultsHeader}>
            <Text style={styles.sectionTitle}>
              Results ({getFilteredStocks().length})
            </Text>
            <Text style={styles.sortInfo}>
              Sorted by {filters.sortBy} ({filters.sortOrder})
            </Text>
          </View>
          
          {getFilteredStocks().map((stock) => (
            <TouchableOpacity
              key={stock.id}
              style={styles.stockCard}
              onPress={() => navigateToStock(stock.id)}
            >
              <View style={styles.stockInfo}>
                <View style={styles.stockHeader}>
                  <Text style={styles.stockSymbol}>{stock.symbol}</Text>
                  <TouchableOpacity style={styles.watchlistButton}>
                    <Star size={16} color={colors.secondaryText} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.stockName}>{stock.name}</Text>
                <Text style={styles.stockSector}>{stock.sector}</Text>
                
                <View style={styles.stockMetrics}>
                  <View style={styles.priceContainer}>
                    <Text style={styles.stockPrice}>${stock.price.toFixed(2)}</Text>
                    <View style={styles.changeContainer}>
                      {stock.change >= 0 ? (
                        <TrendingUp size={14} color={colors.success} />
                      ) : (
                        <TrendingDown size={14} color={colors.error} />
                      )}
                      <Text style={[
                        styles.stockChange,
                        { color: stock.change >= 0 ? colors.success : colors.error }
                      ]}>
                        {stock.change >= 0 ? '+' : ''}${stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.additionalMetrics}>
                  <View style={styles.metric}>
                    <Text style={styles.metricLabel}>Market Cap</Text>
                    <Text style={styles.metricValue}>${stock.marketCap.toFixed(1)}B</Text>
                  </View>
                  <View style={styles.metric}>
                    <Text style={styles.metricLabel}>P/E Ratio</Text>
                    <Text style={styles.metricValue}>{stock.pe.toFixed(1)}</Text>
                  </View>
                  <View style={styles.metric}>
                    <Text style={styles.metricLabel}>Volume</Text>
                    <Text style={styles.metricValue}>{(stock.volume / 1000000).toFixed(1)}M</Text>
                  </View>
                </View>
              </View>

              <ArrowRight size={20} color={colors.secondaryText} />
            </TouchableOpacity>
          ))}

          {getFilteredStocks().length === 0 && (
            <View style={styles.emptyState}>
              <Search size={48} color={colors.secondaryText} />
              <Text style={styles.emptyTitle}>No stocks found</Text>
              <Text style={styles.emptySubtitle}>
                Try adjusting your search criteria or filters
              </Text>
              <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
                <Text style={styles.clearButtonText}>Clear Filters</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Filter Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter Stocks</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowFilters(false)}
            >
              <X size={24} color={colors.secondaryText} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Price Range */}
            <View style={styles.filterGroup}>
              <Text style={styles.filterGroupTitle}>Price Range</Text>
              <View style={styles.rangeInputs}>
                <TextInput
                  style={styles.rangeInput}
                  value={filters.minPrice}
                  onChangeText={(text) => setFilters({ ...filters, minPrice: text })}
                  placeholder="Min Price"
                  keyboardType="numeric"
                />
                <Text style={styles.rangeSeparator}>to</Text>
                <TextInput
                  style={styles.rangeInput}
                  value={filters.maxPrice}
                  onChangeText={(text) => setFilters({ ...filters, maxPrice: text })}
                  placeholder="Max Price"
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Market Cap Range */}
            <View style={styles.filterGroup}>
              <Text style={styles.filterGroupTitle}>Market Cap (Billions)</Text>
              <View style={styles.rangeInputs}>
                <TextInput
                  style={styles.rangeInput}
                  value={filters.minMarketCap}
                  onChangeText={(text) => setFilters({ ...filters, minMarketCap: text })}
                  placeholder="Min Cap"
                  keyboardType="numeric"
                />
                <Text style={styles.rangeSeparator}>to</Text>
                <TextInput
                  style={styles.rangeInput}
                  value={filters.maxMarketCap}
                  onChangeText={(text) => setFilters({ ...filters, maxMarketCap: text })}
                  placeholder="Max Cap"
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* P/E Ratio Range */}
            <View style={styles.filterGroup}>
              <Text style={styles.filterGroupTitle}>P/E Ratio</Text>
              <View style={styles.rangeInputs}>
                <TextInput
                  style={styles.rangeInput}
                  value={filters.minPE}
                  onChangeText={(text) => setFilters({ ...filters, minPE: text })}
                  placeholder="Min P/E"
                  keyboardType="numeric"
                />
                <Text style={styles.rangeSeparator}>to</Text>
                <TextInput
                  style={styles.rangeInput}
                  value={filters.maxPE}
                  onChangeText={(text) => setFilters({ ...filters, maxPE: text })}
                  placeholder="Max P/E"
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Sector */}
            <View style={styles.filterGroup}>
              <Text style={styles.filterGroupTitle}>Sector</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.sectorSelector}
                contentContainerStyle={styles.sectorContent}
              >
                {sectors.map((sector) => (
                  <TouchableOpacity
                    key={sector}
                    style={[
                      styles.sectorButton,
                      (filters.sector === sector || (sector === 'All' && !filters.sector)) && styles.selectedSector
                    ]}
                    onPress={() => setFilters({ ...filters, sector: sector === 'All' ? '' : sector })}
                  >
                    <Text style={[
                      styles.sectorText,
                      (filters.sector === sector || (sector === 'All' && !filters.sector)) && styles.selectedSectorText
                    ]}>
                      {sector}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Sort Options */}
            <View style={styles.filterGroup}>
              <Text style={styles.filterGroupTitle}>Sort By</Text>
              <View style={styles.sortOptions}>
                {[
                  { key: 'marketCap', label: 'Market Cap' },
                  { key: 'price', label: 'Price' },
                  { key: 'change', label: 'Change %' },
                  { key: 'volume', label: 'Volume' },
                  { key: 'pe', label: 'P/E Ratio' },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.sortOption,
                      filters.sortBy === option.key && styles.selectedSort
                    ]}
                    onPress={() => setFilters({ ...filters, sortBy: option.key as any })}
                  >
                    <Text style={[
                      styles.sortText,
                      filters.sortBy === option.key && styles.selectedSortText
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <View style={styles.sortOrder}>
                <TouchableOpacity
                  style={[
                    styles.orderButton,
                    filters.sortOrder === 'desc' && styles.selectedOrder
                  ]}
                  onPress={() => setFilters({ ...filters, sortOrder: 'desc' })}
                >
                  <Text style={[
                    styles.orderText,
                    filters.sortOrder === 'desc' && styles.selectedOrderText
                  ]}>
                    High to Low
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.orderButton,
                    filters.sortOrder === 'asc' && styles.selectedOrder
                  ]}
                  onPress={() => setFilters({ ...filters, sortOrder: 'asc' })}
                >
                  <Text style={[
                    styles.orderText,
                    filters.sortOrder === 'asc' && styles.selectedOrderText
                  ]}>
                    Low to High
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.clearFiltersButton} onPress={clearFilters}>
                <Text style={styles.clearFiltersText}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => setShowFilters(false)}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.secondaryText,
  },
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: 'white',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickFilters: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  quickFiltersContent: {
    paddingHorizontal: 4,
    gap: 8,
  },
  quickFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'white',
    borderRadius: 20,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activeQuickFilter: {
    backgroundColor: colors.primary,
  },
  quickFilterText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
  activeQuickFilterText: {
    color: 'white',
  },
  section: {
    paddingHorizontal: 20,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  sortInfo: {
    fontSize: 12,
    color: colors.secondaryText,
  },
  stockCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  stockInfo: {
    flex: 1,
  },
  stockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  stockSymbol: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  watchlistButton: {
    padding: 4,
  },
  stockName: {
    fontSize: 14,
    color: colors.secondaryText,
    marginBottom: 2,
  },
  stockSector: {
    fontSize: 12,
    color: colors.primary,
    marginBottom: 12,
  },
  stockMetrics: {
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stockPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stockChange: {
    fontSize: 14,
    fontWeight: '500',
  },
  additionalMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metric: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: colors.secondaryText,
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.secondaryText,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  clearButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  filterGroup: {
    marginBottom: 24,
  },
  filterGroupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  rangeInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rangeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  rangeSeparator: {
    fontSize: 14,
    color: colors.secondaryText,
  },
  sectorSelector: {
    marginHorizontal: -4,
  },
  sectorContent: {
    paddingHorizontal: 4,
    gap: 8,
  },
  sectorButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
  },
  selectedSector: {
    backgroundColor: colors.primary,
  },
  sectorText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.secondaryText,
  },
  selectedSectorText: {
    color: 'white',
  },
  sortOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  sortOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
  },
  selectedSort: {
    backgroundColor: colors.primary,
  },
  sortText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.secondaryText,
  },
  selectedSortText: {
    color: 'white',
  },
  sortOrder: {
    flexDirection: 'row',
    gap: 8,
  },
  orderButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  selectedOrder: {
    backgroundColor: colors.primary,
  },
  orderText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.secondaryText,
  },
  selectedOrderText: {
    color: 'white',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 20,
  },
  clearFiltersButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  clearFiltersText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.secondaryText,
  },
  applyButton: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});