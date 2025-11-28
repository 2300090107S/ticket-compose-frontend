import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

export const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

// Enhanced mock token with user ID
const createMockToken = (email, userId) => {
    let role = "USER";
    if (email.toLowerCase().includes('admin')) role = "ADMIN";
    if (email.toLowerCase().includes('manager')) role = "MANAGER";

    const mockPayload = {
        sub: email,
        userId: userId,
        role: role,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // 24 hours
    };
    return `mock-header.${btoa(JSON.stringify(mockPayload))}.mock-signature`;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedUser = jwtDecode(token);
        if (decodedUser.exp * 1000 > Date.now()) {
            setUser(decodedUser);
        } else {
            localStorage.removeItem('token');
        }
      }
    } catch (error) {
      console.error("Token decoding failed:", error);
      localStorage.removeItem('token');
    } finally {
        setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    try {
      // Step 1: Validate credentials with backend
      await api.post('/auth/login', credentials);

      // Step 2: Get user details to extract ID
      const userResponse = await api.get(`/users/me?email=${credentials.email}`);
      const currentUser = userResponse.data;
      
      if (!currentUser) {
        throw new Error("User not found");
      }

      if (!currentUser.approved) {
        throw new Error("Your account is pending approval from admin.");
      }

      // Step 3: Create token with user ID
      const token = createMockToken(credentials.email, currentUser.id);
      const decodedUser = jwtDecode(token);
      
      localStorage.setItem('token', token);
      localStorage.setItem('userId', currentUser.id.toString());
      setUser(decodedUser);

    } catch (error) {
      console.error("Login failed:", error);
      throw new Error(error.message || "Invalid credentials or account not approved.");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  };

  const value = { user, loading, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};