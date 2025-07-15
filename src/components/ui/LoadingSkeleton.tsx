// src/components/ui/LoadingSkeleton.tsx
import React from 'react';

interface LoadingSkeletonProps {
  count?: number;
  className?: string;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ count = 1, className = '' }) => {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div key={i} className={`animate-pulse bg-slate-300 dark:bg-slate-700 rounded-md ${className}`}></div>
      ))}
    </>
  );
};

export default LoadingSkeleton;