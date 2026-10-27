import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import {
  Calendar,
  TrendingUp,
  DollarSign,
  Clock,
  Plus,
  Target,
  BarChart3,
  ArrowRight,
  CheckCircle,
  X,
} from 'lucide-react-native';
import colors from '@/constants/colors';

interface SIPPlan {
  id: string;
  stockSymbol: string;
  stockName: string;
  amount: number;
  frequency: 'weekly' | 'monthly' | 'quarterly';
  startDate: string;
  endDate?: string;
  status: 'active' | 'paused' | 'completed';
  totalInvested: number;
  currentValue: number;
  returns: number;
  nextInvestment: string;
}

const mockSIPPlans: SIPPlan[] = [
  {
    id: '1',
    stockSymbol: 'AAPL',
    stockName: 'Apple Inc.',
    amount: 500,
    frequency: 'monthly',
    startDate: '2024-01-01',
    status: 'active',
    totalInvested: 3500,
    currentValue: 4200,
    returns: 20,
    nextInvestment: '2024-08-01',
  },
  {
    id: '2',
    stockSymbol: 'MSFT',
    stockName: 'Microsoft Corp.',
    amount: 300,
    frequency: 'monthly',
    startDate: '2024-02-01',
    status: 'active',
    totalInvested: 1800,
    currentValue: 2100,
    returns: 16.67,
    nextInvestment: '2024-08-01',
  },
];

export default function SIPScreen() {
  const router = useRouter();
  const [sipPlans, setSipPlans] = useState<SIPPlan[]>(mockSIPPlans);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSIP, setNewSIP] = useState({
    stockSymbol: '',
    stockName: '',
    amount: '',
    frequency: 'monthly' as 'weekly' | 'monthly' | 'quarterly',
    startDate: new Date().toISOString().split('T')[0],
  });

  const totalInvested = sipPlans.reduce((sum, plan) => sum + plan.totalInvested, 0);
  const totalCurrentValue = sipPlans.reduce((sum, plan) => sum + plan.currentValue, 0);
  const totalReturns = totalCurrentValue - totalInvested;
  const totalReturnsPercent = totalInvested > 0 ? (totalReturns / totalInvested) * 100 : 0;

  const createSIP = () => {
    if (!newSIP.stockSymbol || !newSIP.amount) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    const newPlan: SIPPlan = {
      id: Date.now().toString(),
      stockSymbol: newSIP.stockSymbol.toUpperCase(),
      stockName: newSIP.stockName || `${newSIP.stockSymbol} Corp.`,
      amount: parseFloat(newSIP.amount),
      frequency: newSIP.frequency,
      startDate: newSIP.startDate,
      status: 'active',
      totalInvested: 0,
      currentValue: 0,
      returns: 0,
      nextInvestment: getNextInvestmentDate(newSIP.startDate, newSIP.frequency),
    };

    setSipPlans([...sipPlans, newPlan]);
    setShowCreateModal(false);
    setNewSIP({
      stockSymbol: '',
      stockName: '',
      amount: '',
      frequency: 'monthly',
      startDate: new Date().toISOString().split('T')[0],
    });
  };

  const getNextInvestmentDate = (startDate: string, frequency: string) => {
    const date = new Date(startDate);
    const today = new Date();
    
    while (date <= today) {
      if (frequency === 'weekly') {
        date.setDate(date.getDate() + 7);
      } else if (frequency === 'monthly') {
        date.setMonth(date.getMonth() + 1);
      } else if (frequency === 'quarterly') {
        date.setMonth(date.getMonth() + 3);
      }
    }
    
    return date.toISOString().split('T')[0];
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
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'SIP Investments', headerShown: false }} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>SIP Investments</Text>
          <Text style={styles.subtitle}>Systematic Investment Plans</Text>
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Invested</Text>
              <Text style={styles.summaryValue}>${totalInvested.toLocaleString()}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Current Value</Text>
              <Text style={styles.summaryValue}>${totalCurrentValue.toLocaleString()}</Text>
            </View>
          </View>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Returns</Text>
              <Text style={[
                styles.summaryValue,
                { color: totalReturns >= 0 ? colors.success : colors.error }
              ]}>
                {totalReturns >= 0 ? '+' : ''}${totalReturns.toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Returns %</Text>
              <Text style={[
                styles.summaryValue,
                { color: totalReturnsPercent >= 0 ? colors.success : colors.error }
              ]}>
                {totalReturnsPercent >= 0 ? '+' : ''}{totalReturnsPercent.toFixed(2)}%
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => setShowCreateModal(true)}
          >
            <Plus size={20} color="white" />
            <Text style={styles.createButtonText}>Create New SIP</Text>
          </TouchableOpacity>
        </View>

        {/* SIP Plans */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your SIP Plans ({sipPlans.length})</Text>
          
          {sipPlans.map((plan) => (
            <View key={plan.id} style={styles.sipCard}>
              <View style={styles.sipHeader}>
                <View>
                  <Text style={styles.sipSymbol}>{plan.stockSymbol}</Text>
                  <Text style={styles.sipName}>{plan.stockName}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(plan.status) + '20' }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(plan.status) }]}>
                    {plan.status.toUpperCase()}
                  </Text>
                </View>
              </View>

              <View style={styles.sipDetails}>
                <View style={styles.sipDetailRow}>
                  <View style={styles.sipDetailItem}>
                    <DollarSign size={16} color={colors.secondaryText} />
                    <Text style={styles.sipDetailLabel}>Amount</Text>
                    <Text style={styles.sipDetailValue}>${plan.amount}</Text>
                  </View>
                  <View style={styles.sipDetailItem}>
                    <Clock size={16} color={colors.secondaryText} />
                    <Text style={styles.sipDetailLabel}>Frequency</Text>
                    <Text style={styles.sipDetailValue}>{getFrequencyText(plan.frequency)}</Text>
                  </View>
                </View>

                <View style={styles.sipDetailRow}>
                  <View style={styles.sipDetailItem}>
                    <Target size={16} color={colors.secondaryText} />
                    <Text style={styles.sipDetailLabel}>Invested</Text>
                    <Text style={styles.sipDetailValue}>${plan.totalInvested.toLocaleString()}</Text>
                  </View>
                  <View style={styles.sipDetailItem}>
                    <TrendingUp size={16} color={colors.secondaryText} />
                    <Text style={styles.sipDetailLabel}>Returns</Text>
                    <Text style={[
                      styles.sipDetailValue,
                      { color: plan.returns >= 0 ? colors.success : colors.error }
                    ]}>
                      {plan.returns >= 0 ? '+' : ''}{plan.returns.toFixed(2)}%
                    </Text>
                  </View>
                </View>

                <View style={styles.nextInvestment}>
                  <Calendar size={16} color={colors.primary} />
                  <Text style={styles.nextInvestmentText}>
                    Next investment: {new Date(plan.nextInvestment).toLocaleDateString()}
                  </Text>
                </View>
              </View>

              <View style={styles.sipActions}>
                <TouchableOpacity style={styles.sipActionButton}>
                  <Text style={styles.sipActionText}>Modify</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sipActionButton}>
                  <Text style={styles.sipActionText}>Pause</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.sipActionButton, styles.primaryAction]}
                  onPress={() => router.push(`/sip/${plan.id}`)}
                >
                  <Text style={[styles.sipActionText, { color: 'white' }]}>View Details</Text>
                  <ArrowRight size={16} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {sipPlans.length === 0 && (
            <View style={styles.emptyState}>
              <BarChart3 size={48} color={colors.secondaryText} />
              <Text style={styles.emptyTitle}>No SIP Plans Yet</Text>
              <Text style={styles.emptySubtitle}>
                Start your systematic investment journey by creating your first SIP plan
              </Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => setShowCreateModal(true)}
              >
                <Text style={styles.emptyButtonText}>Create Your First SIP</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Create SIP Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Create New SIP</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowCreateModal(false)}
            >
              <X size={24} color={colors.secondaryText} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Stock Symbol *</Text>
              <TextInput
                style={styles.input}
                value={newSIP.stockSymbol}
                onChangeText={(text) => setNewSIP({ ...newSIP, stockSymbol: text.toUpperCase() })}
                placeholder="e.g., AAPL"
                autoCapitalize="characters"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Stock Name</Text>
              <TextInput
                style={styles.input}
                value={newSIP.stockName}
                onChangeText={(text) => setNewSIP({ ...newSIP, stockName: text })}
                placeholder="e.g., Apple Inc."
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Investment Amount *</Text>
              <TextInput
                style={styles.input}
                value={newSIP.amount}
                onChangeText={(text) => setNewSIP({ ...newSIP, amount: text })}
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
                      newSIP.frequency === freq && styles.selectedFrequency
                    ]}
                    onPress={() => setNewSIP({ ...newSIP, frequency: freq as any })}
                  >
                    <Text style={[
                      styles.frequencyText,
                      newSIP.frequency === freq && styles.selectedFrequencyText
                    ]}>
                      {getFrequencyText(freq)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Start Date</Text>
              <TextInput
                style={styles.input}
                value={newSIP.startDate}
                onChangeText={(text) => setNewSIP({ ...newSIP, startDate: text })}
                placeholder="YYYY-MM-DD"
              />
            </View>

            <TouchableOpacity style={styles.createSIPButton} onPress={createSIP}>
              <CheckCircle size={20} color="white" />
              <Text style={styles.createSIPButtonText}>Create SIP Plan</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.secondaryText,
  },
  summaryCard: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryItem: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.secondaryText,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  actionButtons: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  sipCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  sipSymbol: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  sipName: {
    fontSize: 14,
    color: colors.secondaryText,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sipDetails: {
    marginBottom: 16,
  },
  sipDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sipDetailItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sipDetailLabel: {
    fontSize: 12,
    color: colors.secondaryText,
  },
  sipDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginLeft: 'auto',
  },
  nextInvestment: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primary + '10',
    padding: 12,
    borderRadius: 8,
  },
  nextInvestmentText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  sipActions: {
    flexDirection: 'row',
    gap: 8,
  },
  sipActionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  primaryAction: {
    backgroundColor: colors.primary,
  },
  sipActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.secondaryText,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.secondaryText,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  emptyButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
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
  createSIPButton: {
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
  createSIPButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});