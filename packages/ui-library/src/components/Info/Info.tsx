import { Button } from '../../components/Button';
import React from 'react';

export interface InfoProps {
  open: boolean;
  title?: string;
  message: string;
  onClose: () => void;
}

export const Info: React.FC<InfoProps> = ({ open, title = 'Info', message, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black bg-opacity-40 backdrop-blur-sm transition-all">
      <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 w-full max-w-[95vw] sm:max-w-sm border border-gray-200 dark:border-gray-700 animate-fade-in">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <svg
            className="w-5 h-5 sm:w-7 sm:h-7 text-blue-500 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01" />
          </svg>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
        <p className="mb-4 sm:mb-6 text-sm sm:text-base text-gray-700 dark:text-gray-200 leading-relaxed">{message}</p>
        <div className="flex justify-end">
          <Button variant="primary" size="sm" onClick={onClose}>
            OK
          </Button>
        </div>
      </div>
    </div>
  );
};
