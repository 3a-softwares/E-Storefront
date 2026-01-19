import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faCheck } from '@fortawesome/free-solid-svg-icons';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  variant?: 'outline' | 'filled' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  error?: boolean;
  className?: string;
  label?: string;
}

const variantClasses = {
  outline: 'border-2 border-gray-300 bg-white hover:border-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 dark:bg-gray-800 dark:border-gray-600 dark:hover:border-gray-500 dark:focus:border-blue-500',
  filled: 'border-0 bg-gray-100 hover:bg-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:bg-gray-800',
  underline: 'border-0 border-b-2 border-gray-400 bg-transparent hover:border-gray-600 focus:border-blue-600 dark:border-gray-500 dark:hover:border-gray-400',
};

const sizeClasses = {
  sm: 'pl-2 sm:pl-3 pr-8 sm:pr-10 py-1.5 text-xs sm:text-sm min-h-[36px] sm:min-h-[40px]',
  md: 'pl-3 sm:pl-4 pr-10 sm:pr-12 py-2 text-sm sm:text-base min-h-[40px] sm:min-h-[44px] w-full',
  lg: 'pl-4 sm:pl-5 pr-12 sm:pr-14 py-2.5 sm:py-3 text-base sm:text-lg min-h-[48px] sm:min-h-[56px]',
};

const iconSizeClasses = {
  sm: 'right-2 sm:right-3 text-xs',
  md: 'right-3 sm:right-4 text-sm',
  lg: 'right-4 sm:right-5 text-base',
};

const optionSizeClasses = {
  sm: 'px-3 py-2 text-xs sm:text-sm',
  md: 'px-4 py-2.5 text-sm sm:text-base',
  lg: 'px-5 py-3 text-base sm:text-lg',
};

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  variant = 'outline',
  size = 'md',
  disabled = false,
  error = false,
  className = '',
  label,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionClick = (optionValue: string, optionDisabled?: boolean) => {
    if (optionDisabled) return;
    if (onChange) {
      onChange(optionValue);
    }
    setIsOpen(false);
  };

  const selectedOption = options.find((opt) => opt.value === value);
  const errorClasses = error ? 'border-red-600 focus:border-red-600 focus:ring-red-200' : '';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700' : 'cursor-pointer';

  return (
    <div className="relative" ref={selectRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-900 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {/* Select Trigger */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`flex items-center justify-between text-left appearance-none rounded-lg transition-all duration-200 outline-none font-medium ${variantClasses[variant]} ${sizeClasses[size]} ${errorClasses} ${disabledClasses} ${className} ${selectedOption ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
            }`}
        >
          <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        </button>
        <div className={`absolute top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400 transition-transform duration-200 ${iconSizeClasses[size]} ${isOpen ? 'rotate-180' : ''}`}>
          <FontAwesomeIcon icon={faChevronDown} />
        </div>

        {/* Dropdown Options */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg shadow-xl overflow-hidden animate-fade-in">
            <div className="max-h-60 overflow-y-auto">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleOptionClick(option.value, option.disabled)}
                  disabled={option.disabled}
                  className={`w-full flex items-center justify-between text-left transition-colors duration-150 ${optionSizeClasses[size]} ${option.disabled
                      ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed bg-gray-50 dark:bg-gray-700/50'
                      : option.value === value
                        ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-semibold'
                        : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                >
                  <span className="truncate">{option.label}</span>
                  {option.value === value && (
                    <FontAwesomeIcon icon={faCheck} className="ml-2 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
