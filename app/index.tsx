import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useUserStore } from '@/store/userStore';
import colors from '@/constants/colors';

export default function Index() {
  const [isReady, setIsReady] = useState(false);
  const isAuthenticated = useUserStore(state => state.isAuthenticated);

  useEffect(() => {
    // Simple delay to ensure navigation is ready
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    try {
      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        router.replace('/auth/login');
      }
    } catch (error) {
      console.log('Navigation error:', error);
      // Fallback navigation after a longer delay
      setTimeout(() => {
        try {
          if (isAuthenticated) {
            router.replace('/(tabs)');
          } else {
            router.replace('/auth/login');
          }
        } catch (e) {
          console.log('Fallback navigation failed:', e);
        }
      }, 500);
    }
  }, [isReady, isAuthenticated]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});