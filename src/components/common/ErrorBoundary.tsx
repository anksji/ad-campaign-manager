"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Box, Typography, Button, Paper, Container } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import RefreshIcon from "@mui/icons-material/Refresh";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error: error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  handleRefresh = (): void => {
    window.location.reload();
  };

  handleGoHome = (): void => {
    window.location.href = "/";
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <Container maxWidth="md">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "100vh",
              py: 4,
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 2,
                textAlign: "center",
                maxWidth: 600,
                mx: "auto",
              }}
            >
              <ErrorIcon color="error" sx={{ fontSize: 72, mb: 2 }} />

              <Typography variant="h4" component="h1" gutterBottom>
                Something went wrong
              </Typography>

              <Typography variant="body1" color="textSecondary" paragraph>
                We're sorry, but an unexpected error has occurred. Please try
                refreshing the page or come back later.
              </Typography>

              {process.env.NODE_ENV === "development" && this.state.error && (
                <Box sx={{ mt: 3, mb: 3, textAlign: "left" }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Error Details (visible in development only):
                  </Typography>
                  <Paper
                    sx={{
                      p: 2,
                      backgroundColor: "#f5f5f5",
                      borderRadius: 1,
                      overflowX: "auto",
                    }}
                  >
                    <Typography
                      variant="body2"
                      component="pre"
                      sx={{ whiteSpace: "pre-wrap" }}
                    >
                      {this.state.error.toString()}
                    </Typography>
                    {this.state.errorInfo && (
                      <Typography
                        variant="body2"
                        component="pre"
                        sx={{ mt: 2, whiteSpace: "pre-wrap" }}
                      >
                        {this.state.errorInfo.componentStack}
                      </Typography>
                    )}
                  </Paper>
                </Box>
              )}

              <Box
                sx={{
                  mt: 4,
                  display: "flex",
                  justifyContent: "center",
                  gap: 2,
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<RefreshIcon />}
                  onClick={this.handleRefresh}
                >
                  Refresh Page
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={this.handleGoHome}
                >
                  Go Home
                </Button>
              </Box>
            </Paper>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}
