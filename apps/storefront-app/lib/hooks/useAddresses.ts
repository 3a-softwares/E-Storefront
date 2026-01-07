'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apolloClient } from '@/lib/apollo/client';
import { GQL_QUERIES } from '@/lib/apollo/queries/queries';
import type { AddressData, AddAddressInput, UpdateAddressInput } from '3a-ecommerce-types';

export type { AddressData as Address, AddAddressInput, UpdateAddressInput };

// Fetch addresses
export const useAddresses = () => {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const { data } = await apolloClient.query({
        query: GQL_QUERIES.GET_MY_ADDRESSES_QUERY,
        fetchPolicy: 'network-only',
      });
      return data?.myAddresses?.addresses || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Add address
export const useAddAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: AddAddressInput) => {
      const { data } = await apolloClient.mutate({
        mutation: GQL_QUERIES.ADD_ADDRESS_MUTATION,
        variables: { input },
      });
      return data?.addAddress;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
};

// Update address
export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: UpdateAddressInput }) => {
      const { data } = await apolloClient.mutate({
        mutation: GQL_QUERIES.UPDATE_ADDRESS_MUTATION,
        variables: { id, input },
      });
      return data?.updateAddress;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
};

// Delete address
export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apolloClient.mutate({
        mutation: GQL_QUERIES.DELETE_ADDRESS_MUTATION,
        variables: { id },
      });
      return data?.deleteAddress;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
};

// Set default address
export const useSetDefaultAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apolloClient.mutate({
        mutation: GQL_QUERIES.SET_DEFAULT_ADDRESS_MUTATION,
        variables: { id },
      });
      return data?.setDefaultAddress;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
};
