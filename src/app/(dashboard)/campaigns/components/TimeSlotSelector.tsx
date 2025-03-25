"use client";

import React from "react";
import {
  Box,
  IconButton,
  TextField,
  FormHelperText,
  Typography,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { TimeSlot } from "@/types/compaign.types";
import { formatTime } from "@/utils/schedule-utils";

// Generate time options in 30-minute increments
const generateTimeOptions = () => {
  const options = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const h = hour.toString().padStart(2, "0");
      const m = minute.toString().padStart(2, "0");
      const value = `${h}:${m}`;
      options.push({
        value,
        label: formatTime(value),
      });
    }
  }
  return options;
};

const timeOptions = generateTimeOptions();

interface TimeSlotSelectorProps {
  timeSlot: TimeSlot;
  onChange: (field: "startTime" | "endTime", value: string) => void;
  onRemove: () => void;
  showRemoveButton: boolean;
  error?: any;
  touched?: any;
}

export default function TimeSlotSelector({
  timeSlot,
  onChange,
  onRemove,
  showRemoveButton,
  error,
  touched,
}: TimeSlotSelectorProps) {
  const hasStartTimeError = touched?.startTime && error?.startTime;
  const hasEndTimeError = touched?.endTime && error?.endTime;

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
        <TextField
          select
          label="Start Time"
          value={timeSlot.startTime}
          onChange={(e) => onChange("startTime", e.target.value)}
          fullWidth
          error={hasStartTimeError}
          size="small"
        >
          {timeOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="End Time"
          value={timeSlot.endTime}
          onChange={(e) => onChange("endTime", e.target.value)}
          fullWidth
          error={hasEndTimeError}
          size="small"
        >
          {timeOptions
            .filter((option) => option.value > timeSlot.startTime)
            .map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
        </TextField>

        {showRemoveButton && (
          <IconButton
            color="error"
            onClick={onRemove}
            size="small"
            sx={{ mt: 1 }}
          >
            <DeleteIcon />
          </IconButton>
        )}
      </Box>

      {hasStartTimeError && (
        <FormHelperText error>{error.startTime}</FormHelperText>
      )}

      {hasEndTimeError && (
        <FormHelperText error>{error.endTime}</FormHelperText>
      )}
    </Box>
  );
}
