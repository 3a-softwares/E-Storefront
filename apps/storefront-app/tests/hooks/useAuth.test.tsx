import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Mock GraphQL queries
jest.mock('../../lib/apollo/queries/queries', () => ({
  GQL_QUERIES: {
    LOGIN_MUTATION: {},
    REGISTER_MUTATION: {},
    LOGOUT_MUTATION: {},
    ME_QUERY: {},
    REFRESH_TOKEN_MUTATION: {},
  },
  getGqlQuery: jest.fn(() => ({})),
}));

// Mock Apollo client
jest.mock('../../lib/apollo/client', () => ({
  apolloClient: {
    query: jest.fn(),
    mutate: jest.fn(),
    resetStore: jest.fn(),
    clearStore: jest.fn(),
  },
}));

// Mock utils
jest.mock('@3asoftwares/utils/client', () => ({
  storeAuth: jest.fn(),
  clearAuth: jest.fn(),
  getAccessToken: jest.fn(() => 'mock-token'),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
  })),
}));

import { apolloClient } from '../../lib/apollo/client';
import { storeAuth, clearAuth, getAccessToken } from '@3asoftwares/utils/client';
import { useLogin, useRegister, useLogout, useCurrentUser } from '../../lib/hooks/useAuth';

const mockApolloClient = apolloClient as jest.Mocked<typeof apolloClient>;
const mockStoreAuth = storeAuth as jest.Mock;
const mockClearAuth = clearAuth as jest.Mock;

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

describe('useLogin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should login successfully', async () => {
    const mockUser = { id: '1', email: 'test@example.com', role: 'customer' };
    const mockResponse = {
      user: mockUser,
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    };

    (mockApolloClient.mutate as jest.Mock).mockResolvedValue({
      data: { login: mockResponse },
    });

    const { result } = renderHook(() => useLogin(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.login({ email: 'test@example.com', password: 'password' });
    });

    expect(mockApolloClient.mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: {
          input: { email: 'test@example.com', password: 'password' },
        },
      })
    );
    expect(mockStoreAuth).toHaveBeenCalledWith({
      user: mockUser,
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });
  });

  it('should throw error on login failure', async () => {
    (mockApolloClient.mutate as jest.Mock).mockResolvedValue({
      data: { login: null },
    });

    const { result } = renderHook(() => useLogin(), {
      wrapper: createWrapper(),
    });

    await expect(
      act(async () => {
        await result.current.login({ email: 'test@example.com', password: 'wrong' });
      })
    ).rejects.toThrow('Login failed');
  });

  it('should handle network error', async () => {
    (mockApolloClient.mutate as jest.Mock).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useLogin(), {
      wrapper: createWrapper(),
    });

    await expect(
      act(async () => {
        await result.current.login({ email: 'test@example.com', password: 'password' });
      })
    ).rejects.toThrow('Network error');
  });
});

describe('useRegister', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should register successfully', async () => {
    const mockUser = { id: '1', email: 'new@example.com', role: 'customer' };
    const mockResponse = {
      user: mockUser,
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    };

    (mockApolloClient.mutate as jest.Mock).mockResolvedValue({
      data: { register: mockResponse },
    });

    const { result } = renderHook(() => useRegister(), {
      wrapper: createWrapper(),
    });

    const registerInput = {
      email: 'new@example.com',
      password: 'Password123!',
      name: 'John Doe',
    };

    await act(async () => {
      await result.current.register(registerInput);
    });

    expect(mockApolloClient.mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: { input: registerInput },
      })
    );
    expect(mockStoreAuth).toHaveBeenCalled();
  });

  it('should throw error when registration fails', async () => {
    (mockApolloClient.mutate as jest.Mock).mockResolvedValue({
      data: { register: null },
    });

    const { result } = renderHook(() => useRegister(), {
      wrapper: createWrapper(),
    });

    await expect(
      act(async () => {
        await result.current.register({ email: 'test@test.com', password: 'pass' });
      })
    ).rejects.toThrow('Registration failed');
  });
});

describe('useLogout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should logout and clear auth', async () => {
    (mockApolloClient.mutate as jest.Mock).mockResolvedValue({
      data: { logout: { success: true } },
    });
    (mockApolloClient.clearStore as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useLogout(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.logout();
    });

    expect(mockClearAuth).toHaveBeenCalled();
    expect(mockApolloClient.clearStore).toHaveBeenCalled();
  });
});

describe('useCurrentUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch current user', async () => {
    const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' };

    (mockApolloClient.query as jest.Mock).mockResolvedValue({
      data: { me: mockUser },
    });

    const { result } = renderHook(() => useCurrentUser(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockUser);
  });

  it('should handle unauthenticated state', async () => {
    (mockApolloClient.query as jest.Mock).mockRejectedValue(new Error('Unauthorized'));

    const { result } = renderHook(() => useCurrentUser(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // useCurrentUser catches errors and returns null
    expect(result.current.data).toBeNull();
  });
});
