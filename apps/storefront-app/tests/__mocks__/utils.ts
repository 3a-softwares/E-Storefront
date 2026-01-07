// Mock for 3a-ecommerce-utils
export const storeAuth = jest.fn();
export const clearAuth = jest.fn();
export const getCurrentUser = jest.fn(() => null);
export const getStoredAuth = jest.fn(() => null);

export const formatPrice = jest.fn((price: number) => `$${price.toFixed(2)}`);
export const formatCurrency = jest.fn((amount: number) => `$${amount.toFixed(2)}`);
export const formatDate = jest.fn((date: string | Date) => new Date(date).toLocaleDateString());

export const API_BASE_URL = 'http://localhost:4000';
export const GRAPHQL_URL = 'http://localhost:4000/graphql';

export const Logger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
};

export default {
  storeAuth,
  clearAuth,
  getCurrentUser,
  getStoredAuth,
  formatPrice,
  formatCurrency,
  formatDate,
  API_BASE_URL,
  GRAPHQL_URL,
  Logger,
};
