import React from 'react';

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface RadioProps {
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  name: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  orientation?: 'vertical' | 'horizontal';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'card';
  className?: string;
}

export const Radio: React.FC<RadioProps> = ({
  options,
  value,
  onChange,
  name,
  label,
  error,
  disabled = false,
  orientation = 'vertical',
  size = 'md',
  variant = 'default',
  className = '',
}) => {
  const handleChange = (optionValue: string) => {
    if (onChange && !disabled) {
      onChange(optionValue);
    }
  };

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const containerClasses = orientation === 'horizontal' ? 'flex flex-wrap gap-3' : 'space-y-3';

  return (
    <div className={className}>
      {label && (
        <label className="block text-[16px] font-semibold text-gray-900 mb-3">{label}</label>
      )}

      <div className={containerClasses}>
        {options.map((option) => {
          const isChecked = value === option.value;
          const isDisabled = disabled || option.disabled;

          if (variant === 'card') {
            return (
              <label
                key={option.value}
                className={`
                  flex items-center p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all touch-manipulation
                  ${isChecked ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}
                  ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                  ${orientation === 'horizontal' ? 'flex-1 min-w-[150px] sm:min-w-[200px]' : 'w-full'}
                `}
              >
                <input
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={isChecked}
                  onChange={() => handleChange(option.value)}
                  disabled={isDisabled}
                  className={`${sizeClasses[size]} text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500`}
                />
                {option.icon && <span className="ml-3 text-xl">{option.icon}</span>}
                <div className={`ml-3 ${option.icon ? 'ml-2' : ''}`}>
                  <p className={`font-medium text-gray-900 ${textSizeClasses[size]}`}>
                    {option.label}
                  </p>
                  {option.description && (
                    <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                  )}
                </div>
              </label>
            );
          }

          return (
            <label
              key={option.value}
              className={`
                flex items-start cursor-pointer
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}
                ${orientation === 'horizontal' ? 'flex-1' : ''}
                p-2 rounded transition-colors
              `}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={isChecked}
                onChange={() => handleChange(option.value)}
                disabled={isDisabled}
                className={`${sizeClasses[size]} text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500 mt-0.5`}
              />
              {option.icon && <span className="ml-3 text-xl">{option.icon}</span>}
              <div className={`ml-3 ${option.icon ? 'ml-2' : ''}`}>
                <p className={`font-medium text-gray-900 ${textSizeClasses[size]}`}>
                  {option.label}
                </p>
                {option.description && (
                  <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                )}
              </div>
            </label>
          );
        })}
      </div>

      {error && <p className="mt-2 text-sm font-semibold text-red-700">{error}</p>}
    </div>
  );
};

Radio.displayName = 'Radio';
