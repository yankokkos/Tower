import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[#00FF41]">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-2 
          bg-[#1A1A1A] 
          border-2 border-[#00FF41] 
          text-white 
          rounded 
          placeholder:text-[#666666]
          focus:outline-none 
          focus:shadow-[0_0_10px_rgba(0,255,65,0.5)]
          transition-shadow
          ${error ? 'border-[#FF0033]' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <span className="text-[#FF0033]">{error}</span>
      )}
    </div>
  )
}
