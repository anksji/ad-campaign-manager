export type CampaignType =
  | "Cost per Order"
  | "Cost per Click"
  | "Buy One Get One";

export type WeekDay =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

export type CampaignStatus = "active" | "upcoming" | "ended";

export interface TimeSlot {
  id?: string;
  startTime: string;
  endTime: string;
}

export interface ScheduleItem {
  id?: string;
  weekday: WeekDay;
  timeSlots: TimeSlot[];
}

export interface Campaign {
  id: string;
  title: string;
  purpose: string;
  type: CampaignType;
  startDate: string;
  endDate: string;
  schedule: ScheduleItem[];
  nextActivation?: string;
  status?: CampaignStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCampaignDto {
  title: string;
  purpose: string;
  type: CampaignType;
  startDate: string;
  endDate: string;
  schedule: ScheduleItem[];
}

export interface UpdateCampaignDto extends CreateCampaignDto {
  id: string;
}

export interface CampaignFilter {
  title?: string;
  type?: CampaignType | "";
  status?: CampaignStatus | "";
}
