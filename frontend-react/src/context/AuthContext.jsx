import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('gym_token');
            if (token) {
                try {
                    const response = await api.get('/auth/me');
                    setUser(response.user);
                } catch (err) {
                    localStorage.removeItem('gym_token');
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async ({ username, password }) => {
        const response = await api.post('/auth/login', { username, password });
        localStorage.setItem('gym_token', response.token);
        setUser(response.user);
        return response;
    };

    const logout = () => {
        localStorage.removeItem('gym_token');
        setUser(null);
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
