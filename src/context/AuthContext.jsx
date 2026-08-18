import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  fetchMeApi,
  loginApi,
  registerApi,
  logoutUser,
  getSavedToken
} from '../services/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });

  // Verify token on mount
  useEffect(() => {
    let isMounted = true;
    const token = getSavedToken();

    if (token) {
      fetchMeApi()
        .then((user) => {
          if (isMounted && user) {
            setCurrentUser(user);
          }
        })
        .catch(() => {
          if (isMounted) setCurrentUser(null);
        })
        .finally(() => {
          if (isMounted) setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const openAuthModal = useCallback((mode = 'login') => {
    setAuthModal({ isOpen: true, mode });
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModal((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const handleLogin = useCallback(async (credentials) => {
    const data = await loginApi(credentials);
    setCurrentUser(data.user);
    closeAuthModal();
    return data;
  }, [closeAuthModal]);

  const handleRegister = useCallback(async (userData) => {
    const data = await registerApi(userData);
    setCurrentUser(data.user);
    closeAuthModal();
    return data;
  }, [closeAuthModal]);

  const handleLogout = useCallback(() => {
    logoutUser();
    setCurrentUser(null);
  }, []);

  const value = {
    currentUser,
    setCurrentUser,
    isLoading,
    authModal,
    openAuthModal,
    closeAuthModal,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      currentUser: null,
      setCurrentUser: () => {},
      isLoading: false,
      authModal: { isOpen: false, mode: 'login' },
      openAuthModal: () => {},
      closeAuthModal: () => {},
      login: async () => {},
      register: async () => {},
      logout: () => {}
    };
  }
  return context;
}
