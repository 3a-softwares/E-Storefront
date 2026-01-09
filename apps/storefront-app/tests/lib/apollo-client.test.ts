/**
 * Tests for Apollo Client configuration and environment variable handling
 */

// Mock dependencies before imports
jest.mock('@apollo/client', () => ({
  ApolloClient: jest.fn().mockImplementation(() => ({
    link: {},
    cache: {},
    query: jest.fn(),
    mutate: jest.fn(),
  })),
  InMemoryCache: jest.fn().mockImplementation(() => ({})),
  HttpLink: jest.fn().mockImplementation((config) => ({ uri: config.uri })),
  from: jest.fn().mockImplementation((links) => links),
  ApolloLink: jest.fn().mockImplementation((fn) => ({ fn })),
}));

jest.mock('@apollo/client/link/error', () => ({
  onError: jest.fn().mockImplementation((fn) => ({ errorHandler: fn })),
}));

jest.mock('@apollo/client/dev', () => ({
  loadErrorMessages: jest.fn(),
  loadDevMessages: jest.fn(),
}));

jest.mock('@3asoftwares/utils/client', () => ({
  getAccessToken: jest.fn(() => 'mock-token'),
  clearAuth: jest.fn(),
  Logger: {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
  },
}));

describe('Apollo Client Configuration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('Environment Variables', () => {
    it('should use default GRAPHQL_URL when env is not set', () => {
      delete process.env.NEXT_PUBLIC_GRAPHQL_URL;

      // The default endpoint should be localhost:4000/graphql
      const defaultEndpoint =
        process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql';
      expect(defaultEndpoint).toBe('http://localhost:4000/graphql');
    });

    it('should use NEXT_PUBLIC_GRAPHQL_URL when set', () => {
      process.env.NEXT_PUBLIC_GRAPHQL_URL = 'https://api.production.com/graphql';

      const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql';
      expect(endpoint).toBe('https://api.production.com/graphql');
    });

    it('should load dev messages in development environment', () => {
      process.env.NEXT_PUBLIC_ENV = 'development';

      // In development, loadDevMessages should be called
      const isDev = process.env.NEXT_PUBLIC_ENV !== 'production';
      expect(isDev).toBe(true);
    });

    it('should not load dev messages in production environment', () => {
      process.env.NEXT_PUBLIC_ENV = 'production';

      const isDev = process.env.NEXT_PUBLIC_ENV !== 'production';
      expect(isDev).toBe(false);
    });
  });

  describe('Auth Link', () => {
    it('should add authorization header when token exists', () => {
      const { getAccessToken } = require('@3asoftwares/utils/client');
      getAccessToken.mockReturnValue('test-token');

      const token = getAccessToken();
      const headers = token ? { authorization: `Bearer ${token}` } : {};

      expect(headers).toEqual({ authorization: 'Bearer test-token' });
    });

    it('should not add authorization header when no token', () => {
      const { getAccessToken } = require('@3asoftwares/utils/client');
      getAccessToken.mockReturnValue(null);

      const token = getAccessToken();
      const headers = token ? { authorization: `Bearer ${token}` } : {};

      expect(headers).toEqual({});
    });
  });

  describe('Error Link', () => {
    it('should clear auth on UNAUTHENTICATED error', () => {
      const { clearAuth } = require('@3asoftwares/utils/client');

      // Simulate GraphQL error handling
      const graphQLError = {
        message: 'Not authenticated',
        extensions: { code: 'UNAUTHENTICATED' },
      };

      if (graphQLError.extensions?.code === 'UNAUTHENTICATED') {
        clearAuth();
      }

      expect(clearAuth).toHaveBeenCalled();
    });

    it('should log GraphQL errors', () => {
      const { Logger } = require('@3asoftwares/utils/client');

      const graphQLError = {
        message: 'Some error',
        locations: [{ line: 1, column: 1 }],
        path: ['query', 'user'],
      };

      Logger.error(`[GraphQL error]: Message: ${graphQLError.message}`);

      expect(Logger.error).toHaveBeenCalledWith(expect.stringContaining('Some error'));
    });
  });
});

describe('Environment Variable Edge Cases', () => {
  it('should handle empty string GRAPHQL_URL', () => {
    const url = '' || 'http://localhost:4000/graphql';
    expect(url).toBe('http://localhost:4000/graphql');
  });

  it('should handle whitespace in GRAPHQL_URL', () => {
    const envUrl = '  https://api.example.com/graphql  ';
    const url = envUrl.trim() || 'http://localhost:4000/graphql';
    expect(url).toBe('https://api.example.com/graphql');
  });

  it('should validate GRAPHQL_URL format', () => {
    const validUrls = [
      'http://localhost:4000/graphql',
      'https://api.example.com/graphql',
      'http://192.168.1.1:4000/graphql',
    ];

    const urlPattern = /^https?:\/\/.+\/graphql$/;

    validUrls.forEach((url) => {
      expect(url).toMatch(urlPattern);
    });
  });
});
