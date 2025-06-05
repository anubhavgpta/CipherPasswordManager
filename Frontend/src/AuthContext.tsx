// AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  // Check for existing session on app load
  useEffect(() => {
    const storedAuth = sessionStorage.getItem('isAuthenticated');
    const storedUsername = sessionStorage.getItem('username');
    
    if (storedAuth === 'true' && storedUsername) {
      setIsAuthenticated(true);
      setUsername(storedUsername);
    }
  }, []);

  const login = (username: string) => {
    setIsAuthenticated(true);
    setUsername(username);
    sessionStorage.setItem('isAuthenticated', 'true');
    sessionStorage.setItem('username', username);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUsername(null);
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('username');
    
    // Clear any other user-specific data
    sessionStorage.clear();
    
    // Force a page reload to clear any cached state
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};