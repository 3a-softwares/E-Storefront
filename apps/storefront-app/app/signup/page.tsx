'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useRegister } from '@/lib/hooks/useAuth';
import { Button, Input } from '3a-ecommerce-ui-library';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import GoogleSignInButton from '@/components/GoogleSignInButton';

export default function SignupPage() {
  const router = useRouter();
  const { register, isLoading, error: registerError } = useRegister();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
      });
      setSuccess('Account created! Redirecting to home...');
      setTimeout(() => router.push('/'), 2000);
    } catch (err) {
      setError(registerError?.message || (err instanceof Error ? err.message : 'Signup failed'));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-gray-900 to-gray-600 px-8 py-10 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">
              <FontAwesomeIcon icon={faShoppingBag} className="mr-2" />
              3A Softwares
            </h1>
            <p className="text-blue-100 text-sm">Create your account to get started</p>
          </div>

          <div onSubmit={handleSubmit} className="px-8 py-10">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 text-sm font-medium">{success}</p>
              </div>
            )}

            <Input
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              label="Full Name"
              placeholder="John Doe"
            />

            <Input
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              label="Email Address"
              placeholder="your@email.com"
            />

            <Input
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              label="Password"
              placeholder="••••••••"
            />

            <Input
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              label="Confirm Password"
              placeholder="••••••••"
            />

            <Button disabled={isLoading} onClick={handleSubmit}>
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <GoogleSignInButton redirectTo="/" text="signup_with" />
          </div>

          <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 font-semibold hover:text-blue-700">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
