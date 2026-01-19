
export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const variantClasses = {
  primary: 'bg-blue-100 text-blue-900 border border-blue-200',
  secondary: 'bg-gray-100 text-gray-900 border border-gray-200',
  success: 'bg-green-100 text-green-900 border border-green-200',
  warning: 'bg-yellow-100 text-yellow-900 border border-yellow-200',
  error: 'bg-red-100 text-red-900 border border-red-200',
  info: 'bg-cyan-100 text-cyan-900 border border-cyan-200',
};

const sizeClasses = {
  sm: 'px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs',
  md: 'px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm',
  lg: 'px-3 sm:px-4 py-1 sm:py-1.5 text-sm sm:text-base',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center font-bold rounded-full ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </span>
  );
};
