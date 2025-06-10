import React, {ReactNode} from 'react';
import {useAuth} from '../../context/AuthContext';
import {Alert} from '../ui/Alert';

interface ProtectedRouteProps {
    children: ReactNode;
    permission?: string;
    fallback?: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
                                                                  children,
                                                                  permission,
                                                                  fallback
                                                              }) => {
    const {user, hasPermission} = useAuth();

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Alert type="error">
                    Debes iniciar sesión para acceder a esta página.
                </Alert>
            </div>
        );
    }

    if (permission && !hasPermission(permission)) {
        if (fallback) {
            return <>{fallback}</>;
        }

        return (
            <div className="flex items-center justify-center min-h-screen">
                <Alert type="error">
                    No tienes permiso para acceder a esta página.
                </Alert>
            </div>
        );
    }

    return <>{children}</>;
};