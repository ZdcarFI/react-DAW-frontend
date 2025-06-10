import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { ProductsPage } from './pages/products/ProductsPage';
import { CategoriesPage } from './pages/categories/CategoriesPage';
import { PermissionsPage } from './pages/permissions/PermissionsPage';

const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>

      <Route 
        path="/login" 
        element={user ? <Navigate to="/dashboard\" replace /> : <LoginPage />} 
      />
      <Route 
        path="/register" 
        element={user ? <Navigate to="/dashboard\" replace /> : <RegisterPage />} 
      />
      

      <Route 
        path="/dashboard" 
        element={user ? <DashboardPage /> : <Navigate to="/login\" replace />} 
      />
      <Route 
        path="/profile" 
        element={user ? <ProfilePage /> : <Navigate to="/login\" replace />} 
      />
      <Route 
        path="/products" 
        element={user ? <ProductsPage /> : <Navigate to="/login\" replace />} 
      />
      <Route 
        path="/categories" 
        element={user ? <CategoriesPage /> : <Navigate to="/login\" replace />} 
      />
      <Route 
        path="/permissions" 
        element={user ? <PermissionsPage /> : <Navigate to="/login\" replace />} 
      />
      

      <Route 
        path="/" 
        element={<Navigate to={user ? "/dashboard" : "/login"} replace />} 
      />
      <Route 
        path="*" 
        element={<Navigate to={user ? "/dashboard" : "/login"} replace />} 
      />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;