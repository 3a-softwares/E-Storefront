import { Button } from '../../components/Button';
import React from 'react';

export interface ToasterBoxProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  onClose?: () => void;
}

const typeStyles: Record<string, string> = {
  success: 'bg-green-50 border-green-500 text-green-800',
  error: 'bg-red-50 border-red-500 text-red-800',
  info: 'bg-blue-50 border-blue-500 text-blue-800',
  warning: 'bg-yellow-50 border-yellow-500 text-yellow-800',
};

export const ToasterBox: React.FC<ToasterBoxProps> = ({ message, type = 'info', onClose }) => {
  return (
    <div
      className={`fixed top-16 sm:top-20 left-2 right-2 sm:left-auto sm:right-2 z-50 min-w-0 sm:min-w-xs max-w-[calc(100vw-1rem)] sm:max-w-sm px-3 sm:px-5 py-3 sm:py-4 rounded-lg border-l-4 shadow-2xl flex items-start gap-2 sm:gap-3 transition-all duration-300 bg-white dark:bg-gray-800 ${typeStyles[type]}`}
      role="alert"
      style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)' }}
    >
      <div className="flex-shrink-0 mt-0.5 sm:mt-1">
        {type === 'error' && (
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 text-red-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
        {type === 'success' && (
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 text-green-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
        {type === 'info' && (
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01" />
          </svg>
        )}
        {type === 'warning' && (
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z"
            />
          </svg>
        )}
      </div>
      <div className="w-full text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100 mt-0.5 sm:mt-1">
        {message}
      </div>
      {onClose && (
        <Button variant="ghost" className='!w-auto' size="sm" onClick={onClose}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </Button>
      )}
    </div>
  );
};
