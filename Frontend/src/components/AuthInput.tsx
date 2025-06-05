
import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <label className="text-black text-base font-medium">
          {label}
        </label>
        <input
          ref={ref}
          className={cn(
            "w-full px-4 py-3 bg-gray-200 border-0 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

AuthInput.displayName = 'AuthInput';

export default AuthInput;
