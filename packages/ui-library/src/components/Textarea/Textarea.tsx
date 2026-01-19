import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', ...props }, ref) => (
    <div className="w-full mb-3 sm:mb-4">
      {label && (
        <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-500 transition-colors dark:bg-gray-700 dark:text-white resize-none text-sm sm:text-base min-h-[100px] sm:min-h-[120px] ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
);

Textarea.displayName = 'Textarea';
