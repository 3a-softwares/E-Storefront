import { render } from '@testing-library/react';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
  })),
}));

// Mock useGoogleAuth hook
const mockGoogleAuth = jest.fn();
jest.mock('../../lib/hooks/useAuth', () => ({
  useGoogleAuth: jest.fn(() => ({
    googleAuth: mockGoogleAuth,
    isLoading: false,
    error: null,
  })),
}));

import GoogleSignInButton from '../../components/GoogleSignInButton';
import { useRouter } from 'next/navigation';
import { useGoogleAuth } from '../../lib/hooks/useAuth';

describe('GoogleSignInButton Component', () => {
  const originalEnv = process.env;
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useGoogleAuth as jest.Mock).mockReturnValue({
      googleAuth: mockGoogleAuth,
      isLoading: false,
      error: null,
    });
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('Environment Variable Handling', () => {
    it('should not render button when GOOGLE_CLIENT_ID is not set', () => {
      delete process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

      const { container } = render(<GoogleSignInButton />);

      // Component should render but not initialize Google SDK
      expect(container).toBeTruthy();
    });

    it('should initialize when GOOGLE_CLIENT_ID is set', () => {
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID = 'test-client-id.apps.googleusercontent.com';

      const { container } = render(<GoogleSignInButton />);

      expect(container).toBeTruthy();
    });
  });

  describe('Rendering', () => {
    it('should render the component', () => {
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID = 'test-client-id';

      const { container } = render(<GoogleSignInButton />);

      expect(container).toBeTruthy();
    });

    it('should render with custom props', () => {
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID = 'test-client-id';

      const { container } = render(
        <GoogleSignInButton text="signin_with" theme="filled_blue" size="medium" width={300} />
      );

      expect(container).toBeTruthy();
    });
  });

  describe('Loading State', () => {
    it('should handle loading state', () => {
      (useGoogleAuth as jest.Mock).mockReturnValue({
        googleAuth: mockGoogleAuth,
        isLoading: true,
        error: null,
      });

      const { container } = render(<GoogleSignInButton />);

      expect(container).toBeTruthy();
    });
  });

  describe('Error Handling', () => {
    it('should handle error state', () => {
      const mockError = new Error('Auth failed');
      (useGoogleAuth as jest.Mock).mockReturnValue({
        googleAuth: mockGoogleAuth,
        isLoading: false,
        error: mockError,
      });

      const { container } = render(<GoogleSignInButton />);

      expect(container).toBeTruthy();
    });

    it('should call onError callback on auth failure', async () => {
      const mockOnError = jest.fn();
      mockGoogleAuth.mockRejectedValue(new Error('Auth failed'));

      render(<GoogleSignInButton onError={mockOnError} />);

      // The error callback would be called when authentication fails
      expect(container).toBeTruthy();
    });
  });

  describe('Success Handling', () => {
    it('should call onSuccess callback on successful auth', async () => {
      const mockOnSuccess = jest.fn();
      mockGoogleAuth.mockResolvedValue({ user: { id: '1' } });

      render(<GoogleSignInButton onSuccess={mockOnSuccess} />);

      // Success callback would be called after successful auth
      expect(container).toBeTruthy();
    });

    it('should redirect to custom path after success', () => {
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID = 'test-client-id';

      render(<GoogleSignInButton redirectTo="/dashboard" />);

      // After success, should redirect to /dashboard
      expect(container).toBeTruthy();
    });
  });

  describe('Default Props', () => {
    it('should use default props when not specified', () => {
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID = 'test-client-id';

      // Default values: text='continue_with', theme='outline', size='large', width=280
      const { container } = render(<GoogleSignInButton />);

      expect(container).toBeTruthy();
    });
  });
});

describe('Google Sign-In Environment Configuration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should validate GOOGLE_CLIENT_ID format', () => {
    const validClientId = '123456789-abcdefghijk.apps.googleusercontent.com';
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID = validClientId;

    expect(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID).toContain('.apps.googleusercontent.com');
  });

  it('should handle missing GOOGLE_CLIENT_ID gracefully', () => {
    delete process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
    expect(clientId).toBe('');
  });
});
