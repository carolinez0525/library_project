import { Form } from 'antd';
import { useState, useCallback } from 'react';
import type { StoreValue } from 'rc-field-form/lib/interface';
import { handleFormError } from '@/utils/errorHandler';

interface UseFormValidationOptions<T = Record<string, unknown>> {
  onSuccess?: (values: T) => void;
  onError?: (error: Error) => void;
  validateOnChange?: boolean;
}

export const useFormValidation = <T extends Record<string, unknown>>(options: UseFormValidationOptions<T> = {}) => {
  const [form] = Form.useForm<T>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const validateField = useCallback(async (fieldName: string) => {
    try {
      await form.validateFields([fieldName]);
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
      return true;
    } catch (error) {
      if (error instanceof Error) {
        setErrors(prev => ({
          ...prev,
          [fieldName]: [error.message],
        }));
      }
      return false;
    }
  }, [form]);

  const validateFields = useCallback(async (fieldNames: string[]) => {
    try {
      await form.validateFields(fieldNames);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof Error) {
        const newErrors: Record<string, string[]> = {};
        const errorFields = form.getFieldsError();
        errorFields.forEach(({ name, errors: fieldErrors }) => {
          if (fieldErrors.length > 0) {
            newErrors[name.join('.')] = fieldErrors;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  }, [form]);

  const handleSubmit = useCallback(async (values: T) => {
    setIsSubmitting(true);
    try {
      await form.validateFields();
      setErrors({});
      options.onSuccess?.(values);
    } catch (error) {
      if (error instanceof Error) {
        handleFormError(error);
        options.onError?.(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [form, options]);

  const resetForm = useCallback(() => {
    form.resetFields();
    setErrors({});
  }, [form]);

  const setFieldsValue = useCallback((values: Partial<T>) => {
    form.setFieldsValue(values as Record<string, StoreValue>);
  }, [form]);

  const getFieldsValue = useCallback(() => {
    return form.getFieldsValue() as T;
  }, [form]);

  return {
    form,
    isSubmitting,
    errors,
    validateField,
    validateFields,
    handleSubmit,
    resetForm,
    setFieldsValue,
    getFieldsValue,
  };
}; 