"use client";

import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

export default function LoadingScreen() {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        zIndex: 9999,
        backdropFilter: "blur(4px)",
      }}
    >
      <CircularProgress size={60} thickness={4} color="primary" />
      <Typography variant="body1" sx={{ mt: 2, fontWeight: 500 }}>
        Loading...
      </Typography>
    </Box>
  );
}
