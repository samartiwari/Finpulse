import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Clock, ExternalLink } from 'lucide-react-native';
import colors from '@/constants/colors';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  imageUrl: string;
  url: string;
}

const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'Tech Stocks Rally as AI Investments Surge',
    summary: 'Major technology companies see significant gains following increased AI investment announcements.',
    source: 'Financial Times',
    publishedAt: '2 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300&h=200&fit=crop',
    url: 'https://example.com/news/1',
  },
  {
    id: '2',
    title: 'Federal Reserve Signals Potential Rate Changes',
    summary: 'Fed officials hint at possible monetary policy adjustments in upcoming meetings.',
    source: 'Reuters',
    publishedAt: '4 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=300&h=200&fit=crop',
    url: 'https://example.com/news/2',
  },
  {
    id: '3',
    title: 'Energy Sector Shows Strong Performance',
    summary: 'Oil and gas companies report better-than-expected quarterly earnings.',
    source: 'Bloomberg',
    publishedAt: '6 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=300&h=200&fit=crop',
    url: 'https://example.com/news/3',
  },
];

interface MarketNewsProps {
  onViewAll?: () => void;
}

export default function MarketNews({ onViewAll }: MarketNewsProps) {
  const handleNewsPress = (url: string) => {
    // In a real app, you'd open the URL in a browser or in-app browser
    console.log('Opening news:', url);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Market News</Text>
        {onViewAll && (
          <TouchableOpacity onPress={onViewAll}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.newsScroll}>
        {mockNews.map((news) => (
          <TouchableOpacity
            key={news.id}
            style={styles.newsCard}
            onPress={() => handleNewsPress(news.url)}
          >
            <Image source={{ uri: news.imageUrl }} style={styles.newsImage} />
            <View style={styles.newsContent}>
              <Text style={styles.newsTitle} numberOfLines={2}>
                {news.title}
              </Text>
              <Text style={styles.newsSummary} numberOfLines={2}>
                {news.summary}
              </Text>
              <View style={styles.newsFooter}>
                <Text style={styles.newsSource}>{news.source}</Text>
                <View style={styles.timeContainer}>
                  <Clock size={12} color={colors.secondaryText} />
                  <Text style={styles.newsTime}>{news.publishedAt}</Text>
                </View>
              </View>
            </View>
            <View style={styles.externalIcon}>
              <ExternalLink size={14} color={colors.secondaryText} />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  viewAll: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  newsScroll: {
    paddingLeft: 20,
  },
  newsCard: {
    width: 280,
    backgroundColor: 'white',
    borderRadius: 16,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  newsImage: {
    width: '100%',
    height: 120,
  },
  newsContent: {
    padding: 16,
    flex: 1,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
    lineHeight: 22,
  },
  newsSummary: {
    fontSize: 14,
    color: colors.secondaryText,
    lineHeight: 20,
    marginBottom: 12,
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
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  newsTime: {
    fontSize: 12,
    color: colors.secondaryText,
  },
  externalIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 6,
  },
});