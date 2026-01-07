import React from 'react';
import { useUIStore } from '../store/uiStore';
import { clearAuth, getCurrentUser } from '3a-ecommerce-utils';
import { Button } from '3a-ecommerce-ui-library';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

interface HeaderProps {
  onLoginClick?: () => void;
  onSignupClick?: () => void;
  onBackToHome?: () => void;
  activeApp?: 'admin' | 'seller' | null;
}

export const Header: React.FC<HeaderProps> = ({
  onLoginClick,
  onSignupClick,
  onBackToHome,
  activeApp,
}) => {
  const { theme, toggleTheme } = useUIStore();

  // Check if user is logged in
  const user = getCurrentUser();
  const isLoggedIn = !!user;

  const handleLogout = () => {
    clearAuth();
    if (onBackToHome) {
      onBackToHome();
    }
    window.location.reload();
  };

  // Get app title based on active app
  const getAppTitle = () => {
    if (activeApp === 'admin') return 'Admin Dashboard';
    if (activeApp === 'seller') return 'Seller Portal';
    return '3A Softwares';
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section - Logo and Back button */}
          <div className="flex items-center space-x-4">
            {activeApp && onBackToHome && (
              <button
                onClick={onBackToHome}
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5 mr-1" />
                <span className="text-sm">Back</span>
              </button>
            )}
            <div className="flex items-center">
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                {getAppTitle()}
              </span>
              {activeApp && (
                <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                  {activeApp.charAt(0).toUpperCase() + activeApp.slice(1)}
                </span>
              )}
            </div>
          </div>

          {/* Right section - Theme toggle, User info, Auth buttons */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <FontAwesomeIcon icon={faSun} className="w-5 h-5" />
              ) : (
                <FontAwesomeIcon icon={faMoon} className="w-5 h-5" />
              )}
            </button>

            {/* User info or Auth buttons */}
            {isLoggedIn && user ? (
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.name || user.email}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                {onLoginClick && (
                  <Button onClick={onLoginClick} variant="outline">
                    Login
                  </Button>
                )}
                {onSignupClick && (
                  <Button onClick={onSignupClick} variant="primary">
                    Sign Up
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
