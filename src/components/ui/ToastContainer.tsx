// src/components/ui/ToastContainer.tsx
import React, { useCallback } from 'react';
import Toast from './Toast';
import { useGlobalDispatch, useGlobalState } from '../../App';

const ToastContainer: React.FC = () => {
  const { ui } = useGlobalState();
  const dispatch = useGlobalDispatch();

  const removeToast = useCallback((id: number) => {
    dispatch({ type: 'ui/removeToast', payload: id });
  }, [dispatch]);

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col items-end">
      {ui.toasts.map(toast => (
        <Toast key={toast.id} {...toast} onClose={removeToast} />
      ))}
    </div>
  );
};

export default ToastContainer;