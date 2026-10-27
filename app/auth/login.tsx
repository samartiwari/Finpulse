import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import colors from '@/constants/colors';
import { useUserStore } from '@/store/userStore';
import { useForm } from '@/hooks/useForm';
import { loginSchema, LoginFormData } from '@/validation/schemas';
import FormInput from '@/components/common/FormInput';
import Button from '@/components/common/Button';
import { showSuccessToast, showErrorToast } from '@/utils/toast';
import { TOAST_MESSAGES } from '@/utils/toast';

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const login = useUserStore(state => state.login);

  const form = useForm<LoginFormData>({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        const success = await login(values.email, values.password);
        if (success) {
          showSuccessToast(TOAST_MESSAGES.LOGIN_SUCCESS);
          router.replace('/(tabs)');
        } else {
          showErrorToast(TOAST_MESSAGES.LOGIN_ERROR);
        }
      } catch (error) {
        showErrorToast(TOAST_MESSAGES.LOGIN_ERROR);
      }
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to your account</Text>
          </View>

          <View style={styles.form}>
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

            <Button
              title="Sign In"
              onPress={form.handleSubmit}
              loading={form.isSubmitting}
              disabled={form.isSubmitting}
              style={styles.loginButton}
            />

            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <Button
                title="Sign Up"
                onPress={() => router.push('/auth/signup')}
                variant="ghost"
                size="small"
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.secondaryText,
  },
  form: {
    gap: 24,
  },
  loginButton: {
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    color: colors.secondaryText,
    marginRight: 8,
  },
});