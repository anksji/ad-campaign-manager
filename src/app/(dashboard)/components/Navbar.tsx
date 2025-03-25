"use client";

import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  useMediaQuery,
  useTheme,
  Tooltip,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { useAuthStore } from "@/store/authStore";
import UserMenu from "./UserMenu";

export default function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user, logout } = useAuthStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    handleClose();
  };

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
        >
          Campaign Manager
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tooltip title="Account">
            <IconButton
              onClick={handleMenu}
              size="small"
              sx={{
                ml: 2,
                border: "2px solid",
                borderColor: "divider",
                p: 0.2,
                transition: "all 0.2s",
                "&:hover": {
                  borderColor: "primary.main",
                },
              }}
            >
              {user?.photoURL ? (
                <Avatar src={user.photoURL} sx={{ width: 32, height: 32 }} />
              ) : (
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: "primary.main",
                  }}
                >
                  <PersonIcon fontSize="small" />
                </Avatar>
              )}
            </IconButton>
          </Tooltip>

          <UserMenu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            onLogout={handleLogout}
            user={user}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
