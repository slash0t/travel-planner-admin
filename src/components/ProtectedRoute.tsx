import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  // Adding logging to help debug the issue
  useEffect(() => {
    console.log('ProtectedRoute state:', { isAuthenticated, loading, path: location.pathname });
  }, [isAuthenticated, loading, location]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#e7e4dc]">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 border-4 border-t-[#ea2517] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-700">Загрузка...</span>
          </div>
        </div>
      </div>
    );
  }
  
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
}; 