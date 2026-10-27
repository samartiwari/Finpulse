import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Stack } from 'expo-router';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Zap,
  Globe,
  Calendar,
  Filter,
} from 'lucide-react-native';
import colors from '@/constants/colors';

const { width } = Dimensions.get('window');

type AnalysisTab = 'technical' | 'fundamental' | 'sentiment' | 'news';

export default function MarketAnalysisScreen() {
  const [activeTab, setActiveTab] = useState<AnalysisTab>('technical');

  const tabs = [
    { id: 'technical', name: 'Technical', icon: <BarChart3 size={20} color={colors.primary} /> },
    { id: 'fundamental', name: 'Fundamental', icon: <PieChart size={20} color={colors.blue} /> },
    { id: 'sentiment', name: 'Sentiment', icon: <Activity size={20} color={colors.green} /> },
    { id: 'news', name: 'News', icon: <Globe size={20} color={colors.orange} /> },
  ];

  const technicalIndicators = [
    { name: 'RSI (14)', value: '68.5', signal: 'Overbought', color: colors.red },
    { name: 'MACD', value: '2.34', signal: 'Bullish', color: colors.green },
    { name: 'Bollinger Bands', value: 'Upper', signal: 'Resistance', color: colors.orange },
    { name: 'Moving Average (50)', value: '$142.50', signal: 'Support', color: colors.blue },
    { name: 'Volume', value: '2.3M', signal: 'Above Average', color: colors.green },
    { name: 'Stochastic', value: '72.1', signal: 'Overbought', color: colors.red },
  ];

  const fundamentalData = [
    { metric: 'P/E Ratio', value: '28.5', benchmark: '25.2', status: 'above' },
    { metric: 'EPS', value: '$5.12', benchmark: '$4.85', status: 'above' },
    { metric: 'Revenue Growth', value: '12.3%', benchmark: '8.5%', status: 'above' },
    { metric: 'Debt to Equity', value: '0.45', benchmark: '0.52', status: 'below' },
    { metric: 'ROE', value: '18.2%', benchmark: '15.8%', status: 'above' },
    { metric: 'Free Cash Flow', value: '$2.1B', benchmark: '$1.8B', status: 'above' },
  ];

  const sentimentData = [
    { source: 'Social Media', score: 78, trend: 'up', color: colors.green },
    { source: 'News Articles', score: 65, trend: 'down', color: colors.red },
    { source: 'Analyst Reports', score: 82, trend: 'up', color: colors.green },
    { source: 'Options Flow', score: 71, trend: 'neutral', color: colors.orange },
    { source: 'Insider Trading', score: 85, trend: 'up', color: colors.green },
  ];

  const newsItems = [
    {
      title: 'Company Reports Strong Q3 Earnings',
      source: 'Financial Times',
      time: '2 hours ago',
      sentiment: 'positive',
    },
    {
      title: 'New Product Launch Expected Next Quarter',
      source: 'TechCrunch',
      time: '4 hours ago',
      sentiment: 'positive',
    },
    {
      title: 'Regulatory Concerns in European Markets',
      source: 'Reuters',
      time: '6 hours ago',
      sentiment: 'negative',
    },
    {
      title: 'Partnership Deal with Major Tech Company',
      source: 'Bloomberg',
      time: '8 hours ago',
      sentiment: 'positive',
    },
  ];

  const renderTechnicalAnalysis = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Technical Indicators</Text>
      {technicalIndicators.map((indicator, index) => (
        <View key={index} style={styles.indicatorRow}>
          <View style={styles.indicatorInfo}>
            <Text style={styles.indicatorName}>{indicator.name}</Text>
            <Text style={styles.indicatorValue}>{indicator.value}</Text>
          </View>
          <View style={[styles.signalBadge, { backgroundColor: indicator.color + '20' }]}>
            <Text style={[styles.signalText, { color: indicator.color }]}>
              {indicator.signal}
            </Text>
          </View>
        </View>
      ))}
      
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Technical Summary</Text>
        <Text style={styles.summaryText}>
          The stock shows mixed technical signals with RSI indicating overbought conditions while MACD remains bullish. 
          Consider waiting for a pullback to the 50-day moving average for better entry.
        </Text>
      </View>
    </View>
  );

  const renderFundamentalAnalysis = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Fundamental Metrics</Text>
      {fundamentalData.map((item, index) => (
        <View key={index} style={styles.fundamentalRow}>
          <View style={styles.fundamentalInfo}>
            <Text style={styles.fundamentalMetric}>{item.metric}</Text>
            <Text style={styles.fundamentalValue}>{item.value}</Text>
          </View>
          <View style={styles.benchmarkInfo}>
            <Text style={styles.benchmarkLabel}>Industry Avg</Text>
            <Text style={styles.benchmarkValue}>{item.benchmark}</Text>
            <View style={[
              styles.statusIndicator,
              { backgroundColor: item.status === 'above' ? colors.green : colors.red }
            ]} />
          </View>
        </View>
      ))}
      
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Fundamental Summary</Text>
        <Text style={styles.summaryText}>
          Strong fundamentals with above-average growth metrics and healthy balance sheet. 
          P/E ratio slightly elevated but justified by growth prospects.
        </Text>
      </View>
    </View>
  );

  const renderSentimentAnalysis = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Market Sentiment</Text>
      {sentimentData.map((item, index) => (
        <View key={index} style={styles.sentimentRow}>
          <View style={styles.sentimentInfo}>
            <Text style={styles.sentimentSource}>{item.source}</Text>
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreValue}>{item.score}/100</Text>
              {item.trend === 'up' ? (
                <TrendingUp size={16} color={colors.green} />
              ) : item.trend === 'down' ? (
                <TrendingDown size={16} color={colors.red} />
              ) : (
                <Activity size={16} color={colors.orange} />
              )}
            </View>
          </View>
          <View style={styles.sentimentBar}>
            <View 
              style={[
                styles.sentimentFill,
                { width: `${item.score}%`, backgroundColor: item.color }
              ]} 
            />
          </View>
        </View>
      ))}
      
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Sentiment Summary</Text>
        <Text style={styles.summaryText}>
          Overall positive sentiment with strong analyst confidence and insider buying activity. 
          Social media buzz remains high following recent earnings.
        </Text>
      </View>
    </View>
  );

  const renderNewsAnalysis = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Recent News Impact</Text>
      {newsItems.map((item, index) => (
        <View key={index} style={styles.newsItem}>
          <View style={styles.newsHeader}>
            <Text style={styles.newsTitle}>{item.title}</Text>
            <View style={[
              styles.sentimentBadge,
              { backgroundColor: item.sentiment === 'positive' ? colors.green + '20' : colors.red + '20' }
            ]}>
              <Text style={[
                styles.sentimentBadgeText,
                { color: item.sentiment === 'positive' ? colors.green : colors.red }
              ]}>
                {item.sentiment}
              </Text>
            </View>
          </View>
          <View style={styles.newsFooter}>
            <Text style={styles.newsSource}>{item.source}</Text>
            <Text style={styles.newsTime}>{item.time}</Text>
          </View>
        </View>
      ))}
      
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>News Summary</Text>
        <Text style={styles.summaryText}>
          Recent news flow has been largely positive with strong earnings and partnership announcements. 
          Monitor regulatory developments in European markets.
        </Text>
      </View>
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'technical':
        return renderTechnicalAnalysis();
      case 'fundamental':
        return renderFundamentalAnalysis();
      case 'sentiment':
        return renderSentimentAnalysis();
      case 'news':
        return renderNewsAnalysis();
      default:
        return renderTechnicalAnalysis();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Market Analysis',
          headerStyle: { backgroundColor: colors.background },
          headerTitleStyle: { color: colors.text, fontWeight: '600' },
        }} 
      />
      
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                activeTab === tab.id && styles.activeTab
              ]}
              onPress={() => setActiveTab(tab.id as AnalysisTab)}
            >
              {tab.icon}
              <Text style={[
                styles.tabText,
                activeTab === tab.id && styles.activeTabText
              ]}>
                {tab.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderTabContent()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabContainer: {
    backgroundColor: 'white',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    gap: 6,
  },
  activeTab: {
    backgroundColor: colors.card,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.secondaryText,
  },
  activeTabText: {
    color: colors.primary,
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
  },
  tabTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 20,
  },
  indicatorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  indicatorInfo: {
    flex: 1,
  },
  indicatorName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  indicatorValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  signalBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  signalText: {
    fontSize: 12,
    fontWeight: '600',
  },
  fundamentalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  fundamentalInfo: {
    flex: 1,
  },
  fundamentalMetric: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  fundamentalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  benchmarkInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  benchmarkLabel: {
    fontSize: 12,
    color: colors.secondaryText,
  },
  benchmarkValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.secondaryText,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sentimentRow: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  sentimentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sentimentSource: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  scoreValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  sentimentBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  sentimentFill: {
    height: '100%',
    borderRadius: 3,
  },
  newsItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  newsTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginRight: 12,
  },
  sentimentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sentimentBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  newsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  newsSource: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.primary,
  },
  newsTime: {
    fontSize: 12,
    color: colors.secondaryText,
  },
  summaryCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: colors.secondaryText,
    lineHeight: 20,
  },
});