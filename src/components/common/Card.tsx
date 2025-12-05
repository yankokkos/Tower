import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  glowOnHover?: boolean
}

export function Card({ children, className = '', glowOnHover = false }: CardProps) {
  return (
    <div 
      className={`
        bg-[#0A0A0A] 
        border-2 border-[#00FF41] 
        rounded 
        p-6 
        ${glowOnHover ? 'hover:shadow-[0_0_20px_rgba(0,255,65,0.5)] transition-shadow' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}
