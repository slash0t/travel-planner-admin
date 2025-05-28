import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RoutesPage from './pages/RoutesPage';
import ReviewsPage from './pages/ReviewsPage';
import HomePage from './pages/HomePage';
import Layout from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Wrapper component to handle authentication and redirection logic
const AppRoutes = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  
  // Debug logging
  useEffect(() => {
    console.log('App auth state:', { isAuthenticated, loading });
  }, [isAuthenticated, loading]);
  
  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated && window.location.pathname === '/login') {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="routes" element={<RoutesPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;