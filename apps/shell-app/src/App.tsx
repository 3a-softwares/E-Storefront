import React, { useEffect, useState, Suspense } from 'react';
import { clearAuth, getCurrentUser } from '3a-ecommerce-utils';
import { Modal, Header, ToasterBox } from '3a-ecommerce-ui-library';
import { useUIStore } from './store/uiStore';
import { useTokenValidator } from './store/useTokenValidator';
import { changeTheme, renderApp } from './utils';

const Footer = React.lazy(() =>
  import('./components/Footer').then((m) => ({ default: (m as any).Footer ?? (m as any).default }))
);
const WelcomePage = React.lazy(() =>
  import('./components/WelcomePage').then((m) => ({
    default: (m as any).WelcomePage ?? (m as any).default,
  }))
) as React.LazyExoticComponent<
  React.ComponentType<{
    onSignupClick: () => void;
  }>
>;
const AuthForm = React.lazy(() =>
  import('./components/AuthForm').then((m) => ({
    default: (m as any).AuthForm ?? (m as any).default,
  }))
) as React.LazyExoticComponent<
  React.ComponentType<{
    initialMode: 'login' | 'signup';
    setAuthMode: React.Dispatch<React.SetStateAction<'login' | 'signup'>>;
    onSuccess: () => void;
  }>
>;

const App: React.FC = () => {
  const { theme, toggleTheme } = useUIStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [showToaster, setShowToaster] = useState(false);
  const [user, setUser] = useState<{ name: string } | undefined>(undefined);

  // Periodically validate token to implement sliding expiration
  useTokenValidator((updatedUser) => {
    if (updatedUser) {
      setUser({ name: updatedUser.name || updatedUser.email || 'User' });
    }
  });

  // Check user login status
  const checkUser = () => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser({ name: currentUser.name || currentUser.email || 'User' });
    } else {
      setUser(undefined);
    }
  };

  const verifyLogin = () => {
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.role) {
      renderApp(currentUser.role);
      return true;
    }
    return false;
  };

  const login = () => {
    const isLogin = verifyLogin();
    if (!isLogin) {
      setAuthMode('login');
      setShowAuthModal(true);
    }
  };

  const signup = () => {
    const isLogin = verifyLogin();
    if (!isLogin) {
      setAuthMode('signup');
      setShowAuthModal(true);
    }
  };

  const handleLogout = () => {
    clearAuth();
    setUser(undefined);
    window.location.reload();
  };

  useEffect(() => {
    changeTheme(theme);
  }, [theme]);

  useEffect(() => {
    checkUser();
    const params = new URLSearchParams(window.location.search);
    if (params.get('logout') === 'true') {
      clearAuth();
      setUser(undefined);
    }
    // Open auth modal for reset-password URL
    if (window.location.pathname === '/reset-password' && params.get('token')) {
      setAuthMode('login');
      setShowAuthModal(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-200">
      <Header
        user={user}
        onLogin={login}
        onLogout={handleLogout}
        onCreateAccount={signup}
        theme={theme}
        onToggleTheme={toggleTheme}
        showThemeToggle={true}
        showLanguageSelector={false}
      />
      <div className="flex flex-1">
        <main className="flex-1">
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
              </div>
            }
          >
            <WelcomePage onSignupClick={signup} />
          </Suspense>
        </main>
      </div>
      <Suspense fallback={<div />}>
        <Footer />
      </Suspense>

      <Modal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title={authMode === 'login' ? 'Login' : 'Sign Up'}
        size="md"
      >
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            </div>
          }
        >
          <AuthForm
            initialMode={authMode}
            setAuthMode={setAuthMode}
            onSuccess={() => setShowAuthModal(false)}
          />
        </Suspense>
      </Modal>

      {showToaster && (
        <ToasterBox
          message="Session expired. Please log in again."
          type="error"
          onClose={() => setShowToaster(false)}
        />
      )}
    </div>
  );
};

export default App;
