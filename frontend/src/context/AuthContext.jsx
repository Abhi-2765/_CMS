import { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const data = await apiClient.get('/api/auth/me');
            setUser(data.user);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const data = await apiClient.post('/api/auth/login', { email, password });
        setUser(data.user); // token is set in httpOnly cookie
        return data.user;
    };

    const register = async (name, email, password) => {
        await apiClient.post('/api/auth/register', { name, email, password });
        return await login(email, password);
    };

    const logout = async () => {
        await apiClient.post('/api/auth/logout');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, checkAuth }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
