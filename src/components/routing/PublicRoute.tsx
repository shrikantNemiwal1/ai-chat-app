// src/components/routing/PublicRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useGlobalState } from '../../hooks/useGlobalContext';

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { auth } = useGlobalState();
  
  if (auth.isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

export default PublicRoute;
