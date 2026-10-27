import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  TextInput, 
  Alert,
  SafeAreaView,
  ScrollView 
} from 'react-native';
import { Bell, Plus, X, TrendingUp, TrendingDown, Trash2 } from 'lucide-react-native';
import colors from '@/constants/colors';

interface PriceAlert {
  id: string;
  symbol: string;
  name: string;
  targetPrice: number;
  currentPrice: number;
  type: 'above' | 'below';
  isActive: boolean;
  createdAt: string;
}

interface PriceAlertsProps {
  visible: boolean;
  onClose: () => void;
}

export default function PriceAlerts({ visible, onClose }: PriceAlertsProps) {
  const [alerts, setAlerts] = useState<PriceAlert[]>([
    {
      id: '1',
      symbol: 'AAPL',
      name: 'Apple Inc.',
      targetPrice: 200,
      currentPrice: 185.50,
      type: 'above',
      isActive: true,
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      targetPrice: 180,
      currentPrice: 195.30,
      type: 'below',
      isActive: true,
      createdAt: '2024-01-14',
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newAlert, setNewAlert] = useState({
    symbol: '',
    targetPrice: '',
    type: 'above' as 'above' | 'below',
  });

  const handleAddAlert = () => {
    if (!newAlert.symbol || !newAlert.targetPrice) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const alert: PriceAlert = {
      id: Date.now().toString(),
      symbol: newAlert.symbol.toUpperCase(),
      name: `${newAlert.symbol.toUpperCase()} Inc.`, // In real app, fetch from API
      targetPrice: parseFloat(newAlert.targetPrice),
      currentPrice: 150, // In real app, fetch current price
      type: newAlert.type,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setAlerts([...alerts, alert]);
    setNewAlert({ symbol: '', targetPrice: '', type: 'above' });
    setShowAddModal(false);
    Alert.alert('Success', 'Price alert created successfully');
  };

  const handleDeleteAlert = (id: string) => {
    Alert.alert(
      'Delete Alert',
      'Are you sure you want to delete this price alert?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => setAlerts(alerts.filter(alert => alert.id !== id))
        },
      ]
    );
  };

  const toggleAlert = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, isActive: !alert.isActive } : alert
    ));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Price Alerts</Text>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color="#1A1A1A" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <Plus size={20} color="white" />
            <Text style={styles.addButtonText}>Create Alert</Text>
          </TouchableOpacity>

          <View style={styles.alertsList}>
            {alerts.map((alert) => (
              <View key={alert.id} style={styles.alertCard}>
                <View style={styles.alertHeader}>
                  <View style={styles.stockInfo}>
                    <Text style={styles.symbol}>{alert.symbol}</Text>
                    <Text style={styles.stockName}>{alert.name}</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => handleDeleteAlert(alert.id)}
                  >
                    <Trash2 size={16} color="#FF3B30" />
                  </TouchableOpacity>
                </View>

                <View style={styles.alertDetails}>
                  <View style={styles.priceInfo}>
                    <Text style={styles.label}>Current Price</Text>
                    <Text style={styles.currentPrice}>${alert.currentPrice.toFixed(2)}</Text>
                  </View>
                  
                  <View style={styles.targetInfo}>
                    <View style={styles.targetHeader}>
                      {alert.type === 'above' ? (
                        <TrendingUp size={16} color={colors.success} />
                      ) : (
                        <TrendingDown size={16} color={colors.error} />
                      )}
                      <Text style={styles.label}>
                        Alert when {alert.type} ${alert.targetPrice.toFixed(2)}
                      </Text>
                    </View>
                    
                    <View style={styles.progressContainer}>
                      <View style={styles.progressBar}>
                        <View 
                          style={[
                            styles.progressFill,
                            {
                              width: `${Math.min(100, Math.max(0, 
                                alert.type === 'above' 
                                  ? (alert.currentPrice / alert.targetPrice) * 100
                                  : (alert.targetPrice / alert.currentPrice) * 100
                              ))}%`,
                              backgroundColor: alert.type === 'above' ? colors.success : colors.error,
                            }
                          ]}
                        />
                      </View>
                      <Text style={styles.progressText}>
                        {alert.type === 'above' 
                          ? `$${(alert.targetPrice - alert.currentPrice).toFixed(2)} to go`
                          : `$${(alert.currentPrice - alert.targetPrice).toFixed(2)} above target`
                        }
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.alertFooter}>
                  <Text style={styles.createdDate}>Created {alert.createdAt}</Text>
                  <TouchableOpacity 
                    style={[
                      styles.statusButton,
                      { backgroundColor: alert.isActive ? colors.success : colors.secondaryText }
                    ]}
                    onPress={() => toggleAlert(alert.id)}
                  >
                    <Bell size={12} color="white" />
                    <Text style={styles.statusText}>
                      {alert.isActive ? 'Active' : 'Paused'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          {alerts.length === 0 && (
            <View style={styles.emptyState}>
              <Bell size={48} color={colors.secondaryText} />
              <Text style={styles.emptyTitle}>No price alerts yet</Text>
              <Text style={styles.emptySubtitle}>
                Create alerts to get notified when stocks reach your target prices
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Add Alert Modal */}
        <Modal
          visible={showAddModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowAddModal(false)}
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Price Alert</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <X size={24} color="#1A1A1A" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalContent}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Stock Symbol</Text>
                <TextInput
                  style={styles.input}
                  value={newAlert.symbol}
                  onChangeText={(text) => setNewAlert({...newAlert, symbol: text})}
                  placeholder="e.g., AAPL"
                  autoCapitalize="characters"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Target Price</Text>
                <TextInput
                  style={styles.input}
                  value={newAlert.targetPrice}
                  onChangeText={(text) => setNewAlert({...newAlert, targetPrice: text})}
                  placeholder="0.00"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Alert Type</Text>
                <View style={styles.typeSelector}>
                  <TouchableOpacity
                    style={[
                      styles.typeButton,
                      newAlert.type === 'above' && styles.activeType
                    ]}
                    onPress={() => setNewAlert({...newAlert, type: 'above'})}
                  >
                    <TrendingUp size={16} color={newAlert.type === 'above' ? 'white' : colors.secondaryText} />
                    <Text style={[
                      styles.typeText,
                      newAlert.type === 'above' && styles.activeTypeText
                    ]}>Above</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.typeButton,
                      newAlert.type === 'below' && styles.activeType
                    ]}
                    onPress={() => setNewAlert({...newAlert, type: 'below'})}
                  >
                    <TrendingDown size={16} color={newAlert.type === 'below' ? 'white' : colors.secondaryText} />
                    <Text style={[
                      styles.typeText,
                      newAlert.type === 'below' && styles.activeTypeText
                    ]}>Below</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity style={styles.createButton} onPress={handleAddAlert}>
                <Text style={styles.createButtonText}>Create Alert</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    marginVertical: 20,
    gap: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  alertsList: {
    gap: 16,
  },
  alertCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 16,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stockInfo: {
    flex: 1,
  },
  symbol: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  stockName: {
    fontSize: 14,
    color: colors.secondaryText,
  },
  deleteButton: {
    padding: 4,
  },
  alertDetails: {
    gap: 16,
    marginBottom: 16,
  },
  priceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: colors.secondaryText,
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  targetInfo: {
    gap: 8,
  },
  targetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  progressContainer: {
    gap: 6,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E5EA',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: colors.secondaryText,
  },
  alertFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  createdDate: {
    fontSize: 12,
    color: colors.secondaryText,
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 4,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  activeType: {
    backgroundColor: colors.primary,
  },
  typeText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.secondaryText,
  },
  activeTypeText: {
    color: 'white',
  },
  createButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});