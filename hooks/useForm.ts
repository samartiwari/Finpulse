import { useState, useCallback } from 'react';
import * as yup from 'yup';

interface UseFormOptions<T, TOutput> {
  /** Raw field values, typically strings straight from text inputs. */
  initialValues: T;
  /** Validates and casts the raw values; onSubmit receives the cast result. */
  validationSchema: yup.Schema<TOutput>;
  onSubmit: (values: TOutput) => Promise<void> | void;
}

interface UseFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
  setValue: (field: keyof T, value: any) => void;
  setFieldTouched: (field: keyof T, touched?: boolean) => void;
  setFieldError: (field: keyof T, error: string) => void;
  validateField: (field: keyof T) => Promise<boolean>;
  validateForm: () => Promise<boolean>;
  handleSubmit: () => Promise<void>;
  resetForm: () => void;
  setValues: (values: Partial<T>) => void;
}

export function useForm<T extends Record<string, any>, TOutput = T>({
  initialValues,
  validationSchema,
  onSubmit,
}: UseFormOptions<T, TOutput>): UseFormReturn<T> {
  const [values, setValuesState] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = useCallback((field: keyof T, value: any) => {
    setValuesState(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const setValues = useCallback((newValues: Partial<T>) => {
    setValuesState(prev => ({ ...prev, ...newValues }));
  }, []);

  const setFieldTouched = useCallback((field: keyof T, isTouched = true) => {
    setTouched(prev => ({ ...prev, [field]: isTouched }));
  }, []);

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  const validateField = useCallback(async (field: keyof T): Promise<boolean> => {
    try {
      await validationSchema.validateAt(field as string, values);
      setErrors(prev => ({ ...prev, [field]: undefined }));
      return true;
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        setErrors(prev => ({ ...prev, [field]: error.message }));
      }
      return false;
    }
  }, [values, validationSchema]);

  // Returns the cast values when valid, or null after recording field errors.
  const runValidation = useCallback(async (): Promise<TOutput | null> => {
    try {
      const output = await validationSchema.validate(values, { abortEarly: false });
      setErrors({});
      return output;
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const newErrors: Partial<Record<keyof T, string>> = {};
        error.inner.forEach(err => {
          if (err.path) {
            newErrors[err.path as keyof T] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return null;
    }
  }, [values, validationSchema]);

  const validateForm = useCallback(
    async (): Promise<boolean> => (await runValidation()) !== null,
    [runValidation]
  );

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    
    // Mark all fields as touched
    const allTouched: Partial<Record<keyof T, boolean>> = {};
    Object.keys(values).forEach(key => {
      allTouched[key as keyof T] = true;
    });
    setTouched(allTouched);

    try {
      const output = await runValidation();
      if (output !== null) {
        await onSubmit(output);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, runValidation, onSubmit]);

  const resetForm = useCallback(() => {
    setValuesState(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const isValid = Object.keys(errors).length === 0;

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    setValue,
    setFieldTouched,
    setFieldError,
    validateField,
    validateForm,
    handleSubmit,
    resetForm,
    setValues,
  };
}