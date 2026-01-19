import { Button } from '../../components/Button';
import React, { useState } from 'react';

export interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  variant?: 'outline' | 'filled' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  error?: boolean;
  maxHeight?: string;
  className?: string;
}

const variantClasses = {
  outline:
    'border-2 border-gray-300 bg-white hover:border-gray-400 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-200',
  filled:
    'border-0 bg-gray-100 hover:bg-gray-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-200',
  underline:
    'border-0 border-b-2 border-gray-400 bg-transparent hover:border-gray-600 focus-within:border-blue-600',
};

const sizeClasses = {
  sm: 'px-2 sm:px-3 py-1.5 text-xs sm:text-sm',
  md: 'px-3 sm:px-4 py-2 text-sm sm:text-base',
  lg: 'px-4 sm:px-5 py-2.5 sm:py-3 text-base sm:text-lg',
};

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value = [],
  onChange,
  placeholder = 'Select options',
  variant = 'outline',
  size = 'md',
  disabled = false,
  error = false,
  maxHeight = '200px',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (optionValue: string) => {
    if (disabled) return;

    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];

    if (onChange) {
      onChange(newValue);
    }
  };

  const handleRemove = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onChange) {
      onChange(value.filter((v) => v !== optionValue));
    }
  };

  const selectedLabels = options.filter((opt) => value.includes(opt.value)).map((opt) => opt.label);

  const errorClasses = error
    ? 'border-red-500 focus-within:border-red-500 focus-within:ring-red-200'
    : '';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  return (
    <div className={`relative ${className}`}>
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`rounded-lg transition-all duration-200 outline-none ${variantClasses[variant]} ${sizeClasses[size]} ${errorClasses} ${disabledClasses} flex flex-wrap gap-1.5 sm:gap-2 items-center min-h-[44px] sm:min-h-[40px] touch-manipulation`}
      >
        {value.length === 0 ? (
          <span className="text-gray-500 font-medium">{placeholder}</span>
        ) : (
          selectedLabels.map((label, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-900 border border-blue-200 rounded-lg text-sm font-semibold"
            >
              {label}
              <Button variant="ghost" size="sm" onClick={(e: any) => handleRemove(value[index], e)}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </Button>
            </span>
          ))
        )}
        <span className="ml-auto">▼</span>
      </div>

      {isOpen && !disabled && (
        <div
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg"
          style={{ maxHeight }}
        >
          <div className="overflow-auto" style={{ maxHeight }}>
            {options.map((option) => (
              <label
                key={option.value}
                className={`flex items-center px-4 py-2 hover:bg-blue-50 cursor-pointer text-gray-900 font-medium ${
                  option.disabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={value.includes(option.value)}
                  onChange={() => handleToggle(option.value)}
                  disabled={option.disabled}
                  className="mr-3 h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
