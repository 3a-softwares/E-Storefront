import React from 'react';
import { Header as UIHeader } from '3a-ecommerce-ui-library';
import { useUIStore } from '../store/uiStore';
import { useAppDispatch, useAppSelector } from '../store/store';
import { logout } from '../store/authSlice';
import { SHELL_APP_URL, clearAuth } from '3a-ecommerce-utils';

export const Header: React.FC = () => {
  const { theme, toggleTheme, language, setLanguage } = useUIStore();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    clearAuth();
    window.location.href = `${SHELL_APP_URL}?logout=true`;
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-40 shadow bg-white dark:bg-gray-900">
      <UIHeader
        appName="Admin Portal"
        theme={theme}
        onToggleTheme={toggleTheme}
        language={language}
        onLanguageChange={setLanguage}
        user={user ? { name: user.name } : undefined}
        onLogout={handleLogout}
      />
    </div>
  );
};
