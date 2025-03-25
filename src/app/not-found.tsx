"use client";

import { APP_ROUTES } from "@/core/constants/routes";
import { Button, Box, Typography, Container } from "@mui/material";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
          py: 4,
        }}
      >
        <Typography variant="h1" component="h1" gutterBottom>
          404
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Sorry, we couldn't find the page you're looking for.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => router.push(APP_ROUTES.campaigns)}
          sx={{ mt: 2 }}
        >
          Go to Campaign
        </Button>
      </Box>
    </Container>
  );
}
