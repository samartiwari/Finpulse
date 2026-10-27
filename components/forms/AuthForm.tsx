import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useForm } from '@/hooks/useForm';
import { loginSchema, signupSchema, LoginFormData, SignupFormData } from '@/validation/schemas';
import FormInput from '@/components/common/FormInput';
import Button from '@/components/common/Button';
import colors from '@/constants/colors';

interface AuthFormProps {
  type: 'login' | 'signup';
  onSubmit: (data: LoginFormData | SignupFormData) => Promise<void>;
  loading?: boolean;
}

export default function AuthForm({ type, onSubmit, loading = false }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isSignup = type === 'signup';
  
  const form = useForm({
    initialValues: isSignup 
      ? { name: '', email: '', password: '', confirmPassword: '' }
      : { email: '', password: '' },
    validationSchema: isSignup ? signupSchema : loginSchema,
    onSubmit,
  });

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>
            {isSignup ? 'Create Account' : 'Welcome Back'}
          </Text>
          <Text style={styles.subtitle}>
            {isSignup ? 'Sign up to get started' : 'Sign in to your account'}
          </Text>
        </View>

        <View style={styles.form}>
          {isSignup && (
            <FormInput
              label="Full Name"
              value={form.values.name}
              onChangeText={(text) => form.setValue('name', text)}
              onBlur={() => form.setFieldTouched('name')}
              placeholder="Enter your full name"
              autoCapitalize="words"
              autoCorrect={false}
              error={form.errors.name}
              touched={form.touched.name}
              required
            />
          )}

          <FormInput
            label="Email"
            value={form.values.email}
            onChangeText={(text) => form.setValue('email', text)}
            onBlur={() => form.setFieldTouched('email')}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            error={form.errors.email}
            touched={form.touched.email}
            required
          />

          <FormInput
            label="Password"
            value={form.values.password}
            onChangeText={(text) => form.setValue('password', text)}
            onBlur={() => form.setFieldTouched('password')}
            placeholder="Enter your password"
            isPassword
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            error={form.errors.password}
            touched={form.touched.password}
            required
          />

          {isSignup && (
            <FormInput
              label="Confirm Password"
              value={form.values.confirmPassword}
              onChangeText={(text) => form.setValue('confirmPassword', text)}
              onBlur={() => form.setFieldTouched('confirmPassword')}
              placeholder="Confirm your password"
              isPassword
              showPassword={showConfirmPassword}
              onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
              error={form.errors.confirmPassword}
              touched={form.touched.confirmPassword}
              required
            />
          )}

          <Button
            title={isSignup ? 'Create Account' : 'Sign In'}
            onPress={form.handleSubmit}
            loading={form.isSubmitting || loading}
            disabled={form.isSubmitting || loading}
            style={styles.submitButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.secondaryText,
  },
  form: {
    gap: 24,
  },
  submitButton: {
    marginTop: 8,
  },
});