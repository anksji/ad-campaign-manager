"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Typography,
  Paper,
  FormHelperText,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { ScheduleItem, WeekDay } from "@/types/compaign.types";
import TimeSlotSelector from "./TimeSlotSelector";
import {
  createEmptyScheduleItem,
  createEmptyTimeSlot,
  getDefaultSchedule,
} from "@/utils/schedule-utils";

interface ScheduleBuilderProps {
  schedule?: ScheduleItem[];
  onChange: (schedule: ScheduleItem[]) => void;
  error?: any;
  touched?: any;
}

export default function ScheduleBuilder({
  schedule = [],
  onChange,
  error,
  touched,
}: ScheduleBuilderProps) {
  // Initialize with default schedule if none provided
  const [initializedSchedule, setInitializedSchedule] = useState<
    ScheduleItem[]
  >([]);

  useEffect(() => {
    // If schedule is undefined or empty, initialize with default
    if (!Array.isArray(schedule) || schedule.length === 0) {
      const defaultSchedule = getDefaultSchedule();
      setInitializedSchedule(defaultSchedule);
      onChange(defaultSchedule);
    } else {
      setInitializedSchedule(schedule);
    }
  }, [schedule, onChange]);

  // Use the initialized schedule for rendering
  const currentSchedule =
    initializedSchedule.length > 0
      ? initializedSchedule
      : Array.isArray(schedule)
      ? schedule
      : [];

  // Add a new schedule item
  const addScheduleItem = () => {
    // Find weekdays not already in the schedule
    const usedWeekdays = new Set(currentSchedule.map((item) => item.weekday));
    const availableWeekdays: WeekDay[] = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ].filter((day) => !usedWeekdays.has(day as WeekDay)) as WeekDay[];

    // If there are available weekdays, add one
    if (availableWeekdays.length > 0) {
      // Sort weekdays by their numeric value
      availableWeekdays.sort((a, b) => weekdayToNumber(a) - weekdayToNumber(b));
      const newItem = createEmptyScheduleItem(availableWeekdays[0]);
      const updatedSchedule = [...currentSchedule, newItem];
      onChange(updatedSchedule);
      setInitializedSchedule(updatedSchedule);
    }
  };

  // Remove a schedule item
  const removeScheduleItem = (index: number) => {
    const newSchedule = [...currentSchedule];
    newSchedule.splice(index, 1);
    onChange(newSchedule);
    setInitializedSchedule(newSchedule);
  };

  // Update a schedule item
  const updateScheduleItem = (index: number, updatedItem: ScheduleItem) => {
    const newSchedule = [...currentSchedule];
    newSchedule[index] = updatedItem;
    onChange(newSchedule);
    setInitializedSchedule(newSchedule);
  };

  // Add a time slot to a schedule item
  const addTimeSlot = (scheduleIndex: number) => {
    const newSchedule = [...currentSchedule];
    newSchedule[scheduleIndex].timeSlots.push(createEmptyTimeSlot());
    onChange(newSchedule);
    setInitializedSchedule(newSchedule);
  };

  // Remove a time slot from a schedule item
  const removeTimeSlot = (scheduleIndex: number, timeSlotIndex: number) => {
    const newSchedule = [...currentSchedule];
    newSchedule[scheduleIndex].timeSlots.splice(timeSlotIndex, 1);
    onChange(newSchedule);
    setInitializedSchedule(newSchedule);
  };

  // Handle time slot change
  const handleTimeSlotChange = (
    scheduleIndex: number,
    timeSlotIndex: number,
    field: "startTime" | "endTime",
    value: string
  ) => {
    const newSchedule = [...currentSchedule];
    newSchedule[scheduleIndex].timeSlots[timeSlotIndex][field] = value;
    onChange(newSchedule);
    setInitializedSchedule(newSchedule);
  };

  // Check if all weekdays are already used
  const allWeekdaysUsed = currentSchedule.length === 7;

  // Check if there's an error to display
  const hasError = error && typeof error === "string";

  // Helper function to convert weekday to number for sorting - if not in utils
  function weekdayToNumber(weekday: WeekDay): number {
    const weekdays: Record<WeekDay, number> = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };
    return weekdays[weekday];
  }

  return (
    <Box>
      {currentSchedule.map((item, scheduleIndex) => (
        <Card
          key={item.id || scheduleIndex}
          variant="outlined"
          sx={{ mb: 2, borderRadius: 2 }}
        >
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Typography
                variant="subtitle1"
                fontWeight={500}
                sx={{ flexGrow: 1 }}
              >
                {item.weekday}
              </Typography>

              <IconButton
                color="error"
                onClick={() => removeScheduleItem(scheduleIndex)}
                disabled={currentSchedule.length <= 1}
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            </Box>

            <Stack spacing={2}>
              {item.timeSlots.map((timeSlot, timeSlotIndex) => (
                <Paper
                  key={timeSlot.id || timeSlotIndex}
                  variant="outlined"
                  sx={{ p: 2, borderRadius: 1, bgcolor: "background.default" }}
                >
                  <TimeSlotSelector
                    timeSlot={timeSlot}
                    onChange={(field, value) =>
                      handleTimeSlotChange(
                        scheduleIndex,
                        timeSlotIndex,
                        field,
                        value
                      )
                    }
                    onRemove={() =>
                      removeTimeSlot(scheduleIndex, timeSlotIndex)
                    }
                    showRemoveButton={item.timeSlots.length > 1}
                    error={
                      error &&
                      error[scheduleIndex] &&
                      error[scheduleIndex].timeSlots &&
                      error[scheduleIndex].timeSlots[timeSlotIndex]
                    }
                    touched={
                      touched &&
                      touched[scheduleIndex] &&
                      touched[scheduleIndex].timeSlots &&
                      touched[scheduleIndex].timeSlots[timeSlotIndex]
                    }
                  />
                </Paper>
              ))}
            </Stack>

            <Button
              startIcon={<AddIcon />}
              onClick={() => addTimeSlot(scheduleIndex)}
              variant="outlined"
              size="small"
              sx={{ mt: 2 }}
            >
              Add Time Slot
            </Button>
          </CardContent>
        </Card>
      ))}

      <Button
        startIcon={<AddIcon />}
        onClick={addScheduleItem}
        variant="outlined"
        disabled={allWeekdaysUsed}
        sx={{ mb: 2 }}
      >
        Add Weekday
      </Button>

      {hasError && <FormHelperText error>{error}</FormHelperText>}
    </Box>
  );
}
