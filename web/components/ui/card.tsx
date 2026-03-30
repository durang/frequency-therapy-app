'use client'

import { HTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'quantum' | 'neural' | 'glass'
  glow?: boolean
}

const Card = ({ className, variant = 'default', glow, children, ...props }: CardProps) => {
  return (
    <div
      className={cn(
        'rounded-xl transition-all duration-300',
        
        // Variant styles
        {
          'bg-white border border-slate-200 shadow-lg dark:bg-slate-900 dark:border-slate-700': variant === 'default',
          'bg-gradient-to-br from-quantum-50 to-neural-50 border border-quantum-200 shadow-lg shadow-quantum-500/10 dark:from-quantum-950 dark:to-neural-950 dark:border-quantum-800': variant === 'quantum',
          'bg-gradient-to-br from-neural-50 to-purple-50 border border-neural-200 shadow-lg shadow-neural-500/10 dark:from-neural-950 dark:to-purple-950 dark:border-neural-800': variant === 'neural',
          'bg-white/10 backdrop-blur-md border border-white/20 shadow-lg': variant === 'glass',
        },
        
        // Glow effect
        {
          'neural-glow': glow,
        },
        
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const CardHeader = ({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn('p-6 pb-4', className)} {...props}>
      {children}
    </div>
  )
}

const CardContent = ({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn('p-6 pt-0', className)} {...props}>
      {children}
    </div>
  )
}

const CardFooter = ({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn('p-6 pt-4 flex items-center justify-between', className)} {...props}>
      {children}
    </div>
  )
}

const CardTitle = ({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) => {
  return (
    <h3 className={cn('text-xl font-semibold text-slate-900 dark:text-white', className)} {...props}>
      {children}
    </h3>
  )
}

const CardDescription = ({ className, children, ...props }: HTMLAttributes<HTMLParagraphElement>) => {
  return (
    <p className={cn('text-sm text-slate-600 dark:text-slate-400 mt-2', className)} {...props}>
      {children}
    </p>
  )
}

export { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription }