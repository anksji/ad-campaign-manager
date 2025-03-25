import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { User } from "firebase/auth";
import { auth, getRefreshToken } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { handleFirebaseAuthError } from "@/utils/error-handler";

interface AuthState {
  // Auth state
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  signInWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;

  // Token management
  getToken: () => Promise<string | null>;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        // Sign in with Google
        signInWithGoogle: async (): Promise<boolean> => {
          try {
            set({ isLoading: true, error: null });
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);

            set({
              user: result.user,
              isAuthenticated: true,
              isLoading: false,
            });

            return true;
          } catch (error) {
            const authError = handleFirebaseAuthError(error);
            set({
              error: authError.message,
              isLoading: false,
              isAuthenticated: false,
            });
            return false;
          }
        },

        // Logout
        logout: async (): Promise<void> => {
          try {
            set({ isLoading: true });
            await signOut(auth);
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          } catch (error) {
            console.error("Logout error:", error);
            set({
              isLoading: false,
              error: "Failed to logout. Please try again.",
            });
          }
        },

        // Clear error message
        clearError: () => {
          set({ error: null });
        },

        // Get auth token for API requests
        getToken: async (): Promise<string | null> => {
          // Only attempt if we're authenticated
          if (!get().isAuthenticated) return null;

          try {
            return await getRefreshToken();
          } catch (error) {
            console.error("Error getting token:", error);
            return null;
          }
        },
      }),
      {
        name: "auth-storage",
        // Only persist certain parts of the state
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    )
  )
);

// Set up auth state listener
if (typeof window !== "undefined") {
  auth.onAuthStateChanged((user) => {
    useAuthStore.setState({
      user: user,
      isAuthenticated: !!user,
    });
  });
}
