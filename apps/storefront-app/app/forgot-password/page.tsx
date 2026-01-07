'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button, Input } from '3a-ecommerce-ui-library';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShoppingBag,
  faEnvelope,
  faArrowLeft,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
import { useForgotPassword } from '@/lib/hooks/usePasswordReset';

export default function ForgotPasswordPage() {
  const { forgotPassword, isLoading } = useForgotPassword();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    try {
      const result = await forgotPassword({ email, role: 'customer' });
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email');
    }
  };

  if (success) {
    return (
      <div className="min-h-[calc(100vh_-_80px)] bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-500 px-8 py-10 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                <FontAwesomeIcon icon={faCheckCircle} className="text-white text-3xl" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Check Your Email</h1>
              <p className="text-green-100 text-sm">
                We've sent password reset instructions to your email
              </p>
            </div>

            <div className="px-8 py-10">
              <div className="text-center mb-6">
                <p className="text-gray-600 mb-4">
                  If an account exists for <strong className="text-gray-900">{email}</strong>, you
                  will receive an email with instructions to reset your password.
                </p>
                <p className="text-sm text-gray-500">
                  Didn't receive the email? Check your spam folder or try again.
                </p>
              </div>

              <div className="space-y-3">
                <Button onClick={() => setSuccess(false)} variant="outline" className="w-full">
                  <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                  Try Another Email
                </Button>
                <Link href="/login" className="block">
                  <Button variant="primary" className="w-full">
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                    Back to Login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh_-_80px)] bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-gray-900 to-gray-600 px-8 py-10 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">
              <FontAwesomeIcon icon={faShoppingBag} className="mr-2" />
              3A Softwares
            </h1>
            <p className="text-blue-100 text-sm">Reset your password</p>
          </div>

          <div className="px-8 py-10">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Forgot Password?</h2>
              <p className="text-gray-600 text-sm">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                label="Email Address"
                placeholder="your@email.com"
              />
              <Button type="submit" disabled={isLoading} className="w-full mt-4">
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          </div>

          <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{' '}
              <Link href="/login" className="text-gray-600 font-semibold hover:text-gray-900">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
