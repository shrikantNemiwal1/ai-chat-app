// src/components/ui/ToastContainer.tsx
import React, { useCallback } from 'react';
import Toast from './Toast';
import { useGlobalDispatch, useGlobalState } from '../../hooks/useGlobalContext';

const ToastContainer: React.FC = () => {
  const { ui } = useGlobalState();
  const dispatch = useGlobalDispatch();

  const removeToast = useCallback((id: number) => {
    dispatch({ type: 'ui/removeToast', payload: id });
  }, [dispatch]);

  if (ui.toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col items-end max-w-sm w-full">
      {ui.toasts.map(toast => (
        <div
          key={toast.id}
          className="w-full animate-in slide-in-from-right-5 fade-in duration-300"
        >
          <Toast {...toast} onClose={removeToast} />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;