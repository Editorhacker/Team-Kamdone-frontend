// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ Shows if auth is restoring

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (err) {
        console.error('Error parsing stored user:', err);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }

    setLoading(false); // ✅ Auth state is ready
  }, []);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
  localStorage.setItem('user', JSON.stringify(userData));  // ✅ Ensure userData contains _id
    localStorage.setItem('token', userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${token}`,
  });

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, getAuthHeaders, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
