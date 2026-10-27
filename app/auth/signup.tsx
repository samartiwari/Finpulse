import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import colors from '@/constants/colors';
import { useUserStore } from '@/store/userStore';
import { useForm } from '@/hooks/useForm';
import { signupSchema, SignupFormData } from '@/validation/schemas';
import FormInput from '@/components/common/FormInput';
import Button from '@/components/common/Button';
import { showSuccessToast, showErrorToast } from '@/utils/toast';
import { TOAST_MESSAGES } from '@/utils/toast';

export default function SignupScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const signup = useUserStore(state => state.signup);

  const form = useForm<SignupFormData>({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: signupSchema,
    onSubmit: async (values) => {
      try {
        const success = await signup(values.name, values.email, values.password);
        if (success) {
          showSuccessToast(TOAST_MESSAGES.SIGNUP_SUCCESS);
          router.replace('/(tabs)');
        } else {
          showErrorToast(TOAST_MESSAGES.SIGNUP_ERROR);
        }
      } catch (error) {
        showErrorToast(TOAST_MESSAGES.SIGNUP_ERROR);
      }
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Sign up to get started</Text>
            </View>

            <View style={styles.form}>
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

              <Button
                title="Create Account"
                onPress={form.handleSubmit}
                loading={form.isSubmitting}
                disabled={form.isSubmitting}
                style={styles.signupButton}
              />

              <View style={styles.footer}>
                <Text style={styles.footerText}>Already have an account? </Text>
                <Button
                  title="Sign In"
                  onPress={() => router.push('/auth/login')}
                  variant="ghost"
                  size="small"
                />
              </View>
            </View>
          </View>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.secondaryText,
  },
  form: {
    gap: 24,
  },
  signupButton: {
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