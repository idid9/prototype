import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAdminAuthenticated: boolean;
  loginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  loginWithPassword: (password: string) => boolean;
  logout: () => void;
  adminUser: { name: string; email: string; role: string } | null;
}

const AuthContext = createContext<AuthContextType>({
  isAdminAuthenticated: false,
  loginModalOpen: false,
  openLoginModal: () => {},
  closeLoginModal: () => {},
  loginWithPassword: () => false,
  logout: () => {},
  adminUser: null,
});

const AUTH_STORAGE_KEY = 'tourflow_admin_auth_v1';
const DEMO_PASSWORD = '12341234';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
    }
    return false;
  });

  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const adminUser = isAdminAuthenticated
    ? {
        name: 'Sari Al-Otaibi',
        email: 'admin@tourflow.sa',
        role: 'Platform Administrator',
      }
    : null;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_STORAGE_KEY, isAdminAuthenticated ? 'true' : 'false');
    }
  }, [isAdminAuthenticated]);

  const openLoginModal = () => setLoginModalOpen(true);
  const closeLoginModal = () => setLoginModalOpen(false);

  const loginWithPassword = (password: string): boolean => {
    if (password === DEMO_PASSWORD) {
      setIsAdminAuthenticated(true);
      setLoginModalOpen(false);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdminAuthenticated(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAdminAuthenticated,
        loginModalOpen,
        openLoginModal,
        closeLoginModal,
        loginWithPassword,
        logout,
        adminUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
