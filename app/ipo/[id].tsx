import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  Calendar,
  TrendingUp,
  DollarSign,
  Users,
  Building,
  FileText,
  Target,
  BarChart3,
  Star,
  CheckCircle,
  Info,
} from 'lucide-react-native';
import colors from '@/constants/colors';
import { useCurrencyStore } from '@/store/currencyStore';

// Mock IPO data - in real app, this would come from a store
const mockIPODetails = {
  '1': {
    id: '1',
    companyName: 'TechCorp Solutions',
    symbol: 'TECH',
    sector: 'Technology',
    priceRange: { min: 250, max: 280 },
    lotSize: 50,
    openDate: '2024-08-01',
    closeDate: '2024-08-03',
    listingDate: '2024-08-10',
    status: 'open' as const,
    subscriptionRate: 2.5,
    gmp: 45,
    description: 'Leading technology solutions provider specializing in AI and cloud computing with over 15 years of experience in the industry.',
    logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
    totalSize: 1200,
    freshIssue: 800,
    offerForSale: 400,
    leadManagers: ['Goldman Sachs', 'Morgan Stanley', 'JP Morgan'],
    rating: 4.2,
    financials: {
      revenue: 2500,
      profit: 450,
      eps: 12.5,
      peRatio: 22.4,
      bookValue: 185,
      roe: 18.5,
    },
    businessModel: 'TechCorp Solutions operates as a B2B technology service provider, offering cloud infrastructure, AI-powered analytics, and enterprise software solutions to Fortune 500 companies.',
    riskFactors: [
      'Dependence on key clients for major revenue',
      'Intense competition in the technology sector',
      'Regulatory changes in data privacy laws',
      'Currency fluctuation risks in international operations',
    ],
    useOfFunds: [
      { purpose: 'Business Expansion', percentage: 40, amount: 480 },
      { purpose: 'Technology Development', percentage: 30, amount: 360 },
      { purpose: 'Working Capital', percentage: 20, amount: 240 },
      { purpose: 'General Corporate Purposes', percentage: 10, amount: 120 },
    ],
    keyMetrics: {
      marketCap: 15600,
      enterpriseValue: 14800,
      priceToSales: 6.2,
      priceToBook: 1.5,
      debtToEquity: 0.3,
    },
  },
};

export default function IPODetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { formatAmount } = useCurrencyStore();

  const ipoData = mockIPODetails[id as keyof typeof mockIPODetails];

  if (!ipoData) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen 
          options={{ 
            title: 'IPO Details',
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <ArrowLeft size={24} color="#1A1A1A" />
              </TouchableOpacity>
            ),
          }} 
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>IPO details not found</Text>
        </View>
      </SafeAreaView>
    );
  }

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

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={14} color={colors.warning} fill={colors.warning} />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" size={14} color={colors.warning} />);
    }

    return stars;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: ipoData.symbol,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color="#1A1A1A" />
            </TouchableOpacity>
          ),
        }} 
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.companyHeader}>
            <View style={styles.companyInfo}>
              <Text style={styles.companyName}>{ipoData.companyName}</Text>
              <Text style={styles.sector}>{ipoData.sector}</Text>
              <View style={styles.ratingContainer}>
                {renderStars(ipoData.rating)}
                <Text style={styles.ratingText}>{ipoData.rating}/5</Text>
              </View>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(ipoData.status) + '20' }]}>
              <Text style={[styles.statusText, { color: getStatusColor(ipoData.status) }]}>
                {ipoData.status.toUpperCase()}
              </Text>
            </View>
          </View>
          
          <Text style={styles.description}>{ipoData.description}</Text>
        </View>

        {/* Key Details */}
        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>IPO Details</Text>
          
          <View style={styles.detailGrid}>
            <View style={styles.detailItem}>
              <DollarSign size={20} color={colors.primary} />
              <Text style={styles.detailLabel}>Price Range</Text>
              <Text style={styles.detailValue}>
                {formatAmount(ipoData.priceRange.min)} - {formatAmount(ipoData.priceRange.max)}
              </Text>
            </View>
            
            <View style={styles.detailItem}>
              <Target size={20} color={colors.primary} />
              <Text style={styles.detailLabel}>Lot Size</Text>
              <Text style={styles.detailValue}>{ipoData.lotSize} shares</Text>
            </View>
            
            <View style={styles.detailItem}>
              <BarChart3 size={20} color={colors.primary} />
              <Text style={styles.detailLabel}>Issue Size</Text>
              <Text style={styles.detailValue}>{formatAmount(ipoData.totalSize * 1000000)}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Calendar size={20} color={colors.primary} />
              <Text style={styles.detailLabel}>Listing Date</Text>
              <Text style={styles.detailValue}>
                {new Date(ipoData.listingDate).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Live Stats */}
        {ipoData.status === 'open' && (
          <View style={styles.liveStatsCard}>
            <Text style={styles.sectionTitle}>Live Statistics</Text>
            
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{ipoData.subscriptionRate.toFixed(1)}x</Text>
                <Text style={styles.statLabel}>Subscription</Text>
                <View style={[styles.statIndicator, { 
                  backgroundColor: ipoData.subscriptionRate > 1 ? colors.success : colors.warning 
                }]} />
              </View>
              
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { 
                  color: ipoData.gmp > 0 ? colors.success : colors.error 
                }]}>
                  {formatAmount(ipoData.gmp)}
                </Text>
                <Text style={styles.statLabel}>Grey Market Premium</Text>
                <View style={[styles.statIndicator, { 
                  backgroundColor: ipoData.gmp > 0 ? colors.success : colors.error 
                }]} />
              </View>
            </View>
          </View>
        )}

        {/* Financial Highlights */}
        <View style={styles.financialsCard}>
          <Text style={styles.sectionTitle}>Financial Highlights</Text>
          
          <View style={styles.financialGrid}>
            <View style={styles.financialItem}>
              <Text style={styles.financialLabel}>Revenue</Text>
              <Text style={styles.financialValue}>{formatAmount(ipoData.financials.revenue * 1000000)}</Text>
            </View>
            
            <View style={styles.financialItem}>
              <Text style={styles.financialLabel}>Net Profit</Text>
              <Text style={styles.financialValue}>{formatAmount(ipoData.financials.profit * 1000000)}</Text>
            </View>
            
            <View style={styles.financialItem}>
              <Text style={styles.financialLabel}>EPS</Text>
              <Text style={styles.financialValue}>{formatAmount(ipoData.financials.eps)}</Text>
            </View>
            
            <View style={styles.financialItem}>
              <Text style={styles.financialLabel}>P/E Ratio</Text>
              <Text style={styles.financialValue}>{ipoData.financials.peRatio}x</Text>
            </View>
            
            <View style={styles.financialItem}>
              <Text style={styles.financialLabel}>Book Value</Text>
              <Text style={styles.financialValue}>{formatAmount(ipoData.financials.bookValue)}</Text>
            </View>
            
            <View style={styles.financialItem}>
              <Text style={styles.financialLabel}>ROE</Text>
              <Text style={styles.financialValue}>{ipoData.financials.roe}%</Text>
            </View>
          </View>
        </View>

        {/* Use of Funds */}
        <View style={styles.fundsCard}>
          <Text style={styles.sectionTitle}>Use of Funds</Text>
          
          {ipoData.useOfFunds.map((fund, index) => (
            <View key={index} style={styles.fundItem}>
              <View style={styles.fundHeader}>
                <Text style={styles.fundPurpose}>{fund.purpose}</Text>
                <Text style={styles.fundPercentage}>{fund.percentage}%</Text>
              </View>
              <View style={styles.fundBar}>
                <View style={[styles.fundProgress, { width: `${fund.percentage}%` }]} />
              </View>
              <Text style={styles.fundAmount}>{formatAmount(fund.amount * 1000000)}</Text>
            </View>
          ))}
        </View>

        {/* Business Model */}
        <View style={styles.businessCard}>
          <Text style={styles.sectionTitle}>Business Model</Text>
          <Text style={styles.businessText}>{ipoData.businessModel}</Text>
        </View>

        {/* Risk Factors */}
        <View style={styles.riskCard}>
          <Text style={styles.sectionTitle}>Key Risk Factors</Text>
          
          {ipoData.riskFactors.map((risk, index) => (
            <View key={index} style={styles.riskItem}>
              <Info size={16} color={colors.warning} />
              <Text style={styles.riskText}>{risk}</Text>
            </View>
          ))}
        </View>

        {/* Lead Managers */}
        <View style={styles.managersCard}>
          <Text style={styles.sectionTitle}>Lead Managers</Text>
          
          <View style={styles.managersList}>
            {ipoData.leadManagers.map((manager, index) => (
              <View key={index} style={styles.managerItem}>
                <Building size={16} color={colors.primary} />
                <Text style={styles.managerName}>{manager}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Action Button */}
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={[
              styles.applyButton,
              ipoData.status !== 'open' && styles.disabledButton
            ]}
            disabled={ipoData.status !== 'open'}
            onPress={() => router.push('/ipo')}
          >
            <CheckCircle size={20} color="white" />
            <Text style={styles.applyButtonText}>
              {ipoData.status === 'open' ? 'Apply for IPO' : 'Not Available'}
            </Text>
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
  backButton: {
    padding: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: colors.secondaryText,
  },
  headerCard: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  companyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  sector: {
    fontSize: 16,
    color: colors.secondaryText,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    color: colors.secondaryText,
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
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
  },
  detailsCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  detailItem: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 12,
    gap: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.secondaryText,
    textAlign: 'center',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  liveStatsCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
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
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  statLabel: {
    fontSize: 12,
    color: colors.secondaryText,
    textAlign: 'center',
  },
  statIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  financialsCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  financialGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  financialItem: {
    width: '48%',
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  financialLabel: {
    fontSize: 12,
    color: colors.secondaryText,
    marginBottom: 4,
  },
  financialValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  fundsCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  fundItem: {
    marginBottom: 16,
  },
  fundHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  fundPurpose: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  fundPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  fundBar: {
    height: 6,
    backgroundColor: colors.background,
    borderRadius: 3,
    marginBottom: 4,
  },
  fundProgress: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  fundAmount: {
    fontSize: 12,
    color: colors.secondaryText,
  },
  businessCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  businessText: {
    fontSize: 14,
    color: colors.secondaryText,
    lineHeight: 20,
  },
  riskCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  riskItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 8,
  },
  riskText: {
    flex: 1,
    fontSize: 14,
    color: colors.secondaryText,
    lineHeight: 20,
  },
  managersCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  managersList: {
    gap: 12,
  },
  managerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  managerName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  actionContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  applyButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  disabledButton: {
    backgroundColor: colors.secondaryText,
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});