import { renderHook, waitFor } from '@testing-library/react';
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
  storeAuth: jest.fn(),
  clearAuth: jest.fn(),
  getAccessToken: jest.fn(() => 'mock-token'),
}));

import { apolloClient } from '../../lib/apollo/client';
import { useProducts, useProduct, useCategories } from '../../lib/hooks/useProducts';

const mockApolloClient = apolloClient as jest.Mocked<typeof apolloClient>;

// Create a wrapper with QueryClientProvider
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useProducts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch products with default pagination', async () => {
    const mockProducts = {
      products: [
        { id: '1', name: 'Product 1', price: 10 },
        { id: '2', name: 'Product 2', price: 20 },
      ],
      total: 2,
      page: 1,
      totalPages: 1,
    };

    (mockApolloClient.query as jest.Mock).mockResolvedValue({
      data: { products: mockProducts },
    });

    const { result } = renderHook(() => useProducts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockApolloClient.query).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: expect.objectContaining({
          page: 1,
          limit: 20,
        }),
      })
    );
    expect(result.current.data).toEqual(mockProducts);
  });

  it('should fetch products with custom pagination', async () => {
    const mockProducts = { products: [], total: 0 };
    (mockApolloClient.query as jest.Mock).mockResolvedValue({
      data: { products: mockProducts },
    });

    const { result } = renderHook(() => useProducts(2, 10), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockApolloClient.query).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: expect.objectContaining({
          page: 2,
          limit: 10,
        }),
      })
    );
  });

  it('should fetch products with filters', async () => {
    const filters = { category: 'electronics', minPrice: 100 };
    const mockProducts = { products: [], total: 0 };
    (mockApolloClient.query as jest.Mock).mockResolvedValue({
      data: { products: mockProducts },
    });

    const { result } = renderHook(() => useProducts(1, 20, filters), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockApolloClient.query).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: expect.objectContaining({
          category: 'electronics',
          minPrice: 100,
        }),
      })
    );
  });

  it('should handle error', async () => {
    (mockApolloClient.query as jest.Mock).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useProducts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
  });
});

describe('useProduct', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch single product by id', async () => {
    const mockProduct = {
      id: 'prod1',
      name: 'Test Product',
      price: 99.99,
      description: 'Test description',
    };

    (mockApolloClient.query as jest.Mock).mockResolvedValue({
      data: { product: mockProduct },
    });

    const { result } = renderHook(() => useProduct('prod1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockApolloClient.query).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: { id: 'prod1' },
      })
    );
    expect(result.current.data).toEqual(mockProduct);
  });

  it('should not fetch when id is empty', async () => {
    const { result } = renderHook(() => useProduct(''), {
      wrapper: createWrapper(),
    });

    // Query should not be enabled
    expect(result.current.isFetching).toBe(false);
    expect(mockApolloClient.query).not.toHaveBeenCalled();
  });
});

describe('useCategories', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch categories', async () => {
    const mockCategories = [
      { id: 'cat1', name: 'Electronics' },
      { id: 'cat2', name: 'Clothing' },
    ];

    (mockApolloClient.query as jest.Mock).mockResolvedValue({
      data: { categories: mockCategories },
    });

    const { result } = renderHook(() => useCategories(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockCategories);
  });
});
