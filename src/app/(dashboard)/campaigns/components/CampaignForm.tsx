"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  TextField,
  Typography,
  Grid,
  Divider,
  Alert,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Campaign, CampaignType } from "@/types/compaign.types";
import { useCampaignStore } from "@/store/campaignStore";
import ScheduleBuilder from "./ScheduleBuilder";
import {
  createEmptyScheduleItem,
  getDefaultSchedule,
  ensureValidSchedule,
} from "@/utils/schedule-utils";

const campaignTypes: CampaignType[] = [
  "Cost per Order",
  "Cost per Click",
  "Buy One Get One",
];

// Validation schema using Yup
const validationSchema = Yup.object({
  title: Yup.string()
    .required("Campaign title is required")
    .max(100, "Title must be 100 characters or less"),
  purpose: Yup.string()
    .required("Campaign purpose is required")
    .max(500, "Purpose must be 500 characters or less"),
  type: Yup.string()
    .oneOf(campaignTypes, "Invalid campaign type")
    .required("Campaign type is required"),
  startDate: Yup.date().required("Start date is required"),
  endDate: Yup.date()
    .required("End date is required")
    .min(Yup.ref("startDate"), "End date must be after start date"),
  schedule: Yup.array()
    .of(
      Yup.object({
        weekday: Yup.string().required("Weekday is required"),
        timeSlots: Yup.array()
          .of(
            Yup.object({
              startTime: Yup.string().required("Start time is required"),
              endTime: Yup.string()
                .required("End time is required")
                .test(
                  "is-after-start",
                  "End time must be after start time",
                  function (endTime) {
                    const { startTime } = this.parent;
                    if (!startTime || !endTime) return true;
                    return endTime > startTime;
                  }
                ),
            })
          )
          .min(1, "At least one time slot is required"),
      })
    )
    .min(1, "At least one schedule item is required"),
});

interface CampaignFormProps {
  campaign?: Campaign | null;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export default function CampaignForm({
  campaign,
  onSuccess,
  onError,
}: CampaignFormProps) {
  const { createCampaign, updateCampaign, isLoading } = useCampaignStore();
  const [formError, setFormError] = useState<string | null>(null);

  // Format initial values from campaign or defaults
  const initialValues = campaign
    ? {
        title: campaign.title || "",
        purpose: campaign.purpose || "",
        type: campaign.type || ("Cost per Order" as CampaignType),
        startDate: campaign.startDate
          ? new Date(campaign.startDate)
          : new Date(),
        endDate: campaign.endDate
          ? new Date(campaign.endDate)
          : new Date(new Date().setDate(new Date().getDate() + 14)),
        schedule: ensureValidSchedule(campaign.schedule),
      }
    : {
        title: "",
        purpose: "",
        type: "Cost per Order" as CampaignType,
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 14)), // Default to 2 weeks
        schedule: getDefaultSchedule(),
      };

  // Setup formik
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        setFormError(null);

        // Format dates to ISO strings
        const formattedValues = {
          ...values,
          startDate: values.startDate.toISOString(),
          endDate: values.endDate.toISOString(),
        };

        // Create or update campaign
        if (campaign) {
          const success = await updateCampaign({
            id: campaign.id,
            ...formattedValues,
          });

          if (success) {
            onSuccess("Campaign updated successfully");
          } else {
            onError("Failed to update campaign");
          }
        } else {
          const success = await createCampaign(formattedValues);

          if (success) {
            onSuccess("Campaign created successfully");
          } else {
            onError("Failed to create campaign");
          }
        }
      } catch (error) {
        console.error("Form submission error:", error);
        setFormError(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred"
        );
        onError("Failed to save campaign");
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {/* Campaign Title */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="title"
              name="title"
              label="Campaign Title"
              value={formik.values.title}
              onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />
          </Grid>

          {/* Campaign Purpose */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="purpose"
              name="purpose"
              label="Campaign Purpose"
              multiline
              rows={3}
              value={formik.values.purpose}
              onChange={formik.handleChange}
              error={formik.touched.purpose && Boolean(formik.errors.purpose)}
              helperText={formik.touched.purpose && formik.errors.purpose}
            />
          </Grid>

          {/* Campaign Type */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="type"
              name="type"
              label="Campaign Type"
              select
              value={formik.values.type}
              onChange={formik.handleChange}
              error={formik.touched.type && Boolean(formik.errors.type)}
              helperText={formik.touched.type && formik.errors.type}
            >
              {campaignTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Date Range */}
          <Grid item xs={12} md={6}>
            <DatePicker
              label="Start Date"
              value={formik.values.startDate}
              onChange={(date) => formik.setFieldValue("startDate", date)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error:
                    formik.touched.startDate &&
                    Boolean(formik.errors.startDate),
                  helperText:
                    formik.touched.startDate &&
                    (formik.errors.startDate as string),
                },
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <DatePicker
              label="End Date"
              value={formik.values.endDate}
              onChange={(date) => formik.setFieldValue("endDate", date)}
              minDate={formik.values.startDate}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error:
                    formik.touched.endDate && Boolean(formik.errors.endDate),
                  helperText:
                    formik.touched.endDate && (formik.errors.endDate as string),
                },
              }}
            />
          </Grid>

          {/* Schedule Builder */}
          <Grid item xs={12}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Campaign Schedule
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Select the days and times when the campaign should be active
            </Typography>

            <ScheduleBuilder
              schedule={formik.values.schedule}
              onChange={(schedule) =>
                formik.setFieldValue("schedule", schedule)
              }
              error={formik.errors.schedule as any}
              touched={formik.touched.schedule as any}
            />
          </Grid>

          {/* Form Error */}
          {formError && (
            <Grid item xs={12}>
              <Alert severity="error">{formError}</Alert>
            </Grid>
          )}

          {/* Submit Button */}
          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={isLoading}
                sx={{ minWidth: 120 }}
              >
                {isLoading ? (
                  <CircularProgress size={24} sx={{ color: "white" }} />
                ) : campaign ? (
                  "Update"
                ) : (
                  "Create"
                )}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </LocalizationProvider>
    </form>
  );
}
