import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import { 
  MessageCircle, 
  Mail, 
  Phone, 
  FileText, 
  HelpCircle, 
  ChevronRight,
  ExternalLink 
} from 'lucide-react-native';
import colors from '@/constants/colors';

export default function HelpSupportScreen() {
  const handleContactSupport = () => {
    Alert.alert('Contact Support', 'This feature will be implemented soon.');
  };

  const handleOpenFAQ = () => {
    Alert.alert('FAQ', 'This feature will be implemented soon.');
  };

  const handleOpenTerms = () => {
    Alert.alert('Terms of Service', 'This feature will be implemented soon.');
  };

  const handleOpenPrivacy = () => {
    Alert.alert('Privacy Policy', 'This feature will be implemented soon.');
  };

  const handleCallSupport = () => {
    Linking.openURL('tel:+1-800-123-4567');
  };

  const handleEmailSupport = () => {
    Linking.openURL('mailto:support@stockapp.com');
  };

  const contactOptions = [
    {
      icon: <MessageCircle size={24} color={colors.primary} />,
      title: 'Live Chat',
      subtitle: 'Chat with our support team',
      onPress: handleContactSupport,
    },
    {
      icon: <Mail size={24} color={colors.primary} />,
      title: 'Email Support',
      subtitle: 'support@stockapp.com',
      onPress: handleEmailSupport,
    },
    {
      icon: <Phone size={24} color={colors.primary} />,
      title: 'Phone Support',
      subtitle: '+1 (800) 123-4567',
      onPress: handleCallSupport,
    },
  ];

  const resourceOptions = [
    {
      icon: <HelpCircle size={24} color={colors.primary} />,
      title: 'FAQ',
      subtitle: 'Frequently asked questions',
      onPress: handleOpenFAQ,
    },
    {
      icon: <FileText size={24} color={colors.primary} />,
      title: 'Terms of Service',
      subtitle: 'Read our terms and conditions',
      onPress: handleOpenTerms,
    },
    {
      icon: <FileText size={24} color={colors.primary} />,
      title: 'Privacy Policy',
      subtitle: 'How we protect your data',
      onPress: handleOpenPrivacy,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Help & Support' }} />
      
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <View style={styles.optionsCard}>
            {contactOptions.map((option, index) => (
              <View key={index}>
                <TouchableOpacity style={styles.optionItem} onPress={option.onPress}>
                  <View style={styles.optionIcon}>
                    {option.icon}
                  </View>
                  <View style={styles.optionInfo}>
                    <Text style={styles.optionTitle}>{option.title}</Text>
                    <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                  </View>
                  <ChevronRight size={20} color={colors.secondaryText} />
                </TouchableOpacity>
                {index < contactOptions.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resources</Text>
          <View style={styles.optionsCard}>
            {resourceOptions.map((option, index) => (
              <View key={index}>
                <TouchableOpacity style={styles.optionItem} onPress={option.onPress}>
                  <View style={styles.optionIcon}>
                    {option.icon}
                  </View>
                  <View style={styles.optionInfo}>
                    <Text style={styles.optionTitle}>{option.title}</Text>
                    <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                  </View>
                  <ChevronRight size={20} color={colors.secondaryText} />
                </TouchableOpacity>
                {index < resourceOptions.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Need Help?</Text>
          <Text style={styles.infoText}>
            Our support team is available 24/7 to help you with any questions or issues you may have. 
            You can reach us through live chat, email, or phone.
          </Text>
        </View>

        <View style={styles.versionSection}>
          <Text style={styles.versionText}>App Version 1.0.0</Text>
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
  optionsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionInfo: {
    flex: 1,
    marginRight: 16,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  optionSubtitle: {
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
  versionSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  versionText: {
    fontSize: 14,
    color: colors.secondaryText,
  },
});