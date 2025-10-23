'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertTriangle, X } from 'lucide-react'

interface AlertModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'success' | 'error' | 'warning'
  title: string
  message: string
  confirmText?: string
  onConfirm?: () => void
}

export default function AlertModal({
  isOpen,
  onClose,
  type,
  title,
  message,
  confirmText = 'OK',
  onConfirm
}: AlertModalProps) {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm()
    }
    onClose()
  }

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-500" />
      case 'error':
        return <XCircle className="w-8 h-8 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-8 h-8 text-yellow-500" />
      default:
        return <CheckCircle className="w-8 h-8 text-green-500" />
    }
  }

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      default:
        return 'bg-green-50 border-green-200'
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className={`relative bg-white rounded-2xl shadow-2xl border-2 max-w-md w-full p-6 ${getBgColor()}`}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
            
            {/* Content */}
            <div className="text-center">
              <div className="mb-4">
                {getIcon()}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {title}
              </h3>
              
              <p className="text-gray-600 mb-6">
                {message}
              </p>
              
              <div className="flex gap-3 justify-center">
                {type === 'warning' && (
                  <button
                    onClick={onClose}
                    className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={handleConfirm}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    type === 'success'
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : type === 'error'
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                  }`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
