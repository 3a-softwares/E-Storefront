import React from 'react';
import { Header as UIHeader } from '3a-ecommerce-ui-library';
import { useSellerAuthStore } from '../store/authStore';

export const Header: React.FC = () => {
  const { user, clearAuth } = useSellerAuthStore();

  const handleLogout = () => {
    // clearAuth from store handles cookie cleanup and redirect
    clearAuth();
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-40 shadow bg-white dark:bg-gray-900">
      <UIHeader
        logoUrl=""
        appName="Seller Portal"
        user={user ? { name: user.name } : undefined}
        onLogout={handleLogout}
      />
    </div>
  );
};
