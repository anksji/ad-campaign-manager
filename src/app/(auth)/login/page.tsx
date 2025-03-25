"use client";

import React from "react";
import { Box, Container, Paper, Typography } from "@mui/material";
import GoogleSignInButton from "./components/GoogleSignInButton";

export default function LoginPage() {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          py: 8,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 6,
            width: "100%",
            borderRadius: 3,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 700 }}
          >
            Campaign Manager
          </Typography>

          <Typography variant="body1" color="textSecondary" paragraph>
            Create and manage your marketing campaigns efficiently
          </Typography>

          <Box sx={{ mt: 5 }}>
            <GoogleSignInButton />
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
