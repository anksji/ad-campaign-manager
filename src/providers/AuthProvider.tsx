"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Snackbar, Alert } from "@mui/material";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { APP_ROUTES } from "@/core/constants/routes";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  checkingAuth: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: false,
  checkingAuth: true,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, error, clearError } = useAuthStore();
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  // Handle routing based on auth state
  useEffect(() => {
    if (checkingAuth) return;

    // Get current path
    const isAuthRoute = pathname?.startsWith("/login") || pathname === "/";

    // If not authenticated and not on auth route, redirect to login
    if (!isAuthenticated && !isAuthRoute) {
      router.replace("/login");
    }

    // If authenticated and on auth route, redirect to dashboard
    if (isAuthenticated && isAuthRoute) {
      router.replace(APP_ROUTES.campaigns);
    }
  }, [isAuthenticated, pathname, router, checkingAuth]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, checkingAuth }}>
      {children}

      {/* Error Snackbar */}
      {error && (
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={clearError}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert onClose={clearError} severity="error">
            {error}
          </Alert>
        </Snackbar>
      )}
    </AuthContext.Provider>
  );
}
