'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/utils/cn'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'quantum' | 'neural' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  glow?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, glow, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(
          // Base styles
          'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]',
          
          // Size variants
          {
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-4 py-2 text-base': size === 'md',
            'px-6 py-3 text-lg': size === 'lg',
          },
          
          // Color variants
          {
            'bg-quantum-600 text-white hover:bg-quantum-700 focus:ring-quantum-500 shadow-lg shadow-quantum-500/25': variant === 'primary',
            'bg-slate-200 text-slate-900 hover:bg-slate-300 focus:ring-slate-500': variant === 'secondary',
            'bg-gradient-to-r from-quantum-600 to-neural-600 text-white hover:from-quantum-700 hover:to-neural-700 focus:ring-quantum-500 shadow-lg': variant === 'quantum',
            'bg-gradient-to-r from-neural-600 to-frequency-dna text-white hover:from-neural-700 hover:to-purple-700 focus:ring-neural-500 shadow-lg': variant === 'neural',
            'border border-quantum-600 text-quantum-600 hover:bg-quantum-50 focus:ring-quantum-500': variant === 'outline',
          },
          
          // Glow effect
          {
            'relative animate-pulse-glow': glow,
          },
          
          className
        )}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading && (
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }