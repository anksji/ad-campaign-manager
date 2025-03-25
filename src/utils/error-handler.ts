"use client";
// Firebase init code here
import { FirebaseErrorCode } from "@/types/firebase-errors";

export class FirebaseAuthError extends Error {
  constructor(public code: FirebaseErrorCode, message: string) {
    super(message);
    this.name = "FirebaseAuthError";
  }
}

export const handleFirebaseAuthError = (error: any): FirebaseAuthError => {
  const errorCode = error.code as FirebaseErrorCode;
  let errorMessage: string;

  switch (errorCode) {
    // Sign in errors
    case "auth/user-not-found":
      errorMessage = "No account exists with this email.";
      break;
    case "auth/wrong-password":
      errorMessage = "Incorrect password. Please try again.";
      break;
    case "auth/invalid-email":
      errorMessage = "Invalid email address format.";
      break;
    case "auth/user-disabled":
      errorMessage = "This account has been disabled.";
      break;

    // Sign up errors
    case "auth/email-already-in-use":
      errorMessage = "An account already exists with this email.";
      break;
    case "auth/operation-not-allowed":
      errorMessage =
        "Email/password accounts are not enabled. Please contact support.";
      break;
    case "auth/weak-password":
      errorMessage =
        "Password is too weak. Please use a stronger password (at least 6 characters).";
      break;

    // Google Sign in errors
    case "auth/popup-blocked":
      errorMessage =
        "Sign-in popup was blocked. Please allow popups for this site.";
      break;
    case "auth/popup-closed-by-user":
      errorMessage = "Sign-in popup was closed before completion.";
      break;
    case "auth/cancelled-popup-request":
      errorMessage = "The sign-in process was cancelled.";
      break;
    case "auth/account-exists-with-different-credential":
      errorMessage =
        "An account already exists with the same email but different sign-in credentials.";
      break;

    // General auth errors
    case "auth/network-request-failed":
      errorMessage =
        "Network error occurred. Please check your internet connection.";
      break;
    case "auth/too-many-requests":
      errorMessage = "Too many unsuccessful attempts. Please try again later.";
      break;
    case "auth/requires-recent-login":
      errorMessage =
        "This operation requires recent authentication. Please log in again.";
      break;
    case "auth/user-token-expired":
      errorMessage = "Your session has expired. Please log in again.";
      break;
    case "auth/web-storage-unsupported":
      errorMessage =
        "Local storage is not supported or is disabled. Please enable it to continue.";
      break;
    case "auth/invalid-credential":
      errorMessage = "The provided credential is invalid. Please try again.";
      break;
    case "auth/unverified-email":
      errorMessage = "Please verify your email address before continuing.";
      break;
    case "auth/invalid-verification-code":
      errorMessage = "Invalid verification code. Please try again.";
      break;
    case "auth/invalid-verification-id":
      errorMessage =
        "Invalid verification ID. Please request a new verification code.";
      break;
    case "auth/captcha-check-failed":
      errorMessage = "Captcha verification failed. Please try again.";
      break;
    default:
      errorMessage = "An unexpected error occurred. Please try again later.";
  }

  return new FirebaseAuthError(errorCode, errorMessage);
};
