"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import CampaignList from "./components/CampaignList";
import CampaignForm from "./components/CampaignForm";
import DeleteConfirmation from "./components/DeleteConfirmation";
import { useCampaignStore } from "@/store/campaignStore";

export default function CampaignsPage() {
  const {
    campaigns,
    fetchCampaigns,
    isLoading,
    error,
    formOpen,
    deleteDialogOpen,
    selectedCampaign,
    openForm,
    closeForm,
    closeDeleteDialog,
    deleteCampaign,
  } = useCampaignStore();

  // Track initial loading state separately from filter updates
  const [initialLoading, setInitialLoading] = useState(true);

  // Notification state
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  // Load campaigns on mount
  useEffect(() => {
    const loadCampaigns = async () => {
      await fetchCampaigns();
      setInitialLoading(false);
    };

    loadCampaigns();
  }, [fetchCampaigns]);

  // Handle campaign delete
  const handleDelete = async () => {
    if (!selectedCampaign) return;

    const success = await deleteCampaign(selectedCampaign.id);

    if (success) {
      showNotification("Campaign deleted successfully", "success");
    } else {
      showNotification("Failed to delete campaign", "error");
    }
  };

  // Show notification
  const showNotification = (message: string, severity: "success" | "error") => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  // Close notification
  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false,
    });
  };

  // Ensure campaigns is an array before passing it to the component
  const campaignsArray = Array.isArray(campaigns) ? campaigns : [];

  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" component="h1">
            Campaigns
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => openForm()}
          >
            Create Campaign
          </Button>
        </Box>

        <Card>
          {initialLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <CampaignList
              campaigns={campaignsArray}
              onShowNotification={showNotification}
            />
          )}
        </Card>
      </Box>

      {/* Campaign Form Dialog */}
      <Dialog open={formOpen} onClose={closeForm} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedCampaign ? "Edit Campaign" : "Create Campaign"}
          <IconButton
            aria-label="close"
            onClick={closeForm}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <CampaignForm
            campaign={selectedCampaign}
            onSuccess={(message) => {
              closeForm();
              showNotification(message, "success");
            }}
            onError={(message) => {
              showNotification(message, "error");
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmation
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={handleDelete}
        title="Delete Campaign"
        content={`Are you sure you want to delete the campaign "${
          selectedCampaign?.title || selectedCampaign?.type
        }"? This action cannot be undone.`}
      />

      {/* Notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={5000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
}
