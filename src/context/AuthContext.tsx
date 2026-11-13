import React, { createContext, useContext, useState, useEffect } from 'react';
import { isFirebaseConfigured } from '../services/firebase/firestore';
import { DataService } from '../services/dataService';

export interface AdminProfile {
  name: string;
  nameAr: string;
  email: string;
  role: string;
  roleAr: string;
  photoURL?: string;
}

interface AuthContextType {
  isAdminAuthenticated: boolean;
  isCloudAdmin: boolean;
  authReady: boolean;
  loginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  loginWithPassword: (password: string) => boolean;
  logout: () => void;
  adminUser: AdminProfile | null;
}

const AuthContext = createContext<AuthContextType>({
  isAdminAuthenticated: false,
  isCloudAdmin: false,
  authReady: true,
  loginModalOpen: false,
  openLoginModal: () => {},
  closeLoginModal: () => {},
  loginWithPassword: () => false,
  logout: () => {},
  adminUser: null,
});

const AUTH_STORAGE_KEY = 'tourflow_admin_auth_v1';
const AUTH_BROADCAST_CHANNEL = 'tourflow_auth_sync';
const DEMO_PASSWORD = '12341234';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const firebaseEnabled = isFirebaseConfigured();

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
    }
    return false;
  });

  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const isCloudAdmin = isAdminAuthenticated && firebaseEnabled;

  const adminUser: AdminProfile | null = isAdminAuthenticated
    ? {
        name: 'Sari Al-Otaibi',
        nameAr: 'ساري العتيبي',
        email: 'admin@tourflow.sa',
        role: 'Platform Administrator',
        roleAr: 'مدير المنصة',
      }
    : null;

  // Keep DataService cloud listeners synchronized with Admin authentication state
  useEffect(() => {
    DataService.setAdminCloudMode(isCloudAdmin);
  }, [isCloudAdmin]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_STORAGE_KEY, isAdminAuthenticated ? 'true' : 'false');
    }
  }, [isAdminAuthenticated]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorage = (e: StorageEvent) => {
      if (e.key === AUTH_STORAGE_KEY) {
        setIsAdminAuthenticated(e.newValue === 'true');
      }
    };
    window.addEventListener('storage', handleStorage);

    let bc: BroadcastChannel | null = null;
    if ('BroadcastChannel' in window) {
      bc = new BroadcastChannel(AUTH_BROADCAST_CHANNEL);
      bc.onmessage = (event) => {
        if (typeof event.data === 'boolean') {
          setIsAdminAuthenticated(event.data);
          if (event.data) setLoginModalOpen(false);
        }
      };
    }

    return () => {
      window.removeEventListener('storage', handleStorage);
      bc?.close();
    };
  }, []);

  const broadcastAuth = (authed: boolean) => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        const bc = new BroadcastChannel(AUTH_BROADCAST_CHANNEL);
        bc.postMessage(authed);
        bc.close();
      } catch {
        // Ignore BroadcastChannel errors
      }
    }
  };

  const openLoginModal = () => setLoginModalOpen(true);
  const closeLoginModal = () => setLoginModalOpen(false);

  const loginWithPassword = (password: string): boolean => {
    if (password === DEMO_PASSWORD) {
      setIsAdminAuthenticated(true);
      setLoginModalOpen(false);
      broadcastAuth(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdminAuthenticated(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    broadcastAuth(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAdminAuthenticated,
        isCloudAdmin,
        authReady: true,
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
