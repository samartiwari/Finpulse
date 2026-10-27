import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView,
  Modal,
  TextInput,
  Alert 
} from 'react-native';
import { Stack } from 'expo-router';
import { CreditCard, Plus, Trash2, Shield, X, Check } from 'lucide-react-native';
import colors from '@/constants/colors';

interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard' | 'amex' | 'discover';
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
  holderName: string;
}

export default function PaymentMethodsScreen() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'visa',
      last4: '1234',
      expiryMonth: '12',
      expiryYear: '25',
      isDefault: true,
      holderName: 'John Doe',
    },
    {
      id: '2',
      type: 'mastercard',
      last4: '5678',
      expiryMonth: '08',
      expiryYear: '26',
      isDefault: false,
      holderName: 'John Doe',
    },
  ]);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCard, setNewCard] = useState({
    number: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    holderName: '',
  });

  const getCardIcon = (type: string) => {
    const iconColor = type === 'visa' ? '#1A1F71' : 
                     type === 'mastercard' ? '#EB001B' :
                     type === 'amex' ? '#006FCF' : colors.primary;
    return <CreditCard size={24} color={iconColor} />;
  };

  const getCardType = (number: string): 'visa' | 'mastercard' | 'amex' | 'discover' => {
    const num = number.replace(/\s/g, '');
    if (num.startsWith('4')) return 'visa';
    if (num.startsWith('5') || num.startsWith('2')) return 'mastercard';
    if (num.startsWith('3')) return 'amex';
    return 'visa';
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    const matches = cleaned.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return text;
    }
  };

  const handleAddCard = () => {
    if (!newCard.number || !newCard.expiryMonth || !newCard.expiryYear || !newCard.cvv || !newCard.holderName) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const cardType = getCardType(newCard.number);
    const last4 = newCard.number.replace(/\s/g, '').slice(-4);
    
    const newPaymentMethod: PaymentMethod = {
      id: Date.now().toString(),
      type: cardType,
      last4,
      expiryMonth: newCard.expiryMonth,
      expiryYear: newCard.expiryYear,
      isDefault: paymentMethods.length === 0,
      holderName: newCard.holderName,
    };

    setPaymentMethods([...paymentMethods, newPaymentMethod]);
    setNewCard({ number: '', expiryMonth: '', expiryYear: '', cvv: '', holderName: '' });
    setShowAddModal(false);
    Alert.alert('Success', 'Payment method added successfully');
  };

  const handleDeleteCard = (id: string) => {
    Alert.alert(
      'Delete Payment Method',
      'Are you sure you want to delete this payment method?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setPaymentMethods(paymentMethods.filter(method => method.id !== id));
          }
        },
      ]
    );
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id
    })));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Payment Methods' }} />
      
      <ScrollView style={styles.content}>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Plus size={20} color="white" />
          <Text style={styles.addButtonText}>Add Payment Method</Text>
        </TouchableOpacity>

        {paymentMethods.map((method) => (
          <View key={method.id} style={styles.paymentCard}>
            <View style={styles.cardHeader}>
              <View style={styles.cardInfo}>
                {getCardIcon(method.type)}
                <View style={styles.cardDetails}>
                  <Text style={styles.cardNumber}>
                    •••• •••• •••• {method.last4}
                  </Text>
                  <Text style={styles.cardExpiry}>
                    Expires {method.expiryMonth}/{method.expiryYear}
                  </Text>
                  <Text style={styles.cardHolder}>{method.holderName}</Text>
                </View>
              </View>
              
              {method.isDefault && (
                <View style={styles.defaultBadge}>
                  <Check size={12} color="white" />
                  <Text style={styles.defaultText}>Default</Text>
                </View>
              )}
            </View>
            
            <View style={styles.cardActions}>
              {!method.isDefault && (
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleSetDefault(method.id)}
                >
                  <Text style={styles.actionButtonText}>Set as Default</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => handleDeleteCard(method.id)}
              >
                <Trash2 size={16} color="#FF3B30" />
                <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        
        {/* Security Info */}
        <View style={styles.securityInfo}>
          <Shield size={20} color={colors.success} />
          <View style={styles.securityText}>
            <Text style={styles.securityTitle}>Your payment information is secure</Text>
            <Text style={styles.securityDescription}>
              We use bank-level encryption to protect your financial data
            </Text>
          </View>
        </View>
      </ScrollView>
      
      {/* Add Card Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Payment Method</Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <X size={24} color="#1A1A1A" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Card Number</Text>
              <TextInput
                style={styles.input}
                value={newCard.number}
                onChangeText={(text) => setNewCard({...newCard, number: formatCardNumber(text)})}
                placeholder="1234 5678 9012 3456"
                keyboardType="numeric"
                maxLength={19}
              />
            </View>
            
            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.inputLabel}>Expiry Month</Text>
                <TextInput
                  style={styles.input}
                  value={newCard.expiryMonth}
                  onChangeText={(text) => setNewCard({...newCard, expiryMonth: text})}
                  placeholder="MM"
                  keyboardType="numeric"
                  maxLength={2}
                />
              </View>
              
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8, marginRight: 8 }]}>
                <Text style={styles.inputLabel}>Expiry Year</Text>
                <TextInput
                  style={styles.input}
                  value={newCard.expiryYear}
                  onChangeText={(text) => setNewCard({...newCard, expiryYear: text})}
                  placeholder="YY"
                  keyboardType="numeric"
                  maxLength={2}
                />
              </View>
              
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.inputLabel}>CVV</Text>
                <TextInput
                  style={styles.input}
                  value={newCard.cvv}
                  onChangeText={(text) => setNewCard({...newCard, cvv: text})}
                  placeholder="123"
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                />
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Cardholder Name</Text>
              <TextInput
                style={styles.input}
                value={newCard.holderName}
                onChangeText={(text) => setNewCard({...newCard, holderName: text})}
                placeholder="John Doe"
                autoCapitalize="words"
              />
            </View>
            
            <TouchableOpacity style={styles.addCardButton} onPress={handleAddCard}>
              <Text style={styles.addCardButtonText}>Add Card</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
  paymentCard: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardDetails: {
    marginLeft: 16,
    flex: 1,
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  cardExpiry: {
    fontSize: 12,
    color: colors.secondaryText,
    marginBottom: 2,
  },
  cardHolder: {
    fontSize: 12,
    color: colors.secondaryText,
    fontWeight: '500',
  },
  defaultBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  defaultText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    gap: 6,
  },
  deleteButton: {
    backgroundColor: '#FFF5F5',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
  deleteButtonText: {
    color: '#FF3B30',
  },
  securityInfo: {
    flexDirection: 'row',
    backgroundColor: '#F0F9FF',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    gap: 12,
  },
  securityText: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  securityDescription: {
    fontSize: 12,
    color: colors.secondaryText,
    lineHeight: 16,
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
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
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
  addCardButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  addCardButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});