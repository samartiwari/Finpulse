import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import {
  Bell,
  User,
  Settings,
  CreditCard,
  Shield,
  HelpCircle,
  LogOut,
  X,
  ChevronRight,
  DollarSign,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import colors from '@/constants/colors';
import { useUserStore } from '@/store/userStore';
import { useCurrencyStore } from '@/store/currencyStore';
import Toast from 'react-native-toast-message';

interface CustomHeaderProps {
  title: string;
  showAvatar?: boolean;
  showNotifications?: boolean;
  onBack?: () => void;
}

export default function CustomHeader({
  title,
  showAvatar = true,
  showNotifications = true,
  onBack,
}: CustomHeaderProps) {
  const router = useRouter();
  const { user, logout } = useUserStore();
  const { selectedCurrency } = useCurrencyStore();
  const [showSidebar, setShowSidebar] = useState(false);

  const handleLogout = () => {
    setShowSidebar(false);
    logout();
    Toast.show({
      type: 'success',
      text1: 'Logged Out',
      text2: 'You have been successfully logged out'
    });
    router.replace('/auth/login');
  };

  const menuItems = [
    {
      icon: <User size={20} color={colors.primary} />,
      title: 'Edit Profile',
      onPress: () => {
        setShowSidebar(false);
        router.push('/profile/edit');
      },
    },
    {
      icon: <CreditCard size={20} color={colors.primary} />,
      title: 'Payment & Wallet',
      onPress: () => {
        setShowSidebar(false);
        router.push('/payment');
      },
    },
    {
      icon: <Bell size={20} color={colors.primary} />,
      title: 'Notifications',
      onPress: () => {
        setShowSidebar(false);
        router.push('/profile/notifications');
      },
    },
    {
      icon: <Shield size={20} color={colors.primary} />,
      title: 'Security',
      onPress: () => {
        setShowSidebar(false);
        router.push('/profile/security');
      },
    },
    {
      icon: <DollarSign size={20} color={colors.primary} />,
      title: 'Currency Settings',
      onPress: () => {
        setShowSidebar(false);
        router.push('/profile/currency');
      },
    },
    {
      icon: <HelpCircle size={20} color={colors.primary} />,
      title: 'Help & Support',
      onPress: () => {
        setShowSidebar(false);
        router.push('/profile/help');
      },
    },
  ];

  return (
    <>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
        </View>
        
        <View style={styles.rightActions}>
          {showNotifications && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => router.push('/notifications')}
            >
              <Bell size={24} color={colors.text} />
            </TouchableOpacity>
          )}
          
          {showAvatar && (
            <TouchableOpacity
              style={styles.avatarButton}
              onPress={() => setShowSidebar(true)}
            >
              <Image
                source={{
                  uri: user?.profileImage || user?.avatar || 'https://via.placeholder.com/32'
                }}
                style={styles.avatar}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Sidebar Modal */}
      <Modal
        visible={showSidebar}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowSidebar(false)}
      >
        <SafeAreaView style={styles.sidebarContainer}>
          <View style={styles.sidebarHeader}>
            <View style={styles.userInfo}>
              <Image
                source={{
                  uri: user?.profileImage || user?.avatar || 'https://via.placeholder.com/60'
                }}
                style={styles.sidebarAvatar}
              />
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{user?.name || 'John Doe'}</Text>
                <Text style={styles.userEmail}>{user?.email || 'john@example.com'}</Text>
                <Text style={styles.currency}>{selectedCurrency.name} ({selectedCurrency.symbol})</Text>
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowSidebar(false)}
            >
              <X size={24} color={colors.secondaryText} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.sidebarContent}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={item.onPress}
              >
                <View style={styles.menuIcon}>
                  {item.icon}
                </View>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <ChevronRight size={20} color={colors.secondaryText} />
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <LogOut size={20} color="#FF3B30" />
              <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  sidebarContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sidebarAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: colors.secondaryText,
    marginBottom: 2,
  },
  currency: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  closeButton: {
    padding: 8,
  },
  sidebarContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginTop: 20,
    marginBottom: 40,
    backgroundColor: '#FFF5F5',
    borderRadius: 12,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
  },
});