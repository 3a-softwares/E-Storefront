'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useLogin } from '@/lib/hooks/useAuth';
import { useCartStore } from '@/store/cartStore';
import { Button, Input } from '3a-ecommerce-ui-library';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import GoogleSignInButton from '@/components/GoogleSignInButton';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';
  const { login, isLoading, error: loginError } = useLogin();
  const { setUserProfile } = useCartStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const result = await login({ email, password });

      if (result?.user) {
        setUserProfile({
          id: result.user.id,
          email: result.user.email,
          name: result.user.name || result.user.email.split('@')[0],
          addresses: [],
        });
      }

      router.push(redirectUrl);
    } catch (err) {
      setError(loginError?.message || (err instanceof Error ? err.message : 'Login failed'));
    }
  };

  return (
    <div className="min-h-[calc(100vh_-_80px)] bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-gray-900 to-gray-600 px-8 py-10 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">
              <FontAwesomeIcon icon={faShoppingBag} className="mr-2" />
              3A Softwares
            </h1>
            <p className="text-blue-100 text-sm">Welcome back to your favorite store</p>
          </div>

          <div className="px-8 py-10">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              label="Email Address"
              placeholder="your@email.com"
            />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              label="Password"
              placeholder="••••••••"
            />
            <Button type="submit" disabled={isLoading} onClick={handleSubmit}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <GoogleSignInButton redirectTo={redirectUrl} text="signin_with" />

            <div className="text-center mt-4">
              <Link href="/forgot-password" className="text-sm text-gray-600 hover:text-gray-900">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/signup" className="text-gray-600 font-semibold hover:text-gray-900">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
