'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { apolloClient } from '../apollo/client';
import { GQL_QUERIES } from '../apollo/queries/queries';
import type {
  ForgotPasswordResponse,
  ResetPasswordResponse,
  ValidateTokenResponse,
} from '3a-ecommerce-types';

export function useForgotPassword() {
  const mutation = useMutation({
    mutationFn: async ({ email, role }: { email: string; role: string }) => {
      const { data } = await apolloClient.mutate<ForgotPasswordResponse>({
        mutation: GQL_QUERIES.FORGOT_PASSWORD_MUTATION,
        variables: { email, role },
      });

      if (!data?.forgotPassword) {
        throw new Error('Failed to process password reset request');
      }

      return data.forgotPassword;
    },
  });

  return {
    forgotPassword: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
  };
}

export function useResetPassword() {
  const mutation = useMutation({
    mutationFn: async ({
      token,
      password,
      confirmPassword,
    }: {
      token: string;
      password: string;
      confirmPassword: string;
    }) => {
      const { data } = await apolloClient.mutate<ResetPasswordResponse>({
        mutation: GQL_QUERIES.RESET_PASSWORD_MUTATION,
        variables: { token, password, confirmPassword },
      });

      if (!data?.resetPassword) {
        throw new Error('Failed to reset password');
      }

      return data.resetPassword;
    },
  });

  return {
    resetPassword: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
  };
}

export function useValidateResetToken(token: string | null) {
  const query = useQuery({
    queryKey: ['validateResetToken', token],
    queryFn: async () => {
      if (!token) {
        return { success: false, message: 'No token provided', email: null };
      }

      const { data } = await apolloClient.query<ValidateTokenResponse>({
        query: GQL_QUERIES.VALIDATE_RESET_TOKEN_QUERY,
        variables: { token },
        fetchPolicy: 'network-only',
      });

      if (!data?.validateResetToken) {
        throw new Error('Failed to validate token');
      }

      return data.validateResetToken;
    },
    enabled: !!token,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    isValid: query.data?.success ?? false,
    email: query.data?.email ?? null,
  };
}
