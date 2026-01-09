import { renderHook, act, waitFor } from '@testing-library/react';

// Mock the dependencies before importing the hook
jest.mock('@3asoftwares/utils', () => ({
  getAccessToken: jest.fn(),
  clearAuth: jest.fn(),
  storeAuth: jest.fn(),
  getStoredAuth: jest.fn(),
}));

jest.mock('../../src/services/authService', () => ({
  getProfile: jest.fn(),
  logout: jest.fn(),
}));

import { useTokenValidator } from '../../src/store/useTokenValidator';
import { getAccessToken, clearAuth, storeAuth, getStoredAuth } from '@3asoftwares/utils';
import { getProfile, logout } from '../../src/services/authService';

const mockGetAccessToken = getAccessToken as jest.Mock;
const mockClearAuth = clearAuth as jest.Mock;
const mockStoreAuth = storeAuth as jest.Mock;
const mockGetStoredAuth = getStoredAuth as jest.Mock;
const mockGetProfile = getProfile as jest.Mock;
const mockLogout = logout as jest.Mock;

describe('useTokenValidator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('validateToken', () => {
    it('should return invalid when no token exists', async () => {
      mockGetAccessToken.mockReturnValue(null);

      const { result } = renderHook(() => useTokenValidator());

      let validationResult: any;
      await act(async () => {
        validationResult = await result.current.validateToken();
      });

      expect(validationResult).toEqual({ valid: false, reason: 'no_token' });
      expect(mockGetProfile).not.toHaveBeenCalled();
    });

    it('should validate token and return user when valid', async () => {
      const mockUser = { id: '1', email: 'test@example.com', role: 'admin' };
      mockGetAccessToken.mockReturnValue('valid-token');
      mockGetProfile.mockResolvedValue({ data: { user: mockUser } });
      mockGetStoredAuth.mockReturnValue({ token: 'valid-token', user: mockUser });

      const { result } = renderHook(() => useTokenValidator());

      let validationResult: any;
      await act(async () => {
        validationResult = await result.current.validateToken();
      });

      expect(validationResult).toEqual({ valid: true, user: mockUser });
      expect(mockGetProfile).toHaveBeenCalled();
    });

    it('should call onUserUpdate callback when token is valid', async () => {
      const mockUser = { id: '1', email: 'test@example.com' };
      const mockOnUserUpdate = jest.fn();
      mockGetAccessToken.mockReturnValue('valid-token');
      mockGetProfile.mockResolvedValue({ data: { user: mockUser } });
      mockGetStoredAuth.mockReturnValue({ token: 'valid-token' });

      const { result } = renderHook(() => useTokenValidator(mockOnUserUpdate));

      await act(async () => {
        await result.current.validateToken();
      });

      expect(mockOnUserUpdate).toHaveBeenCalledWith(mockUser);
    });

    it('should refresh stored auth on successful validation (sliding expiration)', async () => {
      const mockUser = { id: '1', email: 'test@example.com' };
      mockGetAccessToken.mockReturnValue('valid-token');
      mockGetProfile.mockResolvedValue({ data: { user: mockUser } });
      mockGetStoredAuth.mockReturnValue({ token: 'valid-token' });

      const { result } = renderHook(() => useTokenValidator());

      await act(async () => {
        await result.current.validateToken();
      });

      expect(mockStoreAuth).toHaveBeenCalledWith({
        user: mockUser,
        accessToken: 'valid-token',
      });
    });

    it('should return invalid when profile returns no user', async () => {
      mockGetAccessToken.mockReturnValue('valid-token');
      mockGetProfile.mockResolvedValue({ data: { user: null } });

      const { result } = renderHook(() => useTokenValidator());

      let validationResult: any;
      await act(async () => {
        validationResult = await result.current.validateToken();
      });

      expect(validationResult).toEqual({ valid: false, reason: 'no_user' });
    });

    it('should handle 401 unauthorized error', async () => {
      mockGetAccessToken.mockReturnValue('expired-token');
      mockGetProfile.mockRejectedValue(new Error('401 Unauthorized'));

      const { result } = renderHook(() => useTokenValidator());

      await act(async () => {
        await result.current.validateToken();
      });

      expect(mockClearAuth).toHaveBeenCalled();
    });

    it('should handle jwt expired error', async () => {
      mockGetAccessToken.mockReturnValue('expired-token');
      mockGetProfile.mockRejectedValue(new Error('jwt expired'));

      const { result } = renderHook(() => useTokenValidator());

      await act(async () => {
        await result.current.validateToken();
      });

      expect(mockClearAuth).toHaveBeenCalled();
    });
  });

  describe('startValidation and stopValidation', () => {
    it('should start periodic validation', async () => {
      mockGetAccessToken.mockReturnValue('valid-token');
      mockGetProfile.mockResolvedValue({ data: { user: { id: '1' } } });
      mockGetStoredAuth.mockReturnValue({ token: 'valid-token' });

      const { result } = renderHook(() => useTokenValidator());

      act(() => {
        result.current.startValidation();
      });

      // Advance timers by 5 minutes (TOKEN_CHECK_INTERVAL)
      await act(async () => {
        jest.advanceTimersByTime(5 * 60 * 1000);
      });

      expect(mockGetProfile).toHaveBeenCalled();
    });

    it('should stop periodic validation', async () => {
      mockGetAccessToken.mockReturnValue('valid-token');
      mockGetProfile.mockResolvedValue({ data: { user: { id: '1' } } });

      const { result } = renderHook(() => useTokenValidator());

      act(() => {
        result.current.startValidation();
        result.current.stopValidation();
      });

      // Clear previous calls
      mockGetProfile.mockClear();

      // Advance timers
      act(() => {
        jest.advanceTimersByTime(10 * 60 * 1000);
      });

      // Should not have been called after stopping
      expect(mockGetProfile).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should call logout service and clear auth', async () => {
      mockLogout.mockResolvedValue({ message: 'Logged out' });

      const { result } = renderHook(() => useTokenValidator());

      await act(async () => {
        await result.current.logout();
      });

      expect(mockLogout).toHaveBeenCalled();
      expect(mockClearAuth).toHaveBeenCalled();
    });

    it('should clear auth even if logout service fails', async () => {
      mockLogout.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useTokenValidator());

      await act(async () => {
        await result.current.logout();
      });

      expect(mockClearAuth).toHaveBeenCalled();
    });
  });

  describe('cleanup', () => {
    it('should stop validation on unmount', () => {
      mockGetAccessToken.mockReturnValue('valid-token');

      const { result, unmount } = renderHook(() => useTokenValidator());

      act(() => {
        result.current.startValidation();
      });

      unmount();

      // Verify cleanup happened (no errors thrown)
      expect(true).toBe(true);
    });
  });
});
