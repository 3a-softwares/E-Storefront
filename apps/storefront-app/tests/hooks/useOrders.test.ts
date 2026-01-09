import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Mock Apollo client
jest.mock('../../lib/apollo/client', () => ({
  apolloClient: {
    query: jest.fn(),
    mutate: jest.fn(),
  },
}));

// Mock utils
jest.mock('@3asoftwares/utils/client', () => ({
  getAccessToken: jest.fn(() => 'mock-token'),
}));

import { apolloClient } from '../../lib/apollo/client';
import { getAccessToken } from '@3asoftwares/utils/client';
import { useOrders, useOrder, useCreateOrder, useCancelOrder } from '../../lib/hooks/useOrders';

const mockApolloClient = apolloClient as jest.Mocked<typeof apolloClient>;
const mockGetAccessToken = getAccessToken as jest.Mock;

// Create a wrapper with QueryClientProvider
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useOrders', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAccessToken.mockReturnValue('mock-token');
  });

  it('should fetch orders with default pagination', async () => {
    const mockOrders = {
      orders: [
        { id: 'order1', status: 'pending', total: 100 },
        { id: 'order2', status: 'shipped', total: 200 },
      ],
      total: 2,
      page: 1,
    };

    (mockApolloClient.query as jest.Mock).mockResolvedValue({
      data: { orders: mockOrders },
    });

    const { result } = renderHook(() => useOrders(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockApolloClient.query).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: expect.objectContaining({
          page: 1,
          limit: 10,
        }),
      })
    );
    expect(result.current.data).toEqual(mockOrders);
  });

  it('should fetch orders with custom pagination', async () => {
    const mockOrders = { orders: [], total: 0 };
    (mockApolloClient.query as jest.Mock).mockResolvedValue({
      data: { orders: mockOrders },
    });

    const { result } = renderHook(() => useOrders(2, 20), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockApolloClient.query).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: expect.objectContaining({
          page: 2,
          limit: 20,
        }),
      })
    );
  });

  it('should not fetch orders when not authenticated', async () => {
    mockGetAccessToken.mockReturnValue(null);

    const { result } = renderHook(() => useOrders(), {
      wrapper: createWrapper(),
    });

    // Query should not be enabled
    expect(result.current.isFetching).toBe(false);
    expect(mockApolloClient.query).not.toHaveBeenCalled();
  });

  it('should filter by customerId', async () => {
    const mockOrders = { orders: [], total: 0 };
    (mockApolloClient.query as jest.Mock).mockResolvedValue({
      data: { orders: mockOrders },
    });

    const { result } = renderHook(() => useOrders(1, 10, 'customer123'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockApolloClient.query).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: expect.objectContaining({
          customerId: 'customer123',
        }),
      })
    );
  });
});

describe('useOrder', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAccessToken.mockReturnValue('mock-token');
  });

  it('should fetch single order by id', async () => {
    const mockOrder = {
      id: 'order1',
      status: 'pending',
      total: 150,
      items: [{ productId: 'prod1', quantity: 2 }],
    };

    (mockApolloClient.query as jest.Mock).mockResolvedValue({
      data: { order: mockOrder },
    });

    const { result } = renderHook(() => useOrder('order1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockApolloClient.query).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: { id: 'order1' },
      })
    );
    expect(result.current.data).toEqual(mockOrder);
  });

  it('should not fetch when id is empty', async () => {
    const { result } = renderHook(() => useOrder(''), {
      wrapper: createWrapper(),
    });

    expect(result.current.isFetching).toBe(false);
    expect(mockApolloClient.query).not.toHaveBeenCalled();
  });

  it('should not fetch when not authenticated', async () => {
    mockGetAccessToken.mockReturnValue(null);

    const { result } = renderHook(() => useOrder('order1'), {
      wrapper: createWrapper(),
    });

    expect(result.current.isFetching).toBe(false);
    expect(mockApolloClient.query).not.toHaveBeenCalled();
  });
});

describe('useCreateOrder', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create order successfully', async () => {
    const mockOrder = {
      id: 'neworder1',
      status: 'pending',
      total: 250,
    };

    (mockApolloClient.mutate as jest.Mock).mockResolvedValue({
      data: { createOrder: { order: mockOrder } },
    });

    const { result } = renderHook(() => useCreateOrder(), {
      wrapper: createWrapper(),
    });

    const orderInput = {
      items: [{ productId: 'prod1', quantity: 2 }],
      shippingAddressId: 'addr1',
    };

    await act(async () => {
      await result.current.mutateAsync(orderInput as any);
    });

    expect(mockApolloClient.mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: { input: orderInput },
      })
    );
  });

  it('should handle createOrder with orders array response', async () => {
    const mockOrders = [
      { id: 'order1', status: 'pending' },
      { id: 'order2', status: 'pending' },
    ];

    (mockApolloClient.mutate as jest.Mock).mockResolvedValue({
      data: { createOrder: { orders: mockOrders } },
    });

    const { result } = renderHook(() => useCreateOrder(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      const response = await result.current.mutateAsync({} as any);
      expect(response).toEqual(mockOrders[0]);
    });
  });

  it('should throw error when createOrder fails', async () => {
    (mockApolloClient.mutate as jest.Mock).mockResolvedValue({
      data: { createOrder: null },
    });

    const { result } = renderHook(() => useCreateOrder(), {
      wrapper: createWrapper(),
    });

    await expect(
      act(async () => {
        await result.current.mutateAsync({} as any);
      })
    ).rejects.toThrow('Failed to create order');
  });
});
