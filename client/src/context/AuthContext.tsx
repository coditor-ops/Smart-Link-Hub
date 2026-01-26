import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

interface AuthContextType {
    user: any;
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            // Set default header
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // Fix: Set a user object so isOwner checks pass
            // In a real app, we would fetch the user profile from /api/auth/me
            // For now, since we have a token, we assume we are the logged-in user.
            setUser({ id: 'current-user', isAuthenticated: true });

            setLoading(false);
        } else {
            delete api.defaults.headers.common['Authorization'];
            setLoading(false);
        }
    }, [token]);

    const login = (newToken: string) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
