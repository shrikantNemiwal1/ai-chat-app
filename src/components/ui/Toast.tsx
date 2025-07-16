// src/components/ui/Toast.tsx
import React, { useEffect } from 'react';
import type { Toast as ToastType } from '../../types'; // Renamed to avoid conflict

interface ToastProps extends ToastType {
  onClose: (id: number) => void;
}

const Toast: React.FC<ToastProps> = ({ id, message, type, onClose }) => {
  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-600 hover:bg-green-700';
      case 'error':
        return 'bg-red-600 hover:bg-red-700';
      case 'info':
        return 'bg-blue-600 hover:bg-blue-700';
      default:
        return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 4000); // Increased to 4 seconds for better UX
    return () => clearTimeout(timer);
  }, [id, onClose]);

  return (
    <div 
      className={`p-4 rounded-2xl text-white text-sm flex items-center justify-between mb-3 transition-all duration-300 shadow-lg border-none ${getToastStyles()}`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center">
        <span className="material-symbols-rounded mr-2 text-lg">
          {type === 'success' && 'check_circle'}
          {type === 'error' && 'error'}
          {type === 'info' && 'info'}
        </span>
        <span className="font-medium">{message}</span>
      </div>
      <button 
        onClick={() => onClose(id)} 
        className="ml-4 text-white hover:text-gray-200 transition-colors duration-200 p-1 rounded-full hover:bg-white/20 focus:outline-none focus:bg-white/20"
        aria-label="Close notification"
      >
        <span className="material-symbols-rounded text-lg">close</span>
      </button>
    </div>
  );
};

export default Toast;
