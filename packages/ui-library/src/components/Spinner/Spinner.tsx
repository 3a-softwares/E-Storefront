

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fullScreen?: boolean;
}

const sizeClasses = {
  sm: 'w-4 h-4 sm:w-5 sm:h-5',
  md: 'w-6 h-6 sm:w-8 sm:h-8',
  lg: 'w-10 h-10 sm:w-12 sm:h-12',
  xl: 'w-12 h-12 sm:w-16 sm:h-16',
};

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  className = '',
  fullScreen = false,
}) => {
  const spinner = (
    <svg
      className={`animate-spin ${sizeClasses[size]} text-blue-600 ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};
