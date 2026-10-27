import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
} from 'react-native';
import { Stack } from 'expo-router';
import {
  Calculator,
  DollarSign,
  Percent,
  TrendingUp,
  TrendingDown,
  Target,
  Shield,
} from 'lucide-react-native';
import colors from '@/constants/colors';

type CalculatorType = 'position' | 'profit' | 'risk' | 'compound';

export default function TradingCalculatorScreen() {
  const [activeCalculator, setActiveCalculator] = useState<CalculatorType>('position');
  
  // Position Size Calculator
  const [accountBalance, setAccountBalance] = useState('');
  const [riskPercentage, setRiskPercentage] = useState('2');
  const [entryPrice, setEntryPrice] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  
  // Profit/Loss Calculator
  const [buyPrice, setBuyPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [shares, setShares] = useState('');
  const [commission, setCommission] = useState('0');
  
  // Risk/Reward Calculator
  const [currentPrice, setCurrentPrice] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [stopLossPrice, setStopLossPrice] = useState('');
  
  // Compound Interest Calculator
  const [initialAmount, setInitialAmount] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [annualReturn, setAnnualReturn] = useState('');
  const [years, setYears] = useState('');

  const calculators = [
    { id: 'position', name: 'Position Size', icon: <Calculator size={20} color={colors.primary} /> },
    { id: 'profit', name: 'Profit/Loss', icon: <DollarSign size={20} color={colors.green} /> },
    { id: 'risk', name: 'Risk/Reward', icon: <Shield size={20} color={colors.orange} /> },
    { id: 'compound', name: 'Compound', icon: <TrendingUp size={20} color={colors.blue} /> },
  ];

  const calculatePositionSize = () => {
    const balance = parseFloat(accountBalance);
    const risk = parseFloat(riskPercentage) / 100;
    const entry = parseFloat(entryPrice);
    const stop = parseFloat(stopLoss);
    
    if (!balance || !risk || !entry || !stop) return null;
    
    const riskAmount = balance * risk;
    const riskPerShare = Math.abs(entry - stop);
    const positionSize = Math.floor(riskAmount / riskPerShare);
    const totalCost = positionSize * entry;
    
    return {
      positionSize,
      totalCost,
      riskAmount,
      riskPerShare,
    };
  };

  const calculateProfitLoss = () => {
    const buy = parseFloat(buyPrice);
    const sell = parseFloat(sellPrice);
    const quantity = parseFloat(shares);
    const fees = parseFloat(commission) * 2; // Buy and sell commission
    
    if (!buy || !sell || !quantity) return null;
    
    const grossProfit = (sell - buy) * quantity;
    const netProfit = grossProfit - fees;
    const profitPercent = (netProfit / (buy * quantity)) * 100;
    
    return {
      grossProfit,
      netProfit,
      profitPercent,
      totalCost: buy * quantity,
      totalRevenue: sell * quantity,
    };
  };

  const calculateRiskReward = () => {
    const current = parseFloat(currentPrice);
    const target = parseFloat(targetPrice);
    const stop = parseFloat(stopLossPrice);
    
    if (!current || !target || !stop) return null;
    
    const potentialReward = Math.abs(target - current);
    const potentialRisk = Math.abs(current - stop);
    const riskRewardRatio = potentialReward / potentialRisk;
    
    return {
      potentialReward,
      potentialRisk,
      riskRewardRatio,
      rewardPercent: (potentialReward / current) * 100,
      riskPercent: (potentialRisk / current) * 100,
    };
  };

  const calculateCompoundInterest = () => {
    const initial = parseFloat(initialAmount);
    const monthly = parseFloat(monthlyContribution);
    const rate = parseFloat(annualReturn) / 100;
    const time = parseFloat(years);
    
    if (!initial || !rate || !time) return null;
    
    const monthlyRate = rate / 12;
    const months = time * 12;
    
    // Future value of initial investment
    const futureValueInitial = initial * Math.pow(1 + rate, time);
    
    // Future value of monthly contributions
    const futureValueMonthly = monthly * 
      (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
    
    const totalFutureValue = futureValueInitial + futureValueMonthly;
    const totalContributions = initial + (monthly * months);
    const totalInterest = totalFutureValue - totalContributions;
    
    return {
      totalFutureValue,
      totalContributions,
      totalInterest,
      interestPercent: (totalInterest / totalContributions) * 100,
    };
  };

  const renderPositionCalculator = () => {
    const result = calculatePositionSize();
    
    return (
      <View style={styles.calculatorContent}>
        <Text style={styles.calculatorTitle}>Position Size Calculator</Text>
        <Text style={styles.calculatorDescription}>
          Calculate the optimal position size based on your risk tolerance
        </Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Account Balance ($)</Text>
          <TextInput
            style={styles.input}
            value={accountBalance}
            onChangeText={setAccountBalance}
            placeholder="10000"
            keyboardType="numeric"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Risk Percentage (%)</Text>
          <TextInput
            style={styles.input}
            value={riskPercentage}
            onChangeText={setRiskPercentage}
            placeholder="2"
            keyboardType="numeric"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Entry Price ($)</Text>
          <TextInput
            style={styles.input}
            value={entryPrice}
            onChangeText={setEntryPrice}
            placeholder="150.00"
            keyboardType="numeric"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Stop Loss ($)</Text>
          <TextInput
            style={styles.input}
            value={stopLoss}
            onChangeText={setStopLoss}
            placeholder="145.00"
            keyboardType="numeric"
          />
        </View>
        
        {result && (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>Calculation Results</Text>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Position Size:</Text>
              <Text style={styles.resultValue}>{result.positionSize} shares</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Total Cost:</Text>
              <Text style={styles.resultValue}>${result.totalCost.toFixed(2)}</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Risk Amount:</Text>
              <Text style={[styles.resultValue, { color: colors.red }]}>
                ${result.riskAmount.toFixed(2)}
              </Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Risk Per Share:</Text>
              <Text style={styles.resultValue}>${result.riskPerShare.toFixed(2)}</Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderProfitCalculator = () => {
    const result = calculateProfitLoss();
    
    return (
      <View style={styles.calculatorContent}>
        <Text style={styles.calculatorTitle}>Profit/Loss Calculator</Text>
        <Text style={styles.calculatorDescription}>
          Calculate your profit or loss from a trade
        </Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Buy Price ($)</Text>
          <TextInput
            style={styles.input}
            value={buyPrice}
            onChangeText={setBuyPrice}
            placeholder="150.00"
            keyboardType="numeric"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Sell Price ($)</Text>
          <TextInput
            style={styles.input}
            value={sellPrice}
            onChangeText={setSellPrice}
            placeholder="155.00"
            keyboardType="numeric"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Number of Shares</Text>
          <TextInput
            style={styles.input}
            value={shares}
            onChangeText={setShares}
            placeholder="100"
            keyboardType="numeric"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Commission per Trade ($)</Text>
          <TextInput
            style={styles.input}
            value={commission}
            onChangeText={setCommission}
            placeholder="0"
            keyboardType="numeric"
          />
        </View>
        
        {result && (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>Calculation Results</Text>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Gross Profit:</Text>
              <Text style={[
                styles.resultValue,
                { color: result.grossProfit >= 0 ? colors.green : colors.red }
              ]}>
                ${result.grossProfit.toFixed(2)}
              </Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Net Profit:</Text>
              <Text style={[
                styles.resultValue,
                { color: result.netProfit >= 0 ? colors.green : colors.red }
              ]}>
                ${result.netProfit.toFixed(2)}
              </Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Return:</Text>
              <Text style={[
                styles.resultValue,
                { color: result.profitPercent >= 0 ? colors.green : colors.red }
              ]}>
                {result.profitPercent.toFixed(2)}%
              </Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Total Cost:</Text>
              <Text style={styles.resultValue}>${result.totalCost.toFixed(2)}</Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderRiskCalculator = () => {
    const result = calculateRiskReward();
    
    return (
      <View style={styles.calculatorContent}>
        <Text style={styles.calculatorTitle}>Risk/Reward Calculator</Text>
        <Text style={styles.calculatorDescription}>
          Analyze the risk-to-reward ratio of your trade
        </Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Current Price ($)</Text>
          <TextInput
            style={styles.input}
            value={currentPrice}
            onChangeText={setCurrentPrice}
            placeholder="150.00"
            keyboardType="numeric"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Target Price ($)</Text>
          <TextInput
            style={styles.input}
            value={targetPrice}
            onChangeText={setTargetPrice}
            placeholder="160.00"
            keyboardType="numeric"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Stop Loss Price ($)</Text>
          <TextInput
            style={styles.input}
            value={stopLossPrice}
            onChangeText={setStopLossPrice}
            placeholder="145.00"
            keyboardType="numeric"
          />
        </View>
        
        {result && (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>Calculation Results</Text>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Potential Reward:</Text>
              <Text style={[styles.resultValue, { color: colors.green }]}>
                ${result.potentialReward.toFixed(2)} ({result.rewardPercent.toFixed(2)}%)
              </Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Potential Risk:</Text>
              <Text style={[styles.resultValue, { color: colors.red }]}>
                ${result.potentialRisk.toFixed(2)} ({result.riskPercent.toFixed(2)}%)
              </Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Risk/Reward Ratio:</Text>
              <Text style={[
                styles.resultValue,
                { color: result.riskRewardRatio >= 2 ? colors.green : colors.orange }
              ]}>
                1:{result.riskRewardRatio.toFixed(2)}
              </Text>
            </View>
            <View style={styles.recommendationCard}>
              <Text style={styles.recommendationTitle}>Recommendation</Text>
              <Text style={[
                styles.recommendationText,
                { color: result.riskRewardRatio >= 2 ? colors.green : colors.red }
              ]}>
                {result.riskRewardRatio >= 2 
                  ? 'Good risk/reward ratio. Consider this trade.' 
                  : 'Poor risk/reward ratio. Consider adjusting targets.'}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderCompoundCalculator = () => {
    const result = calculateCompoundInterest();
    
    return (
      <View style={styles.calculatorContent}>
        <Text style={styles.calculatorTitle}>Compound Interest Calculator</Text>
        <Text style={styles.calculatorDescription}>
          See how your investments can grow over time
        </Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Initial Investment ($)</Text>
          <TextInput
            style={styles.input}
            value={initialAmount}
            onChangeText={setInitialAmount}
            placeholder="10000"
            keyboardType="numeric"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Monthly Contribution ($)</Text>
          <TextInput
            style={styles.input}
            value={monthlyContribution}
            onChangeText={setMonthlyContribution}
            placeholder="500"
            keyboardType="numeric"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Annual Return (%)</Text>
          <TextInput
            style={styles.input}
            value={annualReturn}
            onChangeText={setAnnualReturn}
            placeholder="8"
            keyboardType="numeric"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Time Period (Years)</Text>
          <TextInput
            style={styles.input}
            value={years}
            onChangeText={setYears}
            placeholder="10"
            keyboardType="numeric"
          />
        </View>
        
        {result && (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>Calculation Results</Text>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Future Value:</Text>
              <Text style={[styles.resultValue, { color: colors.green, fontSize: 18, fontWeight: '700' }]}>
                ${result.totalFutureValue.toFixed(2)}
              </Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Total Contributions:</Text>
              <Text style={styles.resultValue}>${result.totalContributions.toFixed(2)}</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Interest Earned:</Text>
              <Text style={[styles.resultValue, { color: colors.green }]}>
                ${result.totalInterest.toFixed(2)}
              </Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Total Return:</Text>
              <Text style={[styles.resultValue, { color: colors.green }]}>
                {result.interestPercent.toFixed(2)}%
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderCalculatorContent = () => {
    switch (activeCalculator) {
      case 'position':
        return renderPositionCalculator();
      case 'profit':
        return renderProfitCalculator();
      case 'risk':
        return renderRiskCalculator();
      case 'compound':
        return renderCompoundCalculator();
      default:
        return renderPositionCalculator();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Trading Calculator',
          headerStyle: { backgroundColor: colors.background },
          headerTitleStyle: { color: colors.text, fontWeight: '600' },
        }} 
      />
      
      {/* Calculator Type Selector */}
      <View style={styles.selectorContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {calculators.map((calc) => (
            <TouchableOpacity
              key={calc.id}
              style={[
                styles.selectorButton,
                activeCalculator === calc.id && styles.activeSelectorButton
              ]}
              onPress={() => setActiveCalculator(calc.id as CalculatorType)}
            >
              {calc.icon}
              <Text style={[
                styles.selectorText,
                activeCalculator === calc.id && styles.activeSelectorText
              ]}>
                {calc.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderCalculatorContent()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  selectorContainer: {
    backgroundColor: 'white',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    gap: 6,
  },
  activeSelectorButton: {
    backgroundColor: colors.card,
  },
  selectorText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.secondaryText,
  },
  activeSelectorText: {
    color: colors.primary,
  },
  content: {
    flex: 1,
  },
  calculatorContent: {
    padding: 16,
  },
  calculatorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  calculatorDescription: {
    fontSize: 14,
    color: colors.secondaryText,
    marginBottom: 24,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resultCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  resultLabel: {
    fontSize: 14,
    color: colors.secondaryText,
  },
  resultValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  recommendationCard: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  recommendationText: {
    fontSize: 12,
    fontWeight: '500',
  },
});