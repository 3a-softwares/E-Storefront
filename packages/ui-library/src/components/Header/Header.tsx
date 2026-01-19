import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun, faRightFromBracket, faRightToBracket, faUserPlus, faBars, faTimes, faUser } from '@fortawesome/free-solid-svg-icons';
import { Button } from '../Button/Button';
import { Select } from '../Select/Select';

type User = {
  name: string;
};

export interface HeaderProps {
  user?: User;
  onLogin?: () => void;
  onLogout?: () => void;
  onCreateAccount?: () => void;
  extraContent?: React.ReactNode;
  logoUrl?: any;
  appName?: string;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  language?: string;
  onLanguageChange?: (lang: string) => void;
  showThemeToggle?: boolean;
  showLanguageSelector?: boolean;
  languageOptions?: { value: string; label: string }[];
}

export const Header = ({
  user,
  onLogin,
  onLogout,
  onCreateAccount,
  extraContent,
  logoUrl = 'https://res.cloudinary.com/dpdfyou3r/image/upload/v1767265363/logo/3A_gczh29.png',
  appName = '3A Softwares',
  theme = 'light',
  onToggleTheme,
  language = 'en',
  onLanguageChange,
  showThemeToggle = true,
  showLanguageSelector = true,
  languageOptions,
}: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuItemClick = (action?: () => void) => {
    if (action) {
      action();
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-200 z-50">
      <div className="flex items-center justify-between px-3 sm:px-5 py-3 sm:py-4">
        {/* Logo and App Name */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-shrink">
          {logoUrl ? (
            <img src={logoUrl} alt={appName} width={32} height={32} className="object-contain w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0" />
          ) : (
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {appName.charAt(0)}
            </div>
          )}
          <h1 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white leading-none m-0 truncate">
            {appName}
          </h1>
        </div>

        {/* Desktop Navigation - Hidden on mobile */}
        <div className="hidden sm:!flex items-center gap-3 flex-shrink-0">
          {showThemeToggle && onToggleTheme && (
            <Button
              onClick={onToggleTheme}
              variant="outline"
              size="sm"
              className="text-xl px-3 !no-underline"
              aria-label="Toggle theme"
            >
              <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} />
            </Button>
          )}
          {showLanguageSelector && onLanguageChange && (
            <Select
              value={language}
              onChange={onLanguageChange}
              size="sm"
              variant="outline"
              options={languageOptions || [
                { value: 'en', label: 'English' },
                { value: 'hi', label: 'Hindi' },
              ]}
              className="min-w-[80px]"
            />
          )}
          {extraContent}
          {user ? (
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-300 transition-colors"
                aria-label="User menu"
              >
                <FontAwesomeIcon icon={faUser} className="text-sm" />
              </button>

              {/* User Dropdown */}
              {isUserDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 animate-fade-in">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Signed in as</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate mt-1">{user.name}</p>
                  </div>
                  <button
                    onClick={() => {
                      if (onLogout) onLogout();
                      setIsUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <FontAwesomeIcon icon={faRightFromBracket} className="w-4" />
                    <span className="text-sm font-medium">Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
                <Button size="sm" onClick={onLogin} variant="outline" className="text-sm !px-3">
                  <FontAwesomeIcon icon={faRightToBracket} className="mr-1" />
                  Log In
                </Button>
                <Button variant="primary" size="sm" onClick={onCreateAccount} className="text-sm !px-3">
                  <FontAwesomeIcon icon={faUserPlus} className="mr-1" />
                  Sign Up
                </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button - Shown only on mobile */}
        <div className="sm:hidden relative" ref={menuRef}>
          <Button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            variant="ghost"
            size="md"
            className="text-xl px-3 !no-underline"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
          </Button>

          {/* Mobile Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 animate-fade-in">
              {/* User Info (if logged in) */}
              {user && (
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Signed in as</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                </div>
              )}

              <div className="">
                {/* Language Selector */}
                {showLanguageSelector && onLanguageChange && (
                  <div className="px-4 py-3">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase">Language</p>
                    <Select
                      value={language}
                      onChange={(val) => {
                        onLanguageChange(val);
                        setIsMenuOpen(false);
                      }}
                      size="sm"
                      variant="outline"
                      options={[
                        { value: 'en', label: 'English' },
                        { value: 'hi', label: 'Hindi' },
                        { value: 'ca', label: 'Catalan' },
                      ]}
                      className="w-full"
                    />
                  </div>
                )}

                {/* Theme Toggle */}
                {showThemeToggle && onToggleTheme && (
                  <button
                    onClick={() => handleMenuItemClick(onToggleTheme)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} className="w-5 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm font-medium">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                  </button>
                )}

                {/* Extra Content */}
                {extraContent && (
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                    {extraContent}
                  </div>
                )}

                {/* Auth Buttons */}
                <div className="border-t border-gray-100 dark:border-gray-700">
                  {user ? (
                    <button
                      onClick={() => handleMenuItemClick(onLogout)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <FontAwesomeIcon icon={faRightFromBracket} className="w-5" />
                      <span className="text-sm font-medium">Log Out</span>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleMenuItemClick(onLogin)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <FontAwesomeIcon icon={faRightToBracket} className="w-5 text-gray-600 dark:text-gray-400" />
                        <span className="text-sm font-medium">Log In</span>
                      </button>
                      <button
                        onClick={() => handleMenuItemClick(onCreateAccount)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                      >
                        <FontAwesomeIcon icon={faUserPlus} className="w-5" />
                        <span className="text-sm font-medium">Sign Up</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
