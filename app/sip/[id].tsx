import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  Calendar,
  TrendingUp,
  DollarSign,
  Clock,
  Target,
  Play,
  Pause,
  Edit3,
  Trash2,
  BarChart3,
  CheckCircle,
  X,
} from 'lucide-react-native';
import colors from '@/constants/colors';
import { useCurrencyStore } from '@/store/currencyStore';

// Mock SIP data - in real app, this would come from a store
const mockSIPData = {
  '1': {
    id: '1',
    stockSymbol: 'AAPL',
    stockName: 'Apple Inc.',
    amount: 500,
    frequency: 'monthly' as const,
    startDate: '2024-01-01',
    status: 'active' as const,
    totalInvested: 3500,
    currentValue: 4200,
    returns: 20,
    nextInvestment: '2024-08-01',
    transactions: [
      { date: '2024-07-01', amount: 500, shares: 2.5, price: 200 },
      { date: '2024-06-01', amount: 500, shares: 2.3, price: 217 },
      { date: '2024-05-01', amount: 500, shares: 2.7, price: 185 },
      { date: '2024-04-01', amount: 500, shares: 2.4, price: 208 },
      { date: '2024-03-01', amount: 500, shares: 2.8, price: 179 },
      { date: '2024-02-01', amount: 500, shares: 2.6, price: 192 },
      { date: '2024-01-01', amount: 500, shares: 2.9, price: 172 },
    ],
  },
};

export default function SIPDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { formatAmount } = useCurrencyStore();
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [modifiedAmount, setModifiedAmount] = useState('');
  const [modifiedFrequency, setModifiedFrequency] = useState<'weekly' | 'monthly' | 'quarterly'>('monthly');

  const sipData = mockSIPData[id as keyof typeof mockSIPData];

  if (!sipData) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen 
          options={{ 
            title: 'SIP Details',
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <ArrowLeft size={24} color="#1A1A1A" />
              </TouchableOpacity>
            ),
          }} 
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>SIP plan not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handlePauseSIP = () => {
    Alert.alert(
      'Pause SIP',
      'Are you sure you want to pause this SIP plan?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Pause', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'SIP plan has been paused');
          }
        },
      ]
    );
  };

  const handleResumeSIP = () => {
    Alert.alert('Success', 'SIP plan has been resumed');
  };

  const handleDeleteSIP = () => {
    Alert.alert(
      'Delete SIP',
      'Are you sure you want to delete this SIP plan? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            router.back();
            Alert.alert('Success', 'SIP plan has been deleted');
          }
        },
      ]
    );
  };

  const handleModifySIP = () => {
    setModifiedAmount(sipData.amount.toString());
    setModifiedFrequency(sipData.frequency);
    setShowModifyModal(true);
  };

  const saveModifications = () => {
    if (!modifiedAmount) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setShowModifyModal(false);
    Alert.alert('Success', 'SIP plan has been modified successfully');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return colors.success;
      case 'paused':
        return colors.warning;
      case 'completed':
        return colors.primary;
      default:
        return colors.secondaryText;
    }
  };

  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case 'weekly':
        return 'Weekly';
      case 'monthly':
        return 'Monthly';
      case 'quarterly':
        return 'Quarterly';
      default:
        return 'Monthly';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: `${sipData.stockSymbol} SIP`,
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
          <View style={styles.stockInfo}>
            <Text style={styles.stockSymbol}>{sipData.stockSymbol}</Text>
            <Text style={styles.stockName}>{sipData.stockName}</Text>
          </View>
          
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(sipData.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(sipData.status) }]}>
              {sipData.status.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Performance Summary */}
        <View style={styles.performanceCard}>
          <Text style={styles.sectionTitle}>Performance Summary</Text>
          
          <View style={styles.performanceGrid}>
            <View style={styles.performanceItem}>
              <Target size={20} color={colors.primary} />
              <Text style={styles.performanceValue}>{formatAmount(sipData.totalInvested)}</Text>
              <Text style={styles.performanceLabel}>Total Invested</Text>
            </View>
            
            <View style={styles.performanceItem}>
              <TrendingUp size={20} color={colors.success} />
              <Text style={styles.performanceValue}>{formatAmount(sipData.currentValue)}</Text>
              <Text style={styles.performanceLabel}>Current Value</Text>
            </View>
            
            <View style={styles.performanceItem}>
              <BarChart3 size={20} color={sipData.returns >= 0 ? colors.success : colors.error} />
              <Text style={[
                styles.performanceValue,
                { color: sipData.returns >= 0 ? colors.success : colors.error }
              ]}>
                {sipData.returns >= 0 ? '+' : ''}{sipData.returns.toFixed(2)}%
              </Text>
              <Text style={styles.performanceLabel}>Returns</Text>
            </View>
          </View>
        </View>

        {/* SIP Details */}
        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>SIP Details</Text>
          
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <DollarSign size={16} color={colors.secondaryText} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Investment Amount</Text>
              <Text style={styles.detailValue}>{formatAmount(sipData.amount)}</Text>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Clock size={16} color={colors.secondaryText} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Frequency</Text>
              <Text style={styles.detailValue}>{getFrequencyText(sipData.frequency)}</Text>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Calendar size={16} color={colors.secondaryText} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Start Date</Text>
              <Text style={styles.detailValue}>{new Date(sipData.startDate).toLocaleDateString()}</Text>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Calendar size={16} color={colors.primary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Next Investment</Text>
              <Text style={[styles.detailValue, { color: colors.primary }]}>
                {new Date(sipData.nextInvestment).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Transaction History */}
        <View style={styles.historyCard}>
          <Text style={styles.sectionTitle}>Transaction History</Text>
          
          {sipData.transactions.map((transaction, index) => (
            <View key={index} style={styles.transactionRow}>
              <View style={styles.transactionDate}>
                <Text style={styles.transactionDateText}>
                  {new Date(transaction.date).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionAmount}>{formatAmount(transaction.amount)}</Text>
                <Text style={styles.transactionShares}>
                  {transaction.shares} shares @ {formatAmount(transaction.price)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={handleModifySIP}>
            <Edit3 size={20} color={colors.primary} />
            <Text style={styles.actionButtonText}>Modify</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, sipData.status === 'active' ? styles.pauseButton : styles.resumeButton]} 
            onPress={sipData.status === 'active' ? handlePauseSIP : handleResumeSIP}
          >
            {sipData.status === 'active' ? (
              <Pause size={20} color="white" />
            ) : (
              <Play size={20} color="white" />
            )}
            <Text style={[styles.actionButtonText, { color: 'white' }]}>
              {sipData.status === 'active' ? 'Pause' : 'Resume'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteSIP}>
          <Trash2 size={20} color={colors.error} />
          <Text style={styles.deleteButtonText}>Delete SIP Plan</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modify Modal */}
      <Modal
        visible={showModifyModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Modify SIP Plan</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowModifyModal(false)}
            >
              <X size={24} color={colors.secondaryText} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Investment Amount</Text>
              <TextInput
                style={styles.input}
                value={modifiedAmount}
                onChangeText={setModifiedAmount}
                placeholder="500"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Frequency</Text>
              <View style={styles.frequencySelector}>
                {['weekly', 'monthly', 'quarterly'].map((freq) => (
                  <TouchableOpacity
                    key={freq}
                    style={[
                      styles.frequencyButton,
                      modifiedFrequency === freq && styles.selectedFrequency
                    ]}
                    onPress={() => setModifiedFrequency(freq as any)}
                  >
                    <Text style={[
                      styles.frequencyText,
                      modifiedFrequency === freq && styles.selectedFrequencyText
                    ]}>
                      {getFrequencyText(freq)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={saveModifications}>
              <CheckCircle size={20} color="white" />
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  stockInfo: {
    flex: 1,
  },
  stockSymbol: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  stockName: {
    fontSize: 16,
    color: colors.secondaryText,
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
  performanceCard: {
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
  performanceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  performanceItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  performanceValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  performanceLabel: {
    fontSize: 12,
    color: colors.secondaryText,
    textAlign: 'center',
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
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.secondaryText,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  historyCard: {
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
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  transactionDate: {
    width: 80,
  },
  transactionDateText: {
    fontSize: 12,
    color: colors.secondaryText,
  },
  transactionDetails: {
    flex: 1,
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  transactionShares: {
    fontSize: 12,
    color: colors.secondaryText,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  pauseButton: {
    backgroundColor: colors.warning,
  },
  resumeButton: {
    backgroundColor: colors.success,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginHorizontal: 16,
    marginBottom: 32,
    backgroundColor: 'white',
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.error,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  frequencySelector: {
    flexDirection: 'row',
    gap: 8,
  },
  frequencyButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  selectedFrequency: {
    backgroundColor: colors.primary,
  },
  frequencyText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.secondaryText,
  },
  selectedFrequencyText: {
    color: 'white',
  },
  saveButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 20,
    marginBottom: 40,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});