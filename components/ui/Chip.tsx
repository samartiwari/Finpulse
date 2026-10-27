import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { X } from 'lucide-react-native';
import colors from '@/constants/colors';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  onRemove?: () => void;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  icon?: React.ReactNode;
}

export default function Chip({
  label,
  selected = false,
  onPress,
  onRemove,
  variant = 'default',
  size = 'medium',
  disabled = false,
  style,
  labelStyle,
  icon,
}: ChipProps) {
  const chipStyle = [
    styles.chip,
    styles[variant],
    styles[size],
    selected && styles.selected,
    selected && styles[`${variant}Selected`],
    disabled && styles.disabled,
    style,
  ];

  const textStyle = [
    styles.label,
    styles[`${variant}Label`],
    styles[`${size}Label`],
    selected && styles.selectedLabel,
    selected && styles[`${variant}SelectedLabel`],
    disabled && styles.disabledLabel,
    labelStyle,
  ];

  return (
    <TouchableOpacity
      style={chipStyle}
      onPress={onPress}
      disabled={disabled || !onPress}
      activeOpacity={0.7}
    >
      {icon && <>{icon}</>}
      
      <Text style={textStyle}>{label}</Text>
      
      {onRemove && (
        <TouchableOpacity
          onPress={onRemove}
          style={styles.removeButton}
          hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
        >
          <X size={14} color={selected ? 'white' : colors.secondaryText} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
  },
  
  // Variants
  default: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  primary: {
    backgroundColor: colors.primary + '20',
    borderColor: colors.primary + '40',
  },
  success: {
    backgroundColor: colors.success + '20',
    borderColor: colors.success + '40',
  },
  warning: {
    backgroundColor: colors.warning + '20',
    borderColor: colors.warning + '40',
  },
  error: {
    backgroundColor: colors.error + '20',
    borderColor: colors.error + '40',
  },
  
  // Selected variants
  selected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  primarySelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  successSelected: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  warningSelected: {
    backgroundColor: colors.warning,
    borderColor: colors.warning,
  },
  errorSelected: {
    backgroundColor: colors.error,
    borderColor: colors.error,
  },
  
  // Sizes
  small: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    minHeight: 24,
  },
  medium: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: 32,
  },
  large: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 40,
  },
  
  // Label styles
  label: {
    fontWeight: '500',
  },
  defaultLabel: {
    color: colors.text,
  },
  primaryLabel: {
    color: colors.primary,
  },
  successLabel: {
    color: colors.success,
  },
  warningLabel: {
    color: colors.warning,
  },
  errorLabel: {
    color: colors.error,
  },
  
  // Selected label styles
  selectedLabel: {
    color: 'white',
  },
  primarySelectedLabel: {
    color: 'white',
  },
  successSelectedLabel: {
    color: 'white',
  },
  warningSelectedLabel: {
    color: 'white',
  },
  errorSelectedLabel: {
    color: 'white',
  },
  
  // Size label styles
  smallLabel: {
    fontSize: 12,
  },
  mediumLabel: {
    fontSize: 14,
  },
  largeLabel: {
    fontSize: 16,
  },
  
  // Disabled styles
  disabled: {
    opacity: 0.5,
  },
  disabledLabel: {
    color: colors.secondaryText,
  },
  
  removeButton: {
    padding: 2,
  },
});