"use client";

import React from "react";
import { Box } from "@mui/material";
import Navbar from "./components/Navbar";
import DashboardShell from "./components/DashboardShell";
import { useAuth } from "@/providers/AuthProvider";
import LoadingScreen from "@/components/common/LoadingScreen";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, checkingAuth } = useAuth();

  if (checkingAuth) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Navbar />
        <DashboardShell>{children}</DashboardShell>
      </Box>
    </Box>
  );
}
