import {
  ScheduleItem,
  TimeSlot,
  WeekDay,
  CampaignStatus,
} from "@/types/compaign.types";
import {
  addDays,
  format,
  parse,
  isAfter,
  isBefore,
  isEqual,
  parseISO,
  isToday,
  setHours,
  setMinutes,
} from "date-fns";

// Map weekday string to number (0-6, Sunday is 0)
export const weekdayToNumber = (weekday: WeekDay): number => {
  const map: Record<WeekDay, number> = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };
  return map[weekday];
};

// Map number to weekday (0-6, Sunday is 0)
export const numberToWeekday = (num: number): WeekDay => {
  const weekdays: WeekDay[] = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return weekdays[num % 7];
};

// Parse time string (HH:MM) to hours and minutes
export const parseTime = (
  timeStr: string
): { hours: number; minutes: number } => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return { hours, minutes };
};

// Set time on a date object
export const setTime = (date: Date, timeStr: string): Date => {
  const { hours, minutes } = parseTime(timeStr);
  return setMinutes(setHours(new Date(date), hours), minutes);
};

// Format time for display
export const formatTime = (timeStr: string): string => {
  const { hours, minutes } = parseTime(timeStr);
  return format(setMinutes(setHours(new Date(), hours), minutes), "h:mm a");
};

// Format time range for display
export const formatTimeRange = (start: string, end: string): string => {
  return `${formatTime(start)} - ${formatTime(end)}`;
};

// Get days until next occurrence of a weekday
export const getDaysUntilWeekday = (targetWeekday: WeekDay): number => {
  const today = new Date();
  const currentDayNum = today.getDay();
  const targetDayNum = weekdayToNumber(targetWeekday);

  // Calculate days until next occurrence
  return (targetDayNum + 7 - currentDayNum) % 7;
};

// Get the next occurrence of a specific weekday
export const getNextWeekdayDate = (weekday: WeekDay): Date => {
  const daysUntil = getDaysUntilWeekday(weekday);
  return addDays(new Date(), daysUntil);
};

// Calculate campaign status based on dates
export const getCampaignStatus = (
  startDate: string,
  endDate: string
): CampaignStatus => {
  const now = new Date();
  const start = parseISO(startDate);
  const end = parseISO(endDate);

  if (isAfter(now, end)) {
    return "ended";
  } else if (isBefore(now, start)) {
    return "upcoming";
  } else {
    return "active";
  }
};

// Format next activation time for display
export const formatNextActivation = (
  nextActivation: string | undefined
): string => {
  if (!nextActivation) return "None scheduled";

  const date = parseISO(nextActivation);

  if (isToday(date)) {
    return `Today at ${format(date, "h:mm a")}`;
  }

  return format(date, "EEE, MMM d, yyyy h:mm a");
};

// Generate a unique ID for new items
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

// Create a new empty schedule item
export const createEmptyScheduleItem = (weekday?: WeekDay): ScheduleItem => {
  return {
    id: generateId(),
    weekday: weekday || "Monday",
    timeSlots: [createEmptyTimeSlot()],
  };
};

// Create a new empty time slot
export const createEmptyTimeSlot = (): TimeSlot => {
  return {
    id: generateId(),
    startTime: "09:00",
    endTime: "17:00",
  };
};

// Default schedule for new campaigns (Monday-Friday, 9-5)
export const getDefaultSchedule = (): ScheduleItem[] => {
  return [
    {
      id: generateId(),
      weekday: "Monday",
      timeSlots: [{ id: generateId(), startTime: "09:00", endTime: "17:00" }],
    },
  ];
};

/**
 * Ensures schedule data is validity check, providing defaults if not
 * @param schedule The schedule to validate
 * @returns A valid schedule array
 */
export function ensureValidSchedule(
  schedule?: ScheduleItem[] | null
): ScheduleItem[] {
  // If schedule is undefined, null, or not an array
  if (!schedule || !Array.isArray(schedule) || schedule.length === 0) {
    return getDefaultSchedule();
  }

  // Validate each schedule item has at least one time slot
  return schedule.map((item) => {
    // If time slots are missing or empty, add a default time slot
    if (
      !item.timeSlots ||
      !Array.isArray(item.timeSlots) ||
      item.timeSlots.length === 0
    ) {
      return {
        ...item,
        timeSlots: [createEmptyTimeSlot()],
      };
    }

    // Ensure each time slot has an ID
    const validatedTimeSlots = item.timeSlots.map((slot) => ({
      ...slot,
      id: slot.id || generateId(),
    }));

    return {
      ...item,
      id: item.id || generateId(),
      timeSlots: validatedTimeSlots,
    };
  });
}
