import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Search, X } from 'lucide-react-native';
import colors from '@/constants/colors';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onSubmit?: (text: string) => void;
  onClear?: () => void;
  autoFocus?: boolean;
  style?: any;
}

export default function SearchBar({
  placeholder = 'Search...',
  value: controlledValue,
  onChangeText,
  onSubmit,
  onClear,
  autoFocus = false,
  style,
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState('');
  
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  
  const handleChangeText = (text: string) => {
    if (controlledValue === undefined) {
      setInternalValue(text);
    }
    onChangeText?.(text);
  };

  const handleClear = () => {
    if (controlledValue === undefined) {
      setInternalValue('');
    }
    onClear?.();
  };

  const handleSubmit = () => {
    onSubmit?.(value);
  };

  return (
    <View style={[styles.container, style]}>
      <Search size={20} color={colors.secondaryText} style={styles.searchIcon} />
      
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.secondaryText}
        value={value}
        onChangeText={handleChangeText}
        onSubmitEditing={handleSubmit}
        autoFocus={autoFocus}
        returnKeyType="search"
      />
      
      {value.length > 0 && (
        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
          <X size={20} color={colors.secondaryText} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 4,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
});