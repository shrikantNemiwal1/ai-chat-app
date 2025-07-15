// src/components/ui/Toast.tsx
import React, { useEffect } from 'react';
import type { Toast as ToastType } from '../../types'; // Renamed to avoid conflict

interface ToastProps extends ToastType {
  onClose: (id: number) => void;
}

const Toast: React.FC<ToastProps> = ({ id, message, type, onClose }) => {
  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  }[type] || 'bg-gray-700';

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 3000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  return (
    <div className={`p-3 rounded-lg shadow-lg text-white text-sm flex items-center justify-between ${bgColor} mb-2`}>
      <span>{message}</span>
      <button onClick={() => onClose(id)} className="ml-4 text-white hover:text-gray-200">
        &times;
      </button>
    </div>
  );
};

export default Toast;