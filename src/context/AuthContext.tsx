import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '../services/AuthService';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (phoneNumber: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated on mount
    const token = AuthService.getAccessToken();
    setIsAuthenticated(!!token);
  }, []);

  const login = async (phoneNumber: string) => {
    try {
      const response = await AuthService.login(phoneNumber);
      if (response.token) {
        setIsAuthenticated(true);
        // Store the phone number in localStorage
        localStorage.setItem('phoneNumber', phoneNumber);
      }
    } catch (error) {
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    AuthService.logout();
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};