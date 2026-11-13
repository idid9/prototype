import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import {
  auth,
  db,
  googleProvider,
  isFirebaseConfigured,
  isAuthorizedAdminEmail,
} from '../services/firebase/firestore';
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
  authLoading: boolean;
  authError: string | null;
  clearAuthError: () => void;
  loginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  loginWithGoogle: () => Promise<boolean>;
  loginWithPassword: (password: string) => boolean;
  logout: () => Promise<void>;
  adminUser: AdminProfile | null;
}

const AuthContext = createContext<AuthContextType>({
  isAdminAuthenticated: false,
  isCloudAdmin: false,
  authReady: false,
  authLoading: false,
  authError: null,
  clearAuthError: () => {},
  loginModalOpen: false,
  openLoginModal: () => {},
  closeLoginModal: () => {},
  loginWithGoogle: async () => false,
  loginWithPassword: () => false,
  logout: async () => {},
  adminUser: null,
});

const AUTH_STORAGE_KEY = 'tourflow_admin_auth_v1';
const AUTH_BROADCAST_CHANNEL = 'tourflow_auth_sync';
const DEMO_PASSWORD = '12341234';

async function verifyAdminPrivileges(user: User): Promise<boolean> {
  if (!user.emailVerified) return false;
  if (isAuthorizedAdminEmail(user.email)) return true;
  if (db) {
    try {
      const adminDoc = await getDoc(doc(db, 'admins', user.uid));
      return adminDoc.exists();
    } catch {
      return false;
    }
  }
  return false;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const firebaseEnabled = isFirebaseConfigured();

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    if (!firebaseEnabled && typeof window !== 'undefined') {
      return localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
    }
    return false;
  });

  const [isCloudAdmin, setIsCloudAdmin] = useState<boolean>(false);
  const [authReady, setAuthReady] = useState<boolean>(!firebaseEnabled);
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const adminUser: AdminProfile | null = isAdminAuthenticated
    ? {
        name: firebaseUser?.displayName || 'Sari Al-Otaibi',
        nameAr: firebaseUser?.displayName || 'ساري العتيبي',
        email: firebaseUser?.email || 'admin@tourflow.sa',
        role: 'Platform Administrator',
        roleAr: 'مدير المنصة',
        photoURL: firebaseUser?.photoURL || undefined,
      }
    : null;

  // Listen to Firebase Authentication session across reloads
  useEffect(() => {
    if (!firebaseEnabled || !auth) {
      setAuthReady(true);
      return;
    }

    const firebaseAuth = auth;

    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (!user) {
        setFirebaseUser(null);
        setIsCloudAdmin(false);
        setIsAdminAuthenticated(false);
        setAuthReady(true);
        return;
      }

      const allowed = await verifyAdminPrivileges(user);
      if (allowed) {
        setFirebaseUser(user);
        setIsCloudAdmin(true);
        setIsAdminAuthenticated(true);
        setAuthError(null);
      } else {
        setFirebaseUser(null);
        setIsCloudAdmin(false);
        setIsAdminAuthenticated(false);
        setAuthError(`UNAUTHORIZED:${user.email || ''}`);
        await signOut(firebaseAuth).catch(() => {});
      }
      setAuthReady(true);
    });

    return () => unsubscribe();
  }, [firebaseEnabled]);

  // Synchronize DataService between Visitor public queries and Admin cloud mode
  useEffect(() => {
    if (!authReady) return;
    DataService.setAdminCloudMode(isCloudAdmin);
  }, [authReady, isCloudAdmin]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_STORAGE_KEY, isAdminAuthenticated ? 'true' : 'false');
    }
  }, [isAdminAuthenticated]);

  useEffect(() => {
    if (typeof window === 'undefined' || firebaseEnabled) return;

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
  }, [firebaseEnabled]);

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

  const clearAuthError = () => setAuthError(null);

  const openLoginModal = () => {
    setAuthError(null);
    setLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setAuthError(null);
    setLoginModalOpen(false);
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    if (!firebaseEnabled || !auth || !googleProvider) {
      setAuthError('CONFIG_MISSING');
      return false;
    }

    setAuthLoading(true);
    setAuthError(null);

    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const allowed = await verifyAdminPrivileges(cred.user);

      if (!allowed) {
        const attemptedEmail = cred.user.email || '';
        await signOut(auth).catch(() => {});
        setIsCloudAdmin(false);
        setIsAdminAuthenticated(false);
        setAuthError(`UNAUTHORIZED:${attemptedEmail}`);
        return false;
      }

      setFirebaseUser(cred.user);
      setIsCloudAdmin(true);
      setIsAdminAuthenticated(true);
      setLoginModalOpen(false);
      broadcastAuth(true);
      return true;
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        setAuthError(null);
      } else if (code === 'auth/popup-blocked') {
        setAuthError('POPUP_BLOCKED');
      } else {
        setAuthError(err?.message || 'SIGNIN_FAILED');
      }
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  const loginWithPassword = (password: string): boolean => {
    if (firebaseEnabled) {
      // Cloud mode requires verified Google authentication for Firestore security rules
      return false;
    }
    if (password === DEMO_PASSWORD) {
      setIsAdminAuthenticated(true);
      setLoginModalOpen(false);
      broadcastAuth(true);
      return true;
    }
    return false;
  };

  const logout = async () => {
    setIsAdminAuthenticated(false);
    setIsCloudAdmin(false);
    setFirebaseUser(null);
    setAuthError(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    broadcastAuth(false);
    if (firebaseEnabled && auth) {
      await signOut(auth).catch(() => {});
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAdminAuthenticated,
        isCloudAdmin,
        authReady,
        authLoading,
        authError,
        clearAuthError,
        loginModalOpen,
        openLoginModal,
        closeLoginModal,
        loginWithGoogle,
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
