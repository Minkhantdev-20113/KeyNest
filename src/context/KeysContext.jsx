import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { addKey as dbAddKey, deleteKey as dbDeleteKey, getAllKeys, updateKey as dbUpdateKey } from '../services/database';

const KeysContext = createContext(null);

export function KeysProvider({ children }) {
  const { user } = useAuth();
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [syncInfo, setSyncInfo] = useState({ status: 'synced', lastSync: null, pendingCount: 0, isOnline: navigator.onLine });

  const loadKeys = useCallback(async () => {
    if (!user) {
      setKeys([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setKeys(await getAllKeys(user.uid));
      setSyncInfo({ status: 'synced', lastSync: new Date().toISOString(), pendingCount: 0, isOnline: navigator.onLine });
    } catch (err) {
      setError(err.message);
      setSyncInfo((current) => ({ ...current, status: 'error' }));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { loadKeys(); }, [loadKeys]);

  useEffect(() => {
    const updateOnline = () => setSyncInfo((current) => ({ ...current, isOnline: navigator.onLine }));
    window.addEventListener('online', updateOnline);
    window.addEventListener('offline', updateOnline);
    return () => {
      window.removeEventListener('online', updateOnline);
      window.removeEventListener('offline', updateOnline);
    };
  }, []);

  const addKey = useCallback(async (keyData) => {
    try {
      const newKey = await dbAddKey(user.uid, keyData);
      setKeys((current) => [newKey, ...current]);
      return newKey;
    } catch (err) { setError(err.message); throw err; }
  }, [user]);

  const updateKey = useCallback(async (id, updates) => {
    try {
      const updated = await dbUpdateKey(user.uid, id, updates);
      setKeys((current) => current.map((key) => key.id === id ? { ...key, ...updated } : key));
      return updated;
    } catch (err) { setError(err.message); throw err; }
  }, [user]);

  const removeKey = useCallback(async (id) => {
    try {
      await dbDeleteKey(user.uid, id);
      setKeys((current) => current.filter((key) => key.id !== id));
    } catch (err) { setError(err.message); throw err; }
  }, [user]);

  const getKeyStats = useCallback(() => {
    const providers = [...new Set(keys.map((key) => key.provider))];
    return {
      total: keys.length,
      providerCount: providers.length,
      providerCounts: providers.map((provider) => ({ provider, count: keys.filter((key) => key.provider === provider).length })),
      recentKeys: [...keys].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5),
    };
  }, [keys]);

  const doSync = useCallback(async () => {
    await loadKeys();
    return { status: 'synced', message: 'All data is synced with Firebase' };
  }, [loadKeys]);

  return (
    <KeysContext.Provider value={{ keys, loading, error, syncInfo, addKey, updateKey, removeKey, sync: doSync, refresh: loadKeys, getKeyStats }}>
      {children}
    </KeysContext.Provider>
  );
}

export function useKeys() {
  const context = useContext(KeysContext);
  if (!context) throw new Error('useKeys must be used within KeysProvider');
  return context;
}
