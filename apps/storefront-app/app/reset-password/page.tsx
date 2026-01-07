'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button, Input } from '3a-ecommerce-ui-library';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShoppingBag,
  faLock,
  faCheckCircle,
  faExclamationTriangle,
  faArrowLeft,
  faEye,
  faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';
import { useResetPassword, useValidateResetToken } from '@/lib/hooks/usePasswordReset';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const { resetPassword, isLoading } = useResetPassword();
  const { isValid, email, isLoading: isValidating } = useValidateResetToken(token);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!token) {
      setError('Invalid reset token');
      return;
    }

    try {
      const result = await resetPassword({ token, password, confirmPassword });
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
    }
  };

  // Show loading while validating token
  if (isValidating) {
    return (
      <div className="min-h-[calc(100vh_-_80px)] bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-8">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
              <p className="text-gray-600">Validating reset link...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error if token is invalid
  if (!token || (!isValidating && !isValid)) {
    return (
      <div className="min-h-[calc(100vh_-_80px)] bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-red-500 px-8 py-10 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-white text-3xl" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Invalid Reset Link</h1>
              <p className="text-red-100 text-sm">This password reset link is invalid or expired</p>
            </div>

            <div className="px-8 py-10">
              <div className="text-center mb-6">
                <p className="text-gray-600 mb-4">
                  The password reset link you clicked is no longer valid. This can happen if:
                </p>
                <ul className="text-left text-sm text-gray-500 space-y-2 mb-6">
                  <li>• The link has expired (links are valid for 1 hour)</li>
                  <li>• The link has already been used</li>
                  <li>• The link was copied incorrectly</li>
                </ul>
              </div>

              <div className="space-y-3">
                <Link href="/forgot-password" className="block">
                  <Button variant="primary" className="w-full">
                    Request New Reset Link
                  </Button>
                </Link>
                <Link href="/login" className="block">
                  <Button variant="outline" className="w-full">
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

  // Show success message
  if (success) {
    return (
      <div className="min-h-[calc(100vh_-_80px)] bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-500 px-8 py-10 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                <FontAwesomeIcon icon={faCheckCircle} className="text-white text-3xl" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Password Reset!</h1>
              <p className="text-green-100 text-sm">Your password has been successfully changed</p>
            </div>

            <div className="px-8 py-10">
              <div className="text-center mb-6">
                <p className="text-gray-600">
                  You can now log in to your account with your new password.
                </p>
              </div>

              <Link href="/login" className="block">
                <Button variant="primary" className="w-full">
                  Sign In Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show reset password form
  return (
    <div className="min-h-[calc(100vh_-_80px)] bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-gray-900 to-gray-600 px-8 py-10 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">
              <FontAwesomeIcon icon={faShoppingBag} className="mr-2" />
              3A Softwares
            </h1>
            <p className="text-blue-100 text-sm">Create a new password</p>
          </div>

          <div className="px-8 py-10">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
                <FontAwesomeIcon icon={faLock} className="text-gray-600 text-xl" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Reset Password</h2>
              {email && (
                <p className="text-gray-600 text-sm">
                  Creating new password for <strong>{email}</strong>
                </p>
              )}
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  label="New Password"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>

              <div className="relative mt-4">
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  label="Confirm New Password"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                >
                  <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                </button>
              </div>

              <div className="mt-4 text-sm text-gray-500">
                <p>Password must:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li className={password.length >= 6 ? 'text-green-600' : ''}>
                    Be at least 6 characters
                  </li>
                  <li
                    className={
                      password && confirmPassword && password === confirmPassword
                        ? 'text-green-600'
                        : ''
                    }
                  >
                    Match confirm password
                  </li>
                </ul>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full mt-6">
                {isLoading ? 'Resetting...' : 'Reset Password'}
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh_-_80px)] bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-8">
              <div className="flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
                <p className="text-gray-600">Loading...</p>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
