import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import {
  Calendar,
  TrendingUp,
  DollarSign,
  Users,
  Building,
  FileText,
  Clock,
  CheckCircle,
  X,
  Star,
  ArrowRight,
  Target,
  BarChart3,
} from 'lucide-react-native';
import colors from '@/constants/colors';
import { useCurrencyStore } from '@/store/currencyStore';

interface IPO {
  id: string;
  companyName: string;
  symbol: string;
  sector: string;
  priceRange: {
    min: number;
    max: number;
  };
  lotSize: number;
  openDate: string;
  closeDate: string;
  listingDate: string;
  status: 'upcoming' | 'open' | 'closed' | 'listed';
  subscriptionRate: number;
  gmp: number; // Grey Market Premium
  description: string;
  logo: string;
  totalSize: number; // in millions
  freshIssue: number;
  offerForSale: number;
  leadManagers: string[];
  rating: number;
}

const mockIPOs: IPO[] = [
  {
    id: '1',
    companyName: 'TechCorp Solutions',
    symbol: 'TECH',
    sector: 'Technology',
    priceRange: { min: 250, max: 280 },
    lotSize: 50,
    openDate: '2024-08-01',
    closeDate: '2024-08-03',
    listingDate: '2024-08-10',
    status: 'open',
    subscriptionRate: 2.5,
    gmp: 45,
    description: 'Leading technology solutions provider specializing in AI and cloud computing.',
    logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
    totalSize: 1200,
    freshIssue: 800,
    offerForSale: 400,
    leadManagers: ['Goldman Sachs', 'Morgan Stanley'],
    rating: 4.2,
  },
  {
    id: '2',
    companyName: 'GreenEnergy Ltd',
    symbol: 'GREEN',
    sector: 'Renewable Energy',
    priceRange: { min: 180, max: 200 },
    lotSize: 75,
    openDate: '2024-08-05',
    closeDate: '2024-08-07',
    listingDate: '2024-08-14',
    status: 'upcoming',
    subscriptionRate: 0,
    gmp: 25,
    description: 'Renewable energy company focused on solar and wind power solutions.',
    logo: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
    totalSize: 800,
    freshIssue: 600,
    offerForSale: 200,
    leadManagers: ['JP Morgan', 'Citigroup'],
    rating: 3.8,
  },
  {
    id: '3',
    companyName: 'HealthTech Innovations',
    symbol: 'HLTH',
    sector: 'Healthcare',
    priceRange: { min: 320, max: 350 },
    lotSize: 40,
    openDate: '2024-07-20',
    closeDate: '2024-07-22',
    listingDate: '2024-07-29',
    status: 'listed',
    subscriptionRate: 8.2,
    gmp: 75,
    description: 'Healthcare technology company developing innovative medical devices.',
    logo: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
    totalSize: 1500,
    freshIssue: 1000,
    offerForSale: 500,
    leadManagers: ['Bank of America', 'Deutsche Bank'],
    rating: 4.5,
  },
];

interface IPOApplication {
  ipoId: string;
  lots: number;
  amount: number;
  category: 'retail' | 'hni' | 'institutional';
}

export default function IPOScreen() {
  const router = useRouter();
  const { formatAmount } = useCurrencyStore();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedIPO, setSelectedIPO] = useState<IPO | null>(null);
  const [application, setApplication] = useState<IPOApplication>({
    ipoId: '',
    lots: 1,
    amount: 0,
    category: 'retail',
  });

  const getFilteredIPOs = () => {
    switch (selectedFilter) {
      case 'open':
        return mockIPOs.filter(ipo => ipo.status === 'open');
      case 'upcoming':
        return mockIPOs.filter(ipo => ipo.status === 'upcoming');
      case 'listed':
        return mockIPOs.filter(ipo => ipo.status === 'listed');
      default:
        return mockIPOs;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return colors.success;
      case 'upcoming':
        return colors.primary;
      case 'closed':
        return colors.warning;
      case 'listed':
        return colors.secondaryText;
      default:
        return colors.secondaryText;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open':
        return 'OPEN FOR BIDDING';
      case 'upcoming':
        return 'UPCOMING';
      case 'closed':
        return 'CLOSED';
      case 'listed':
        return 'LISTED';
      default:
        return status.toUpperCase();
    }
  };

  const openApplicationModal = (ipo: IPO) => {
    if (ipo.status !== 'open') {
      Alert.alert('Not Available', 'This IPO is not open for bidding');
      return;
    }
    
    setSelectedIPO(ipo);
    setApplication({
      ipoId: ipo.id,
      lots: 1,
      amount: ipo.priceRange.max * ipo.lotSize,
      category: 'retail',
    });
    setShowApplicationModal(true);
  };

  const calculateAmount = (lots: number) => {
    if (!selectedIPO) return 0;
    return lots * selectedIPO.lotSize * selectedIPO.priceRange.max;
  };

  const submitApplication = () => {
    if (!selectedIPO) return;
    
    Alert.alert(
      'Confirm Application',
      `Apply for ${application.lots} lot(s) of ${selectedIPO.companyName} for ${formatAmount(application.amount)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            setShowApplicationModal(false);
            Alert.alert('Success', 'IPO application submitted successfully!');
          },
        },
      ]
    );
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={12} color={colors.warning} fill={colors.warning} />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" size={12} color={colors.warning} />);
    }

    return stars;
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'IPO Center', headerShown: false }} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>IPO Center</Text>
          <Text style={styles.subtitle}>Invest in upcoming companies</Text>
        </View>

        {/* Filter Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          {[
            { key: 'all', label: 'All IPOs' },
            { key: 'open', label: 'Open' },
            { key: 'upcoming', label: 'Upcoming' },
            { key: 'listed', label: 'Listed' },
          ].map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterButton,
                selectedFilter === filter.key && styles.activeFilter
              ]}
              onPress={() => setSelectedFilter(filter.key)}
            >
              <Text style={[
                styles.filterText,
                selectedFilter === filter.key && styles.activeFilterText
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* IPO Cards */}
        <View style={styles.section}>
          {getFilteredIPOs().map((ipo) => (
            <View key={ipo.id} style={styles.ipoCard}>
              <View style={styles.ipoHeader}>
                <View style={styles.companyInfo}>
                  <Text style={styles.companyName}>{ipo.companyName}</Text>
                  <Text style={styles.sector}>{ipo.sector}</Text>
                  <View style={styles.ratingContainer}>
                    {renderStars(ipo.rating)}
                    <Text style={styles.ratingText}>{ipo.rating}</Text>
                  </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(ipo.status) + '20' }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(ipo.status) }]}>
                    {getStatusText(ipo.status)}
                  </Text>
                </View>
              </View>

              <Text style={styles.description}>{ipo.description}</Text>

              <View style={styles.ipoDetails}>
                <View style={styles.detailRow}>
                  <View style={styles.detailItem}>
                    <DollarSign size={16} color={colors.secondaryText} />
                    <Text style={styles.detailLabel}>Price Range</Text>
                    <Text style={styles.detailValue}>
                      {formatAmount(ipo.priceRange.min)} - {formatAmount(ipo.priceRange.max)}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Target size={16} color={colors.secondaryText} />
                    <Text style={styles.detailLabel}>Lot Size</Text>
                    <Text style={styles.detailValue}>{ipo.lotSize} shares</Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <View style={styles.detailItem}>
                    <Calendar size={16} color={colors.secondaryText} />
                    <Text style={styles.detailLabel}>Open - Close</Text>
                    <Text style={styles.detailValue}>
                      {new Date(ipo.openDate).toLocaleDateString()} - {new Date(ipo.closeDate).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <BarChart3 size={16} color={colors.secondaryText} />
                    <Text style={styles.detailLabel}>Issue Size</Text>
                    <Text style={styles.detailValue}>{formatAmount(ipo.totalSize * 1000000)}</Text>
                  </View>
                </View>

                {ipo.status === 'open' && (
                  <View style={styles.liveStats}>
                    <View style={styles.liveStat}>
                      <Text style={styles.liveStatLabel}>Subscription</Text>
                      <Text style={[
                        styles.liveStatValue,
                        { color: ipo.subscriptionRate > 1 ? colors.success : colors.warning }
                      ]}>
                        {ipo.subscriptionRate.toFixed(1)}x
                      </Text>
                    </View>
                    <View style={styles.liveStat}>
                      <Text style={styles.liveStatLabel}>GMP</Text>
                      <Text style={[
                        styles.liveStatValue,
                        { color: ipo.gmp > 0 ? colors.success : colors.error }
                      ]}>
                        {formatAmount(ipo.gmp)}
                      </Text>
                    </View>
                  </View>
                )}
              </View>

              <View style={styles.ipoActions}>
                <TouchableOpacity
                  style={styles.detailsButton}
                  onPress={() => router.push(`/ipo/${ipo.id}`)}
                >
                  <FileText size={16} color={colors.primary} />
                  <Text style={styles.detailsButtonText}>View Details</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.applyButton,
                    ipo.status !== 'open' && styles.disabledButton
                  ]}
                  onPress={() => openApplicationModal(ipo)}
                  disabled={ipo.status !== 'open'}
                >
                  <CheckCircle size={16} color="white" />
                  <Text style={styles.applyButtonText}>
                    {ipo.status === 'open' ? 'Apply Now' : 'Not Available'}
                  </Text>
                  <ArrowRight size={16} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Market Insights */}
        <View style={styles.insightsCard}>
          <Text style={styles.insightsTitle}>IPO Market Insights</Text>
          <View style={styles.insightItem}>
            <TrendingUp size={20} color={colors.success} />
            <View style={styles.insightContent}>
              <Text style={styles.insightText}>
                IPO market showing strong momentum with 85% of recent listings trading above issue price
              </Text>
            </View>
          </View>
          <View style={styles.insightItem}>
            <Users size={20} color={colors.primary} />
            <View style={styles.insightContent}>
              <Text style={styles.insightText}>
                Retail participation increased by 40% in the last quarter
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Application Modal */}
      <Modal
        visible={showApplicationModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Apply for IPO</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowApplicationModal(false)}
            >
              <X size={24} color={colors.secondaryText} />
            </TouchableOpacity>
          </View>

          {selectedIPO && (
            <ScrollView style={styles.modalContent}>
              <View style={styles.ipoSummary}>
                <Text style={styles.summaryCompany}>{selectedIPO.companyName}</Text>
                <Text style={styles.summaryPrice}>
                  {formatAmount(selectedIPO.priceRange.min)} - {formatAmount(selectedIPO.priceRange.max)}
                </Text>
                <Text style={styles.summaryLot}>Lot Size: {selectedIPO.lotSize} shares</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Number of Lots</Text>
                <View style={styles.lotSelector}>
                  <TouchableOpacity
                    style={styles.lotButton}
                    onPress={() => {
                      const newLots = Math.max(1, application.lots - 1);
                      setApplication({
                        ...application,
                        lots: newLots,
                        amount: calculateAmount(newLots),
                      });
                    }}
                  >
                    <Text style={styles.lotButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.lotValue}>{application.lots}</Text>
                  <TouchableOpacity
                    style={styles.lotButton}
                    onPress={() => {
                      const newLots = application.lots + 1;
                      setApplication({
                        ...application,
                        lots: newLots,
                        amount: calculateAmount(newLots),
                      });
                    }}
                  >
                    <Text style={styles.lotButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Category</Text>
                <View style={styles.categorySelector}>
                  {[
                    { key: 'retail', label: 'Retail (< ₹2L)' },
                    { key: 'hni', label: 'HNI (₹2L - ₹10L)' },
                    { key: 'institutional', label: 'Institutional' },
                  ].map((category) => (
                    <TouchableOpacity
                      key={category.key}
                      style={[
                        styles.categoryButton,
                        application.category === category.key && styles.selectedCategory
                      ]}
                      onPress={() => setApplication({ ...application, category: category.key as any })}
                    >
                      <Text style={[
                        styles.categoryText,
                        application.category === category.key && styles.selectedCategoryText
                      ]}>
                        {category.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.amountSummary}>
                <View style={styles.amountRow}>
                  <Text style={styles.amountLabel}>Lots</Text>
                  <Text style={styles.amountValue}>{application.lots}</Text>
                </View>
                <View style={styles.amountRow}>
                  <Text style={styles.amountLabel}>Shares per lot</Text>
                  <Text style={styles.amountValue}>{selectedIPO.lotSize}</Text>
                </View>
                <View style={styles.amountRow}>
                  <Text style={styles.amountLabel}>Total shares</Text>
                  <Text style={styles.amountValue}>{application.lots * selectedIPO.lotSize}</Text>
                </View>
                <View style={styles.amountRow}>
                  <Text style={styles.amountLabel}>Price per share</Text>
                  <Text style={styles.amountValue}>{formatAmount(selectedIPO.priceRange.max)}</Text>
                </View>
                <View style={[styles.amountRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Total Amount</Text>
                  <Text style={styles.totalValue}>{formatAmount(calculateAmount(application.lots))}</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.submitButton} onPress={submitApplication}>
                <CheckCircle size={20} color="white" />
                <Text style={styles.submitButtonText}>Submit Application</Text>
              </TouchableOpacity>

              <Text style={styles.disclaimer}>
                * Amount will be blocked in your account. Refund will be processed after allotment.
              </Text>
            </ScrollView>
          )}
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
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  filterContent: {
    paddingHorizontal: 4,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activeFilter: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.secondaryText,
  },
  activeFilterText: {
    color: 'white',
  },
  section: {
    paddingHorizontal: 20,
  },
  ipoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  ipoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  sector: {
    fontSize: 14,
    color: colors.secondaryText,
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    color: colors.secondaryText,
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: colors.secondaryText,
    lineHeight: 20,
    marginBottom: 16,
  },
  ipoDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.secondaryText,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginLeft: 'auto',
  },
  liveStats: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    gap: 20,
  },
  liveStat: {
    alignItems: 'center',
  },
  liveStatLabel: {
    fontSize: 12,
    color: colors.secondaryText,
    marginBottom: 4,
  },
  liveStatValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  ipoActions: {
    flexDirection: 'row',
    gap: 12,
  },
  detailsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: colors.background,
    gap: 6,
  },
  detailsButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  applyButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: colors.primary,
    gap: 6,
  },
  disabledButton: {
    backgroundColor: colors.secondaryText,
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  insightsCard: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightText: {
    fontSize: 14,
    color: colors.secondaryText,
    lineHeight: 20,
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
  ipoSummary: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  summaryCompany: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  summaryPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 4,
  },
  summaryLot: {
    fontSize: 14,
    color: colors.secondaryText,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  lotSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  lotButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lotButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
  lotValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    minWidth: 60,
    textAlign: 'center',
  },
  categorySelector: {
    gap: 8,
  },
  categoryButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  selectedCategory: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.secondaryText,
  },
  selectedCategoryText: {
    color: 'white',
  },
  amountSummary: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  amountLabel: {
    fontSize: 14,
    color: colors.secondaryText,
  },
  amountValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 8,
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  submitButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 16,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  disclaimer: {
    fontSize: 12,
    color: colors.secondaryText,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 40,
  },
});