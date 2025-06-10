import React, {createContext, useContext, useState, useEffect, ReactNode} from 'react';
import {User, AuthenticationRequest, SaveUser} from '../types/auth';
import {authService} from '../services/authService';

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (credentials: AuthenticationRequest) => Promise<void>;
    register: (userData: SaveUser) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
    hasPermission: (permission: string) => boolean;
    isAdmin: () => boolean;
    isAssistantAdmin: () => boolean;
    isCustomer: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                try {

                    const isValid = await authService.validateToken(storedToken);
                    if (isValid) {
                        // Decode JWT to get user information
                        const jwtPayload = authService.decodeJwtToken(storedToken);
                        if (jwtPayload) {
                            const userData = authService.jwtPayloadToUser(jwtPayload);
                            setUser(userData);
                            setToken(storedToken);
                        } else {
                            // If can't decode, remove invalid token
                            localStorage.removeItem('token');
                            setToken(null);
                        }
                    } else {

                        localStorage.removeItem('token');
                        setToken(null);
                    }
                } catch (error) {
                    console.error('Auth initialization error:', error);
                    localStorage.removeItem('token');
                    setToken(null);
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (credentials: AuthenticationRequest): Promise<void> => {

        const response = await authService.authenticate(credentials);
        const jwtToken = response.jwt;


        const jwtPayload = authService.decodeJwtToken(jwtToken);
        if (!jwtPayload) {
            throw new Error('Token inválida recibida');
        }

        const userData = authService.jwtPayloadToUser(jwtPayload);

        setToken(jwtToken);
        setUser(userData);
        localStorage.setItem('token', jwtToken);

    };

    const register = async (userData: SaveUser): Promise<void> => {

        const response = await authService.register(userData);
        const jwtToken = response.jwt;


        const jwtPayload = authService.decodeJwtToken(jwtToken);
        if (!jwtPayload) {
            throw new Error('Token inválida recibida');
        }

        const userInfo = authService.jwtPayloadToUser(jwtPayload);

        setToken(jwtToken);
        setUser(userInfo);
        localStorage.setItem('token', jwtToken);

    };

    const logout = async (): Promise<void> => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            setToken(null);
            localStorage.removeItem('token');
        }
    };

    const hasPermission = (permission: string): boolean => {
        if (!user || !user.role || !user.role.permissions) return false;

        return user.role.permissions.some(
            p => p.operation.name === permission
        );
    };

    const isAdmin = (): boolean => {
        return user?.role?.name === 'ADMINISTRATOR';
    };

    const isAssistantAdmin = (): boolean => {
        return user?.role?.name === 'ASSISTANT_ADMINISTRATOR';
    };

    const isCustomer = (): boolean => {
        return user?.role?.name === 'CUSTOMER';
    };

    const value: AuthContextType = {
        user,
        token,
        login,
        register,
        logout,
        loading,
        hasPermission,
        isAdmin,
        isAssistantAdmin,
        isCustomer,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};