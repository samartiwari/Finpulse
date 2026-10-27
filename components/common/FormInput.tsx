import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import colors from '@/constants/colors';

interface FormInputProps extends TextInputProps {
  label: string;
  error?: string;
  touched?: boolean;
  isPassword?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  required?: boolean;
  containerStyle?: any;
  inputStyle?: any;
  labelStyle?: any;
  errorStyle?: any;
}

export default function FormInput({
  label,
  error,
  touched,
  isPassword = false,
  showPassword = false,
  onTogglePassword,
  required = false,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  ...textInputProps
}: FormInputProps) {
  const hasError = touched && error;

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.label, labelStyle]}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      
      <View style={[
        styles.inputContainer,
        hasError && styles.inputContainerError,
      ]}>
        <TextInput
          style={[
            styles.input,
            isPassword && styles.passwordInput,
            inputStyle,
          ]}
          secureTextEntry={isPassword && !showPassword}
          placeholderTextColor={colors.secondaryText}
          {...textInputProps}
        />
        
        {isPassword && (
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={onTogglePassword}
          >
            {showPassword ? (
              <EyeOff size={20} color={colors.secondaryText} />
            ) : (
              <Eye size={20} color={colors.secondaryText} />
            )}
          </TouchableOpacity>
        )}
      </View>
      
      {hasError && (
        <Text style={[styles.errorText, errorStyle]}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  required: {
    color: colors.error,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputContainerError: {
    borderColor: colors.error,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: colors.text,
  },
  passwordInput: {
    paddingRight: 8,
  },
  eyeButton: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
    marginTop: 4,
  },
});