import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    endIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, endIcon, id, ...props }, ref) => {
        return (
            <div className="w-full space-y-2">
                {label && (
                    <label
                        htmlFor={id}
                        className="text-sm font-semibold text-text-secondary ml-1"
                    >
                        {label}
                    </label>
                )}
                <div className="relative group">
                    <input
                        id={id}
                        className={cn(
                            "flex h-11 w-full rounded-xl border border-border bg-surface px-4 py-2 text-text-primary placeholder:text-text-muted transition-all outline-none",
                            "focus:border-primary focus:ring-1 focus:ring-primary shadow-sm",
                            "hover:border-primary/40",
                            error && "border-error focus:border-error focus:ring-error",
                            endIcon && "pr-12", // Add padding if icon exists
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                    {endIcon && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-placeholder hover:text-text-secondary transition-colors">
                            {endIcon}
                        </div>
                    )}
                </div>
                {error && (
                    <p className="text-xs text-error font-medium ml-1 animate-in slide-in-from-top-1 fade-in">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);
Input.displayName = "Input";
