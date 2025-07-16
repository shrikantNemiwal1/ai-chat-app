// src/components/routing/RootRedirect.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useRedux';

const RootRedirect: React.FC = () => {
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  
  return <Navigate to={isAuthenticated ? "/dashboard" : "/signup"} replace />;
};

export default RootRedirect;
