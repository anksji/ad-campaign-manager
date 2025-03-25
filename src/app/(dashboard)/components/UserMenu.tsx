"use client";
import {
  Box,
  Menu,
  MenuItem,
  Typography,
  useTheme,
  alpha,
  ListItemIcon,
  ListItemText,
  Button,
  Avatar,
  Divider,
} from "@mui/material";
import { LogoutOutlined as LogoutIcon } from "@mui/icons-material";
import { User } from "firebase/auth";
interface UserMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
  user: User | null;
}

export default function UserMenu({
  anchorEl,
  open,
  onClose,
  onLogout,
  user,
}: UserMenuProps) {
  const theme = useTheme();

  const primaryColor = theme.palette.primary.main;
  const userInitial = user?.displayName?.charAt(0).toUpperCase() || "U";
  const emailParts = (user?.email || "user@example.com").split("@");
  const emailDisplay = emailParts[0] + "@" + emailParts[1];

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      PaperProps={{
        elevation: 0,
        sx: {
          mt: 1.5,
          minWidth: 290,
          borderRadius: 3,
          overflow: "visible",
          p: 0,
          filter: "drop-shadow(0px 6px 20px rgba(0,0,0,0.08))",
          border: `1px solid ${alpha(theme.palette.divider, 0.06)}`,
          backgroundColor: "#ffffff",
          backdropFilter: "blur(8px)",
        },
      }}
    >
      <Box
        sx={{
          px: 3,
          pt: 3.5,
          pb: 3,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          background: alpha(theme.palette.grey[50], 0.7),
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
          <Avatar
            sx={{
              width: 46,
              height: 46,
              bgcolor: primaryColor,
              fontSize: "1.1rem",
              fontWeight: 600,
              mr: 2,
              boxShadow: `0 3px 10px ${alpha(primaryColor, 0.2)}`,
            }}
          >
            {userInitial}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  lineHeight: 1.2,
                  pr: 1,
                  color: theme.palette.text.primary,
                }}
              >
                {user?.displayName || "User"}
              </Typography>
            </Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display: "block",
                mt: 0.5,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                opacity: 0.8,
                fontSize: "0.775rem",
              }}
            >
              {emailDisplay}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ py: 1.5 }}>
        <MenuItem
          onClick={onLogout}
          sx={{
            px: 3,
            py: 1.75,
            mx: 1.5,
            my: 0.5,
            borderRadius: 2,
            "&:hover": {
              bgcolor: alpha(theme.palette.error.light, 0.08),
              color: theme.palette.error.main,
              "& .MuiListItemIcon-root": {
                color: theme.palette.error.main,
              },
            },
            transition: "all 0.2s ease",
          }}
        >
          <ListItemIcon
            sx={{
              color: theme.palette.text.secondary,
              minWidth: 36,
              opacity: 0.85,
            }}
          >
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </MenuItem>
      </Box>
    </Menu>
  );
}
