import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // Set default axios header
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    useEffect(() => {
        if (token) {
            fetchUser();
        } else {
            setLoading(false);
        }
    }, [token]);

    const fetchUser = async () => {
        try {
            const response = await axios.get('/api/user');
            // Laravel API resources wrap in "data" key when returned directly
            const userData = response.data?.data ?? response.data;
            setUser(userData);
        } catch (error) {
            console.error('Failed to fetch user', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await axios.post('/api/login', { email, password });
            const { access_token, user: userFromApi } = response.data;
            // Handle wrapped user (e.g. from Resource in some setups)
            const user = userFromApi?.data ?? userFromApi;

            localStorage.setItem('token', access_token);
            setToken(access_token);
            setUser(user);
            axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

            return user;
        } catch (error) {
            console.error('Login failed', error);
            throw error;
        }
    };

    const register = async (name, email, password, password_confirmation) => {
        try {
            const response = await axios.post('/api/register', {
                name,
                email,
                password,
                password_confirmation
            });
            const { access_token, user } = response.data;

            localStorage.setItem('token', access_token);
            setToken(access_token);
            setUser(user);
            axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

            return true;
        } catch (error) {
            console.error('Registration failed', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await axios.post('/api/logout');
        } catch (error) {
            // Ignore error on logout
        } finally {
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
            delete axios.defaults.headers.common['Authorization'];
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
