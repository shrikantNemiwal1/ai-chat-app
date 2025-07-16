// src/components/ui/ToastContainer.tsx
import React, { useCallback } from 'react';
import Toast from './Toast';
import { useAppSelector, useAppDispatch } from '../../hooks/useRedux';
import { removeToast } from '../../redux/uiSlice';

const ToastContainer: React.FC = () => {
  const toasts = useAppSelector(state => state.ui.toasts);
  const dispatch = useAppDispatch();

  const handleRemoveToast = useCallback((id: number) => {
    dispatch(removeToast(id));
  }, [dispatch]);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col items-end max-w-sm w-full">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="w-full animate-in slide-in-from-right-5 fade-in duration-300"
        >
          <Toast {...toast} onClose={handleRemoveToast} />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;