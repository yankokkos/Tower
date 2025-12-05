import React from 'react'
import { X } from 'lucide-react'
import { Button } from './Button'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}

export function Modal({ isOpen, onClose, title, children, maxWidth = 'lg' }: ModalProps) {
  if (!isOpen) return null
  
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl'
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className={`w-full ${maxWidthClasses[maxWidth]} bg-[#0A0A0A] border-2 border-[#00FF41] rounded-lg shadow-[0_0_30px_rgba(0,255,65,0.5)] max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between p-6 border-b-2 border-[#00FF41]">
          <h2 className="text-[#00FF41]">{title}</h2>
          <button
            onClick={onClose}
            className="text-[#00FF41] hover:text-[#00CC33] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}
