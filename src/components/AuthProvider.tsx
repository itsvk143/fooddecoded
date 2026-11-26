"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { GoogleAuthModal } from "./GoogleAuthModal";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  profilePicture?: string;
  role: "USER" | "ADMIN";
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  openLoginModal: (returnUrl?: string) => void;
  closeLoginModal: () => void;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalReturnUrl, setModalReturnUrl] = useState<string>("/");

  // Fetch verified active session on mount
  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const openLoginModal = useCallback((returnUrl?: string) => {
    if (typeof window !== "undefined") {
      setModalReturnUrl(returnUrl || window.location.pathname);
    }
    setIsModalOpen(true);
  }, []);

  const closeLoginModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    setUser(null);
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  }, []);

  const handleLoginSuccess = useCallback((loggedInUser: AuthUser) => {
    setUser(loggedInUser);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        openLoginModal,
        closeLoginModal,
        logout,
        refreshSession,
      }}
    >
      {children}

      <GoogleAuthModal
        isOpen={isModalOpen}
        onClose={closeLoginModal}
        onSuccess={handleLoginSuccess}
        returnUrl={modalReturnUrl}
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
