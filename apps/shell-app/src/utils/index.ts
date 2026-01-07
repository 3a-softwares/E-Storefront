import { getCurrentUser, ADMIN_APP_URL, SELLER_APP_URL } from '3a-ecommerce-utils';

// Configuration for micro-frontend mode
export const MFE_CONFIG = {
  useMicroFrontends: true,
  adminAppUrl: process.env.ADMIN_APP_URL || ADMIN_APP_URL,
  sellerAppUrl: process.env.SELLER_APP_URL || SELLER_APP_URL,
};

export const renderApp = (
  role: string,
  setActiveApp?: (app: 'admin' | 'seller' | null) => void
) => {
  const user = getCurrentUser();
  const userId = user?._id || user?.id || '';

  // If MFE mode is enabled and we have a state setter, use embedded mode
  if (MFE_CONFIG.useMicroFrontends && setActiveApp) {
    if (role === 'admin') {
      setActiveApp('admin');
    } else if (role === 'seller') {
      setActiveApp('seller');
    }
    return;
  }

  // Redirect mode - only pass userId, apps will fetch user details
  const params = new URLSearchParams();
  if (userId) params.append('userId', userId);

  if (role === 'admin') {
    window.location.href = `${MFE_CONFIG.adminAppUrl}?${params.toString()}`;
  } else if (role === 'seller') {
    window.location.href = `${MFE_CONFIG.sellerAppUrl}?${params.toString()}`;
  }
};

export const changeTheme = (theme: 'light' | 'dark') => {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

export * from './remoteLoader';
