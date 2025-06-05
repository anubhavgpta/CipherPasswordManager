
import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
}

const AuthButton = ({ children, className, variant = 'primary', ...props }: AuthButtonProps) => {
  return (
    <button
      className={cn(
        "px-6 py-3 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
        variant === 'primary' && "bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500",
        variant === 'secondary' && "bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-500",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default AuthButton;
