import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { onAuthChange, logOut } from '../services/authService';
import { isOnline } from '../services/syncService';

const GUEST_KEY = 'coding_rpg_guest';

function getGuestSession() {
  try {
    const raw = localStorage.getItem(GUEST_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function createGuestSession() {
  const id = 'guest_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const session = { id, email: id + '@offline', createdAt: Date.now() };
  try { localStorage.setItem(GUEST_KEY, JSON.stringify(session)); } catch {}
  return session;
}

function clearGuestSession() {
  try { localStorage.removeItem(GUEST_KEY); } catch {}
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const unsub = onAuthChange((firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setIsGuest(false);
        clearGuestSession();
      } else if (!isOnline()) {
        const guest = getGuestSession();
        if (guest) {
          setUser({ email: guest.email, isGuest: true, uid: guest.id });
          setIsGuest(true);
        } else {
          setUser(null);
          setIsGuest(false);
        }
      } else {
        setUser(null);
        setIsGuest(false);
      }
      setLoading(false);
    });

    const timeout = setTimeout(() => {
      if (loading && !isOnline()) {
        const guest = getGuestSession() || createGuestSession();
        setUser({ email: guest.email, isGuest: true, uid: guest.id });
        setIsGuest(true);
        setLoading(false);
      }
    }, 3000);

    return () => { unsub(); clearTimeout(timeout); };
  }, []);

  const loginAsGuest = useCallback(() => {
    const guest = getGuestSession() || createGuestSession();
    setUser({ email: guest.email, isGuest: true, uid: guest.id });
    setIsGuest(true);
    setLoading(false);
  }, []);

  const logout = useCallback(async () => {
    try { await logOut(); } catch {}
    setUser(null);
    setIsGuest(false);
    clearGuestSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isGuest, loginAsGuest, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
