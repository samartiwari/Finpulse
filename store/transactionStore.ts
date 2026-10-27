import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Transaction {
  id: string;
  type: 'buy' | 'sell';
  symbol: string;
  name: string;
  date: string;
  time: string;
  amount: number;
  shares: number;
  price: number;
  status: 'completed' | 'pending' | 'failed';
  orderId: string;
  fees: number;
}

interface TransactionState {
  transactions: Transaction[];
  filteredTransactions: Transaction[];
  activeFilter: 'all' | 'buy' | 'sell';
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date' | 'time' | 'orderId'>) => void;
  setFilter: (filter: 'all' | 'buy' | 'sell') => void;
  getTransactionById: (id: string) => Transaction | undefined;
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'buy',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    date: '2024-01-15',
    time: '10:30 AM',
    amount: 1250.75,
    shares: 5,
    price: 250.15,
    status: 'completed',
    orderId: 'ORD-001',
    fees: 2.50,
  },
  {
    id: '2',
    type: 'sell',
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    date: '2024-01-14',
    time: '3:45 PM',
    amount: 980.25,
    shares: 3,
    price: 326.75,
    status: 'completed',
    orderId: 'ORD-002',
    fees: 1.95,
  },
  {
    id: '3',
    type: 'buy',
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    date: '2024-01-12',
    time: '11:15 AM',
    amount: 2150.50,
    shares: 1,
    price: 2150.50,
    status: 'completed',
    orderId: 'ORD-003',
    fees: 4.30,
  },
  {
    id: '4',
    type: 'buy',
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    date: '2024-01-10',
    time: '9:20 AM',
    amount: 3300.00,
    shares: 2,
    price: 1650.00,
    status: 'completed',
    orderId: 'ORD-004',
    fees: 6.60,
  },
  {
    id: '5',
    type: 'sell',
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    date: '2024-01-08',
    time: '2:10 PM',
    amount: 1800.75,
    shares: 3,
    price: 600.25,
    status: 'completed',
    orderId: 'ORD-005',
    fees: 3.60,
  },
];

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set, get) => ({
      transactions: mockTransactions,
      filteredTransactions: mockTransactions,
      activeFilter: 'all',
      
      addTransaction: (transactionData) => {
        const newTransaction: Transaction = {
          ...transactionData,
          id: Date.now().toString(),
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
          }),
          orderId: `ORD-${Date.now()}`,
        };
        
        const updatedTransactions = [newTransaction, ...get().transactions];
        const { activeFilter } = get();
        
        set({
          transactions: updatedTransactions,
          filteredTransactions: activeFilter === 'all' 
            ? updatedTransactions 
            : updatedTransactions.filter(t => t.type === activeFilter)
        });
      },
      
      setFilter: (filter) => {
        const { transactions } = get();
        const filteredTransactions = filter === 'all' 
          ? transactions 
          : transactions.filter(t => t.type === filter);
        
        set({ 
          activeFilter: filter, 
          filteredTransactions 
        });
      },
      
      getTransactionById: (id) => {
        return get().transactions.find(t => t.id === id);
      },
    }),
    {
      name: 'transaction-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);