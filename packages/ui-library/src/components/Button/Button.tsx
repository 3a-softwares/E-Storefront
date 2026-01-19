import React from 'react';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  fullWidth = true,
  className = '',
}) => {
  const baseClasses =
    'cursor-pointer min-w-fit font-semibold rounded-lg transition-all duration-150 inline-flex items-center justify-center gap-1 disabled:cursor-not-allowed disabled:opacity-50';

  const variantClasses = {
    primary:
      'bg-gray-800 hover:bg-gray-600 active:bg-gray-800 text-white shadow-sm hover:shadow-md focus:ring-gray-500 border-2 border-gray-600 dark:bg-gray-600 dark:hover:bg-gray-400 dark:active:bg-gray-200 dark:text-gray-900 dark:border-gray-600 dark:hover:border-gray-400',
    secondary:
      'bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-900 border-2 border-gray-600 hover:border-gray-400 shadow-sm hover:shadow-md focus:ring-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 dark:active:bg-gray-700 dark:text-white dark:border-gray-700 dark:hover:border-gray-600',
    outline:
      'bg-transparent hover:bg-gray-50 active:bg-gray-100 text-gray-900 border-2 border-gray-600 hover:border-gray-900 focus:ring-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600 dark:active:bg-gray-700 dark:text-white dark:border-gray-700 dark:hover:border-gray-600',
    ghost:
      'underline bg-transparent hover:bg-gray-100 active:bg-gray-200 text-gray-900 focus:ring-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 dark:active:bg-gray-700 dark:text-white',
  };

  const sizeClasses = {
    sm: 'text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 min-h-[32px] sm:min-h-[36px]',
    md: 'text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-2.5 min-h-[40px] sm:min-h-[44px]',
    lg: 'text-base sm:text-lg px-4 sm:px-6 py-3 sm:py-4 min-h-[48px] sm:min-h-[56px]',
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClasses = disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${disabledClasses} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && (
        <svg
          className="animate-spin h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};
