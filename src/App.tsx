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
import PrivateRoute from './components/PrivateRoute';

const AppRoutes: React.FC = () => {
    const { user } = useAuth();

    return (
        <Routes>
            <Route
                path="/login"
                element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />}
            />
            <Route
                path="/register"
                element={user ? <Navigate to="/dashboard" replace /> : <RegisterPage />}
            />

            <Route
                path="/dashboard"
                element={
                    <PrivateRoute>
                        <DashboardPage />
                    </PrivateRoute>
                }
            />
            <Route
                path="/profile"
                element={
                    <PrivateRoute>
                        <ProfilePage />
                    </PrivateRoute>
                }
            />
            <Route
                path="/products"
                element={
                    <PrivateRoute>
                        <ProductsPage />
                    </PrivateRoute>
                }
            />
            <Route
                path="/categories"
                element={
                    <PrivateRoute>
                        <CategoriesPage />
                    </PrivateRoute>
                }
            />
            <Route
                path="/permissions"
                element={
                    <PrivateRoute>
                        <PermissionsPage />
                    </PrivateRoute>
                }
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
