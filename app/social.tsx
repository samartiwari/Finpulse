import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  TextInput,
} from 'react-native';
import { Stack } from 'expo-router';
import {
  Heart,
  MessageCircle,
  Share2,
  TrendingUp,
  TrendingDown,
  Users,
  Star,
  Search,
  Filter,
  MoreHorizontal,
} from 'lucide-react-native';
import colors from '@/constants/colors';

interface SocialPost {
  id: string;
  user: {
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
    followers: number;
  };
  content: string;
  stock?: {
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
  };
  timestamp: Date;
  likes: number;
  comments: number;
  shares: number;
  liked: boolean;
}

interface TopTrader {
  id: string;
  name: string;
  username: string;
  avatar: string;
  return: number;
  followers: number;
  following: boolean;
}

export default function SocialTradingScreen() {
  const [activeTab, setActiveTab] = useState<'feed' | 'traders' | 'ideas'>('feed');
  const [searchQuery, setSearchQuery] = useState('');

  const socialPosts: SocialPost[] = [
    {
      id: '1',
      user: {
        name: 'Sarah Chen',
        username: '@sarahtrader',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9c5e8e1?w=100&h=100&fit=crop&crop=face',
        verified: true,
        followers: 12500,
      },
      content: 'Just opened a position in $AAPL. The technical setup looks perfect with a breakout above resistance. Target $160 📈',
      stock: {
        symbol: 'AAPL',
        price: 155.80,
        change: 2.45,
        changePercent: 1.60,
      },
      timestamp: new Date('2024-01-15T14:30:00'),
      likes: 234,
      comments: 45,
      shares: 12,
      liked: false,
    },
    {
      id: '2',
      user: {
        name: 'Mike Rodriguez',
        username: '@miketrading',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        verified: false,
        followers: 8900,
      },
      content: 'Market volatility is creating great opportunities. Remember to manage your risk and stick to your strategy! 💪',
      timestamp: new Date('2024-01-15T13:15:00'),
      likes: 156,
      comments: 28,
      shares: 8,
      liked: true,
    },
    {
      id: '3',
      user: {
        name: 'Emma Thompson',
        username: '@emmafinance',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        verified: true,
        followers: 25600,
      },
      content: 'Earnings season is here! My watchlist includes $MSFT, $GOOGL, and $TSLA. What are you watching? 👀',
      stock: {
        symbol: 'MSFT',
        price: 375.20,
        change: -1.85,
        changePercent: -0.49,
      },
      timestamp: new Date('2024-01-15T12:00:00'),
      likes: 389,
      comments: 67,
      shares: 23,
      liked: false,
    },
  ];

  const topTraders: TopTrader[] = [
    {
      id: '1',
      name: 'Alex Johnson',
      username: '@alextrader',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      return: 45.2,
      followers: 15600,
      following: false,
    },
    {
      id: '2',
      name: 'Lisa Wang',
      username: '@lisainvests',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
      return: 38.7,
      followers: 12300,
      following: true,
    },
    {
      id: '3',
      name: 'David Kim',
      username: '@davidtrades',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face',
      return: 32.1,
      followers: 9800,
      following: false,
    },
  ];

  const handleLike = (postId: string) => {
    // Handle like functionality
    console.log('Liked post:', postId);
  };

  const handleFollow = (traderId: string) => {
    // Handle follow functionality
    console.log('Followed trader:', traderId);
  };

  const renderFeed = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {socialPosts.map((post) => (
        <View key={post.id} style={styles.postCard}>
          <View style={styles.postHeader}>
            <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
            <View style={styles.userInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.userName}>{post.user.name}</Text>
                {post.user.verified && (
                  <View style={styles.verifiedBadge}>
                    <Text style={styles.verifiedText}>✓</Text>
                  </View>
                )}
              </View>
              <Text style={styles.username}>{post.user.username}</Text>
              <Text style={styles.timestamp}>
                {post.timestamp.toLocaleDateString()} • {post.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
            <TouchableOpacity style={styles.moreButton}>
              <MoreHorizontal size={20} color={colors.secondaryText} />
            </TouchableOpacity>
          </View>

          <Text style={styles.postContent}>{post.content}</Text>

          {post.stock && (
            <View style={styles.stockCard}>
              <View style={styles.stockInfo}>
                <Text style={styles.stockSymbol}>{post.stock.symbol}</Text>
                <Text style={styles.stockPrice}>${post.stock.price.toFixed(2)}</Text>
              </View>
              <View style={styles.stockChange}>
                <Text style={[
                  styles.stockChangeValue,
                  { color: post.stock.change >= 0 ? colors.green : colors.red }
                ]}>
                  {post.stock.change >= 0 ? '+' : ''}${post.stock.change.toFixed(2)}
                </Text>
                <Text style={[
                  styles.stockChangePercent,
                  { color: post.stock.changePercent >= 0 ? colors.green : colors.red }
                ]}>
                  ({post.stock.changePercent >= 0 ? '+' : ''}{post.stock.changePercent}%)
                </Text>
              </View>
            </View>
          )}

          <View style={styles.postActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleLike(post.id)}
            >
              <Heart 
                size={20} 
                color={post.liked ? colors.red : colors.secondaryText}
                fill={post.liked ? colors.red : 'none'}
              />
              <Text style={[
                styles.actionText,
                post.liked && { color: colors.red }
              ]}>
                {post.likes}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <MessageCircle size={20} color={colors.secondaryText} />
              <Text style={styles.actionText}>{post.comments}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Share2 size={20} color={colors.secondaryText} />
              <Text style={styles.actionText}>{post.shares}</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const renderTraders = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Top Performers</Text>
      {topTraders.map((trader) => (
        <View key={trader.id} style={styles.traderCard}>
          <Image source={{ uri: trader.avatar }} style={styles.traderAvatar} />
          <View style={styles.traderInfo}>
            <Text style={styles.traderName}>{trader.name}</Text>
            <Text style={styles.traderUsername}>{trader.username}</Text>
            <View style={styles.traderStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>+{trader.return}%</Text>
                <Text style={styles.statLabel}>Return</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{trader.followers.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity 
            style={[
              styles.followButton,
              trader.following && styles.followingButton
            ]}
            onPress={() => handleFollow(trader.id)}
          >
            <Text style={[
              styles.followButtonText,
              trader.following && styles.followingButtonText
            ]}>
              {trader.following ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );

  const renderIdeas = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Trading Ideas</Text>
      <View style={styles.ideaCard}>
        <View style={styles.ideaHeader}>
          <Text style={styles.ideaTitle}>Bullish on Tech Stocks</Text>
          <View style={styles.ideaBadge}>
            <TrendingUp size={16} color={colors.green} />
            <Text style={[styles.ideaBadgeText, { color: colors.green }]}>BULLISH</Text>
          </View>
        </View>
        <Text style={styles.ideaDescription}>
          Strong earnings from major tech companies and AI adoption driving growth. 
          Consider positions in AAPL, MSFT, and GOOGL.
        </Text>
        <View style={styles.ideaFooter}>
          <Text style={styles.ideaAuthor}>By @techanalyst</Text>
          <View style={styles.ideaEngagement}>
            <Heart size={16} color={colors.secondaryText} />
            <Text style={styles.engagementText}>124</Text>
          </View>
        </View>
      </View>

      <View style={styles.ideaCard}>
        <View style={styles.ideaHeader}>
          <Text style={styles.ideaTitle}>Energy Sector Rotation</Text>
          <View style={[styles.ideaBadge, { backgroundColor: colors.red + '20' }]}>
            <TrendingDown size={16} color={colors.red} />
            <Text style={[styles.ideaBadgeText, { color: colors.red }]}>BEARISH</Text>
          </View>
        </View>
        <Text style={styles.ideaDescription}>
          Oil prices under pressure from global economic concerns. 
          Consider reducing exposure to energy stocks.
        </Text>
        <View style={styles.ideaFooter}>
          <Text style={styles.ideaAuthor}>By @energytrader</Text>
          <View style={styles.ideaEngagement}>
            <Heart size={16} color={colors.secondaryText} />
            <Text style={styles.engagementText}>89</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'feed':
        return renderFeed();
      case 'traders':
        return renderTraders();
      case 'ideas':
        return renderIdeas();
      default:
        return renderFeed();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Social Trading',
          headerStyle: { backgroundColor: colors.background },
          headerTitleStyle: { color: colors.text, fontWeight: '600' },
        }} 
      />
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={colors.secondaryText} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search traders, stocks, ideas..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.secondaryText}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {[
          { id: 'feed', name: 'Feed', icon: <MessageCircle size={20} /> },
          { id: 'traders', name: 'Traders', icon: <Users size={20} /> },
          { id: 'ideas', name: 'Ideas', icon: <Star size={20} /> },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && styles.activeTab
            ]}
            onPress={() => setActiveTab(tab.id as any)}
          >
            {React.cloneElement(tab.icon, {
              color: activeTab === tab.id ? colors.primary : colors.secondaryText
            })}
            <Text style={[
              styles.tabText,
              activeTab === tab.id && styles.activeTabText
            ]}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.content}>
        {renderTabContent()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    margin: 16,
    marginBottom: 12,
  },
  postCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  verifiedBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  username: {
    fontSize: 12,
    color: colors.secondaryText,
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 11,
    color: colors.secondaryText,
  },
  moreButton: {
    padding: 4,
  },
  postContent: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  stockCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  stockInfo: {},
  stockSymbol: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  stockPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  stockChange: {
    alignItems: 'flex-end',
  },
  stockChangeValue: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  stockChangePercent: {
    fontSize: 12,
    fontWeight: '500',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 12,
    color: colors.secondaryText,
    fontWeight: '500',
  },
  traderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
  },
  traderAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  traderInfo: {
    flex: 1,
  },
  traderName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  traderUsername: {
    fontSize: 12,
    color: colors.secondaryText,
    marginBottom: 8,
  },
  traderStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  statLabel: {
    fontSize: 10,
    color: colors.secondaryText,
  },
  followButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  followingButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  followButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  followingButtonText: {
    color: colors.primary,
  },
  ideaCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
  },
  ideaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ideaTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  ideaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.green + '20',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  ideaBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  ideaDescription: {
    fontSize: 14,
    color: colors.secondaryText,
    lineHeight: 20,
    marginBottom: 12,
  },
  ideaFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ideaAuthor: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  ideaEngagement: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  engagementText: {
    fontSize: 12,
    color: colors.secondaryText,
  },
});