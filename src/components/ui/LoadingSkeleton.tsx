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
        <div 
          key={i} 
          className={`animate-pulse bg-[var(--secondary-hover-color)] rounded-2xl ${className}`}
          role="status"
          aria-label="Loading content"
        ></div>
      ))}
    </>
  );
};

export default LoadingSkeleton;