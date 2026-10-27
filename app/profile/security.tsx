import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import { Shield, Key, Smartphone, ChevronRight } from 'lucide-react-native';
import colors from '@/constants/colors';

export default function SecurityScreen() {
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loginNotifications, setLoginNotifications] = useState(true);

  const handleChangePassword = () => {
    Alert.alert('Change Password', 'This feature will be implemented soon.');
  };

  const handleSetupTwoFactor = () => {
    Alert.alert('Two-Factor Authentication', 'This feature will be implemented soon.');
  };

  const handleViewSessions = () => {
    Alert.alert('Active Sessions', 'This feature will be implemented soon.');
  };

  const securityOptions = [
    {
      icon: <Key size={24} color={colors.primary} />,
      title: 'Change Password',
      subtitle: 'Update your account password',
      onPress: handleChangePassword,
      showArrow: true,
    },
    {
      icon: <Smartphone size={24} color={colors.primary} />,
      title: 'Active Sessions',
      subtitle: 'Manage your logged-in devices',
      onPress: handleViewSessions,
      showArrow: true,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Security' }} />
      
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Authentication</Text>
          <View style={styles.settingsCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Shield size={24} color={colors.primary} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Biometric Login</Text>
                <Text style={styles.settingSubtitle}>Use fingerprint or face ID to login</Text>
              </View>
              <Switch
                value={biometricEnabled}
                onValueChange={setBiometricEnabled}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="white"
              />
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Smartphone size={24} color={colors.primary} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Two-Factor Authentication</Text>
                <Text style={styles.settingSubtitle}>Add an extra layer of security</Text>
              </View>
              <Switch
                value={twoFactorEnabled}
                onValueChange={(value) => {
                  if (value) {
                    handleSetupTwoFactor();
                  } else {
                    setTwoFactorEnabled(false);
                  }
                }}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="white"
              />
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Shield size={24} color={colors.primary} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Login Notifications</Text>
                <Text style={styles.settingSubtitle}>Get notified of new logins</Text>
              </View>
              <Switch
                value={loginNotifications}
                onValueChange={setLoginNotifications}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="white"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Security</Text>
          <View style={styles.settingsCard}>
            {securityOptions.map((option, index) => (
              <View key={index}>
                <TouchableOpacity style={styles.menuItem} onPress={option.onPress}>
                  <View style={styles.settingIcon}>
                    {option.icon}
                  </View>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingTitle}>{option.title}</Text>
                    <Text style={styles.settingSubtitle}>{option.subtitle}</Text>
                  </View>
                  {option.showArrow && (
                    <ChevronRight size={20} color={colors.secondaryText} />
                  )}
                </TouchableOpacity>
                {index < securityOptions.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Security Tips</Text>
          <Text style={styles.infoText}>
            • Use a strong, unique password{"\n"}
            • Enable two-factor authentication{"\n"}
            • Keep your app updated{"\n"}
            • Don't share your login credentials
          </Text>
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  settingsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
    color: colors.secondaryText,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 16,
  },
  infoSection: {
    marginTop: 32,
    marginBottom: 32,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: colors.secondaryText,
    lineHeight: 20,
  },
});