"use client";

import React from "react";
import { Container, Box } from "@mui/material";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 3,
        px: { xs: 2, md: 3 },
        backgroundColor: (theme) => theme.palette.background.default,
        minHeight: "calc(100vh - 64px)",
        overflow: "auto",
      }}
    >
      <Container maxWidth="xl">{children}</Container>
    </Box>
  );
}
