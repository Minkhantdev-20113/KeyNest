import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import {
  changeAccountPassword,
  getAccountProfile,
  loginAccount,
  logoutAccount,
  registerAccount,
  updateAccountProfile,
} from '../services/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        return onAuthStateChanged(auth, async (nextUser) => {
          setUser(nextUser);
          try {
            setProfile(nextUser ? await getAccountProfile(nextUser.uid) : null);
          } catch (profileError) {
            console.error('Profile load error:', profileError);
            setProfile(null);
          } finally {
            setIsInitialized(true);
          }
        }, () => setIsInitialized(true));
      } catch (err) {
        console.error('Auth init error:', err);
        setIsInitialized(true);
      }
    }
    const unsubscribePromise = init();
    return () => { unsubscribePromise.then((unsubscribe) => unsubscribe?.()); };
  }, []);

  const handleSetup = useCallback(async (email, password, username) => {
    setLoading(true);
    setError(null);
    try {
      await registerAccount(email, password, username);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogin = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      await loginAccount(email, password);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogout = useCallback(() => {
    logoutAccount().catch((err) => setError(err.message));
  }, []);

  const handleLock = useCallback(() => {
    logoutAccount().catch((err) => setError(err.message));
  }, []);

  const handleChangePassword = useCallback(async (newPassword) => {
    setLoading(true);
    setError(null);
    try {
      await changeAccountPassword(newPassword);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleProfileSave = useCallback(async (updates) => {
    if (!user) return false;
    try {
      await updateAccountProfile(user.uid, updates);
      setProfile((current) => ({ ...current, ...updates }));
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, [user]);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAuthenticated: !!user,
        isInitialized,
        error,
        loading,
        setup: handleSetup,
        login: handleLogin,
        logout: handleLogout,
        lock: handleLock,
        changePassword: handleChangePassword,
        saveProfile: handleProfileSave,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
