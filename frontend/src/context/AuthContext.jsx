import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                try {
                    const userData = await api.getWithToken('/auth/me', storedToken);
                    setUser(userData);
                    setToken(storedToken);
                } catch (error) {
                    console.error('Token validation failed:', error);
                    localStorage.removeItem('token');
                    setToken(null);
                    setUser(null);
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', response.token);
            setToken(response.token);
            setUser(response);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message || 'Login failed' };
        }
    };

    const register = async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            localStorage.setItem('token', response.token);
            setToken(response.token);
            setUser(response);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message || 'Registration failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const isAdmin = () => user?.role === 'ADMIN';
    const isDoctor = () => user?.role === 'DOCTOR';
    const isPatient = () => user?.role === 'PATIENT';
    const isPharmacist = () => user?.role === 'PHARMACIST';
    const isNurse = () => user?.role === 'NURSE';

    const hasRole = (roles) => {
        if (!user) return false;
        if (typeof roles === 'string') return user.role === roles;
        return roles.includes(user.role);
    };

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAdmin,
        isDoctor,
        isPatient,
        isPharmacist,
        isNurse,
        hasRole,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
