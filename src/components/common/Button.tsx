import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  ...props 
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center gap-2 rounded transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variantClasses = {
    primary: 'bg-black border-2 border-[#00FF41] text-[#00FF41] hover:bg-[#00FF41] hover:text-black hover:shadow-[0_0_20px_rgba(0,255,65,0.8)]',
    secondary: 'bg-[#1A1A1A] border border-[#00FF41] text-[#00FF41] hover:bg-[#0A0A0A]',
    ghost: 'bg-transparent border border-transparent text-[#00FF41] hover:border-[#00FF41]',
    danger: 'bg-black border-2 border-[#FF0033] text-[#FF0033] hover:bg-[#FF0033] hover:text-white'
  }
  
  const sizeClasses = {
    sm: 'px-3 py-1.5',
    md: 'px-4 py-2',
    lg: 'px-6 py-3'
  }
  
  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
