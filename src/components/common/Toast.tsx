import React, { useEffect } from 'react'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
  message: string
  type?: ToastType
  onClose: () => void
  duration?: number
}

export function Toast({ message, type = 'info', onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])
  
  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />
  }
  
  const colors = {
    success: 'border-[#00FF41] text-[#00FF41]',
    error: 'border-[#FF0033] text-[#FF0033]',
    warning: 'border-[#FF9900] text-[#FF9900]',
    info: 'border-[#00DDFF] text-[#00DDFF]'
  }
  
  const shadows = {
    success: 'shadow-[0_0_20px_rgba(0,255,65,0.4)]',
    error: 'shadow-[0_0_20px_rgba(255,0,51,0.4)]',
    warning: 'shadow-[0_0_20px_rgba(255,153,0,0.4)]',
    info: 'shadow-[0_0_20px_rgba(0,221,255,0.4)]'
  }
  
  return (
    <div className={`
      fixed top-6 right-6 z-50
      max-w-md
      bg-[#0A0A0A] border-2 ${colors[type]}
      rounded p-4
      ${shadows[type]}
      animate-slideIn
      flex items-start gap-3
    `}>
      <div className={colors[type]}>
        {icons[type]}
      </div>
      <p className="text-white flex-1">{message}</p>
      <button
        onClick={onClose}
        className="text-[#999999] hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

// Toast Manager Hook
export function useToast() {
  const [toasts, setToasts] = React.useState<Array<{
    id: string
    message: string
    type: ToastType
  }>>([])
  
  const showToast = (message: string, type: ToastType = 'info') => {
    const id = `toast-${Date.now()}`
    setToasts(prev => [...prev, { id, message, type }])
  }
  
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }
  
  const ToastContainer = () => (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  )
  
  return { showToast, ToastContainer }
}
