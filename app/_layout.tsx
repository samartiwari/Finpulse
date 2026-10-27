import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet, Platform } from "react-native";
import Toast from 'react-native-toast-message';
import * as Notifications from 'expo-notifications';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="auth/login" options={{ headerShown: false }} />
      <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
      <Stack.Screen name="stock/[id]" options={{ headerShown: true }} />
      <Stack.Screen name="watchlist" options={{ headerShown: true }} />
      <Stack.Screen name="notifications" options={{ headerShown: true }} />
      <Stack.Screen name="transaction/[id]" options={{ headerShown: true }} />
      <Stack.Screen name="profile/edit" options={{ headerShown: true }} />
      <Stack.Screen name="profile/payment" options={{ headerShown: true }} />
      <Stack.Screen name="profile/notifications" options={{ headerShown: true }} />
      <Stack.Screen name="profile/security" options={{ headerShown: true }} />
      <Stack.Screen name="profile/help" options={{ headerShown: true }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    const hideSplash = async () => {
      await SplashScreen.hideAsync();
    };
    hideSplash();
    
    // Request notification permissions
    const requestNotificationPermissions = async () => {
      if (Platform.OS !== 'web') {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          console.log('Notification permission not granted');
        }
      }
    };
    
    requestNotificationPermissions();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={styles.container}>
        <RootLayoutNav />
        <Toast />
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
