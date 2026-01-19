import { Button } from '../../components/Button';
import React from 'react';
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-[95vw] sm:max-w-md',
    md: 'max-w-[95vw] sm:max-w-lg',
    lg: 'max-w-[95vw] sm:max-w-2xl',
    xl: 'max-w-[95vw] sm:max-w-4xl',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-300 bg-opacity-75 backdrop-blur-sm dark:bg-gray-900 dark:bg-opacity-80 !mt-0"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`bg-white rounded-xl shadow-2xl ${sizeClasses[size]} w-full max-h-[90vh] dark:bg-gray-800`}
        onClick={(e: any) => e.stopPropagation()}
      >
        {(title || showCloseButton) && (
          <div className="rounded-t-xl flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-700">
            {title && <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>}
            {showCloseButton && (
              <Button variant="outline" className="!w-auto" size="sm" onClick={onClose}>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        )}
        <div className="p-4 sm:p-6 text-gray-800 dark:text-gray-200 overflow-auto max-h-[70vh] sm:max-h-[80vh]">{children}</div>
      </div>
    </div>
  );
};
