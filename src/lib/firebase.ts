"use client";
import { initializeApp, getApps } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
} from "firebase/messaging";

// Initialize variables
let authInitialized = false;
export { authInitialized };
export let authReady = false;

// Token Storage for caching authentication tokens
export const TokenStorage = {
  TOKEN_KEY: "pramou_auth_token",
  EXPIRY_KEY: "pramou_token_expiry",
  NODE_BACKEND_TOKEN_KEY: "node_token_key",

  saveNodeBackendToken(token: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(this.NODE_BACKEND_TOKEN_KEY, token);
  },

  getNodeBackendToken(): string | null {
    if (typeof window === "undefined") return null;

    try {
      const token = localStorage.getItem(this.NODE_BACKEND_TOKEN_KEY);
      const expiryStr = localStorage.getItem(this.EXPIRY_KEY);

      if (!token || !expiryStr) return null;

      const expiry = parseInt(expiryStr, 10) * 2;
      if (isNaN(expiry) || expiry <= Date.now()) {
        // Token expired, clean up
        localStorage.removeItem(this.NODE_BACKEND_TOKEN_KEY);
        return null;
      }

      return token;
    } catch (e) {
      console.error("Failed to retrieve token from localStorage:", e);
      return null;
    }
  },

  // Save token with expiry
  saveToken(token: string): void {
    if (typeof window === "undefined") return;

    try {
      // Save token
      localStorage.setItem(this.TOKEN_KEY, token);

      // Save expiry (55 minutes from now)
      const expiry = Date.now() + 55 * 60 * 1000;
      localStorage.setItem(this.EXPIRY_KEY, expiry.toString());

      console.log("Token saved to storage, valid until", new Date(expiry));
    } catch (e) {
      console.error("Failed to save token to localStorage:", e);
    }
  },

  // Get token if valid
  getToken(): string | null {
    if (typeof window === "undefined") return null;

    try {
      const token = localStorage.getItem(this.TOKEN_KEY);
      const expiryStr = localStorage.getItem(this.EXPIRY_KEY);

      if (!token || !expiryStr) return null;

      const expiry = parseInt(expiryStr, 10);
      if (isNaN(expiry) || expiry <= Date.now()) {
        // Token expired, clean up
        this.clearToken();
        return null;
      }

      return token;
    } catch (e) {
      console.error("Failed to retrieve token from localStorage:", e);
      return null;
    }
  },

  clearNodeToken(): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.removeItem(this.NODE_BACKEND_TOKEN_KEY);
    } catch (e) {
      console.error("Failed to clear token from localStorage:", e);
    }
  },

  // Clear token
  clearToken(): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.EXPIRY_KEY);
    } catch (e) {
      console.error("Failed to clear token from localStorage:", e);
    }
  },
};

// Standard Firebase setup - keeping the original approach
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase only if it hasn't been initialized yet
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Export Firebase instances
export const auth = getAuth(app);
export const db = getFirestore(app);

// Set up auth state observer
if (typeof window !== "undefined") {
  onAuthStateChanged(auth, (user) => {
    authInitialized = true;
    authReady = true;
    console.log("Auth state changed:", user ? "Logged in" : "Logged out");

    // Store or clear token based on auth state
    if (user) {
      user
        .getIdToken(true)
        .then((token) => {
          TokenStorage.saveToken(token);
        })
        .catch((err) => {
          console.error("Error getting token:", err);
        });
    } else {
      TokenStorage.clearToken();
    }
  });
}

// Create the auth ready promise with a timeout
export const authReadyPromise = new Promise<boolean>((resolve) => {
  // If we're not in the browser, resolve to false immediately
  if (typeof window === "undefined") {
    resolve(false);
    return;
  }

  // If auth is already initialized, resolve immediately
  if (authInitialized) {
    resolve(true);
    return;
  }

  // Set a timeout to resolve after 5 seconds no matter what
  const timeoutId = setTimeout(() => {
    console.warn("Auth initialization timed out after 5 seconds");
    authInitialized = true;
    authReady = true;
    resolve(false);
  }, 5000);

  // Set up auth state change listener
  const unsubscribe = onAuthStateChanged(auth, () => {
    clearTimeout(timeoutId);
    authInitialized = true;
    authReady = true;
    unsubscribe();
    resolve(true);
  });
});

// Get token with caching
export const getRefreshToken = async (
  forceRefresh = false
): Promise<string | null> => {
  console.time("get-refresh-token");
  // For SSR
  if (typeof window === "undefined") return null;

  // If not forcing refresh, try from storage first
  if (!forceRefresh) {
    const cachedToken = TokenStorage.getToken();
    if (cachedToken) {
      console.timeEnd("get-refresh-token");
      return cachedToken;
    }
  }

  try {
    // No valid cached token, try to get a fresh one
    if (!auth.currentUser) {
      console.timeEnd("get-refresh-token");
      return null;
    }

    const token = await auth.currentUser.getIdToken(forceRefresh);
    if (token) {
      TokenStorage.saveToken(token);
    }

    console.timeEnd("get-refresh-token");
    return token;
  } catch (error) {
    console.error("Error in getRefreshToken:", error);
    console.timeEnd("get-refresh-token");
    return null;
  }
};

// Initialize messaging if available
let messaging: any = null;
if (typeof window !== "undefined") {
  // Initialize messaging in the background
  isSupported()
    .then((supported) => {
      if (supported) {
        messaging = getMessaging(app);
        console.log("Firebase messaging initialized");
      }
    })
    .catch((err) => {
      console.error("Error checking messaging support:", err);
    });
}

// Get messaging token
export const getMessagingToken = async () => {
  if (!messaging) return null;

  try {
    const currentToken = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });

    return currentToken || null;
  } catch (error) {
    console.error("Error getting messaging token:", error);
    return null;
  }
};

// Register device token with backend
export const registerDeviceToken = async () => {
  const token = await getMessagingToken();
  if (!token) return false;

  try {
    const response = await fetch("/api/chat/device/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getRefreshToken()}`,
      },
      body: JSON.stringify({ fcmToken: token }),
    });

    return response.ok;
  } catch (error) {
    console.error("Error registering device token:", error);
    return false;
  }
};
