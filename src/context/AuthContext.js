"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { fetchUser, loginUser } from "../services/users";
import { clearStoredToken, getStoredToken, saveToken } from "../services/auth-storage";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function restoreSession() {
      try {
        const token = getStoredToken();
        if (token) {
          const currentUser = await fetchUser(token, { signal: controller.signal });
          if (!controller.signal.aborted) {
            setUser(currentUser);
          }
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          if (error.status === 401 || error.status === 403) {
            clearStoredToken();
          }
          setUser(null);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    restoreSession();
    return () => controller.abort();
  }, []);

  async function login(username, password, rememberMe = false) {
    const token = await loginUser(username, password, rememberMe);
    const currentUser = await fetchUser(token);
    saveToken(token, rememberMe);
    setUser(currentUser);
  }

  function logout() {
    clearStoredToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
