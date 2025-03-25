"use client";

import React from "react";
import { Button, CircularProgress } from "@mui/material";
import { useAuthStore } from "@/store/authStore";
import { Google as GoogleIcon } from "@mui/icons-material";

export default function GoogleSignInButton() {
  const { signInWithGoogle, isLoading } = useAuthStore();

  const handleSignIn = async () => {
    await signInWithGoogle();
  };

  return (
    <Button
      variant="contained"
      color="primary"
      size="large"
      fullWidth
      startIcon={isLoading ? null : <GoogleIcon />}
      onClick={handleSignIn}
      disabled={isLoading}
      sx={{
        py: 1.5,
        fontSize: "1rem",
        position: "relative",
      }}
    >
      {isLoading ? (
        <CircularProgress
          size={24}
          sx={{ position: "absolute", left: "calc(50% - 12px)" }}
        />
      ) : (
        "Continue with Google"
      )}
    </Button>
  );
}
