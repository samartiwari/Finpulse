import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView, 
  Image,
  Alert,
  Platform 
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  User, 
  Settings, 
  CreditCard, 
  Bell, 
  Shield, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Share2,
  Star,
  Award,
  TrendingUp,
  DollarSign 
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';

import colors from '@/constants/colors';
import { useUserStore } from '@/store/userStore';
import { usePortfolioStore } from '@/store/portfolioStore';
import { useCurrencyStore } from '@/store/currencyStore';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useUserStore();
  const portfolio = usePortfolioStore();
  const { formatAmount, selectedCurrency } = useCurrencyStore();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/auth/login');
          }
        },
      ]
    );
  };

  const handleShareProfile = async () => {
    try {
      const shareMessage = `Check out my FinX Stock portfolio! I'm using FinX Stock to manage my investments. My portfolio is worth ${formatAmount(portfolio.totalValue)} with a ${portfolio.changePercent > 0 ? '+' : ''}${portfolio.changePercent}% return!`;
      
      if (Platform.OS === 'web') {
        // Web fallback - create a temporary textarea to copy text
        const textArea = document.createElement('textarea');
        textArea.value = shareMessage;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        Toast.show({
          type: 'success',
          text1: 'Copied!',
          text2: 'Profile details copied to clipboard'
        });
      } else {
        // For mobile platforms, use React Native Share
        const Share = require('react-native').Share;
        await Share.share({
          message: shareMessage,
          title: 'Check out my FinX Stock portfolio!',
        });
      }
    } catch (error) {
      console.log('Error sharing:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Unable to share profile'
      });
    }
  };

  const menuItems = [
    {
      icon: <User size={24} color={colors.primary} />,
      title: 'Edit Profile',
      subtitle: 'Update your personal information',
      onPress: () => router.push('/profile/edit'),
    },
    {
      icon: <CreditCard size={24} color={colors.primary} />,
      title: 'Payment Methods',
      subtitle: 'Manage your payment methods',
      onPress: () => router.push('/profile/payment'),
    },
    {
      icon: <Bell size={24} color={colors.primary} />,
      title: 'Notifications',
      subtitle: 'Customize your notification preferences',
      onPress: () => router.push('/profile/notifications'),
    },
    {
      icon: <Shield size={24} color={colors.primary} />,
      title: 'Security',
      subtitle: 'Protect your account',
      onPress: () => router.push('/profile/security'),
    },
    {
      icon: <HelpCircle size={24} color={colors.primary} />,
      title: 'Help & Support',
      subtitle: 'Get help with your account',
      onPress: () => router.push('/profile/help'),
    },
    {
      icon: <DollarSign size={24} color={colors.primary} />,
      title: 'Currency Settings',
      subtitle: `Currently using ${selectedCurrency.name} (${selectedCurrency.symbol})`,
      onPress: () => router.push('/profile/currency'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <Image 
            source={{ uri: user?.profileImage || user?.avatar || 'https://via.placeholder.com/80' }} 
            style={styles.avatar} 
          />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{user?.name || 'John Doe'}</Text>
            <Text style={styles.email}>{user?.email || 'john@example.com'}</Text>
            {user?.occupation && (
              <Text style={styles.occupation}>{user.occupation}</Text>
            )}
            <Text style={styles.memberSince}>Member since {user?.joinDate || 'Jan 2024'}</Text>
          </View>
          <TouchableOpacity style={styles.shareButton} onPress={handleShareProfile}>
            <Share2 size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Portfolio Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <TrendingUp size={20} color={colors.success} />
            <Text style={styles.statValue}>{formatAmount(portfolio.totalValue)}</Text>
            <Text style={styles.statLabel}>Portfolio Value</Text>
          </View>
          <View style={styles.statItem}>
            <Award size={20} color={colors.primary} />
            <Text style={styles.statValue}>{portfolio.changePercent > 0 ? '+' : ''}{portfolio.changePercent}%</Text>
            <Text style={styles.statLabel}>Total Return</Text>
          </View>
          <View style={styles.statItem}>
            <Star size={20} color={colors.orange} />
            <Text style={styles.statValue}>{portfolio.stocks.length}</Text>
            <Text style={styles.statLabel}>Holdings</Text>
          </View>
        </View>

        {user?.bio && (
          <View style={styles.bioSection}>
            <Text style={styles.bioTitle}>About</Text>
            <Text style={styles.bioText}>{user.bio}</Text>
          </View>
        )}

        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                index === menuItems.length - 1 && styles.lastMenuItem
              ]}
              onPress={item.onPress}
            >
              <View style={styles.menuIcon}>
                {item.icon}
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <ChevronRight size={20} color={colors.secondaryText} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#FF3B30" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  occupation: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    marginBottom: 4,
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: colors.secondaryText,
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 12,
    color: colors.secondaryText,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  statLabel: {
    fontSize: 12,
    color: colors.secondaryText,
    textAlign: 'center',
  },
  bioSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  bioTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  bioText: {
    fontSize: 14,
    color: colors.secondaryText,
    lineHeight: 20,
  },
  menuContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: colors.secondaryText,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 16,
    marginHorizontal: 20,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
  },
});