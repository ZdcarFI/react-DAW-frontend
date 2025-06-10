import {
    AuthenticationRequest,
    AuthenticationResponse,
    User,
    SaveUser,
    RegisteredUser,
    JwtPayload
} from '../types/auth';
import {apiService} from './api';

class AuthService {
    async authenticate(credentials: AuthenticationRequest): Promise<AuthenticationResponse> {
        return apiService.post<AuthenticationResponse>('/auth/authenticate', credentials);
    }

    async register(userData: SaveUser): Promise<RegisteredUser> {
        return apiService.post<RegisteredUser>('/customers', userData);
    }

    async validateToken(token: string): Promise<boolean> {

        return await apiService.get<boolean>('/auth/validate-token', {jwt: token});

    }

    // Decode JWT token to extract user information
    decodeJwtToken(token: string): JwtPayload | null {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(jsonPayload) as JwtPayload;
        } catch (error) {
            console.error('Error decoding JWT token:', error);
            return null;
        }
    }

    // Convert JWT payload to User object
    jwtPayloadToUser(payload: JwtPayload): User {
        // Extract permissions from authorities (filter out ROLE_ prefix)
        const permissions = payload.authorities
            .filter(auth => !auth.authority.startsWith('ROLE_'))
            .map((auth, index) => ({
                id: index + 1,
                operation: {
                    id: index + 1,
                    name: auth.authority,
                    path: '',
                    httpMethod: '',
                    module: {
                        id: 1,
                        name: 'GENERAL',
                        basePath: '/api/v1'
                    }
                }
            }));

        return {
            id: 1, // JWT doesn't contain ID, using default
            username: payload.sub,
            name: payload.name,
            role: {
                id: 1,
                name: payload.role,
                permissions: permissions
            }
        };
    }

    async getProfile(): Promise<User> {
        return apiService.get<User>('/auth/profile');
    }

    async logout(): Promise<void> {
        return apiService.post<void>('/auth/logout');
    }
}

export const authService = new AuthService();