"use client";

import React from "react";
import { Chip } from "@mui/material";
import { CampaignStatus } from "@/types/compaign.types";

// Map status to chip color and label
const statusConfig: Record<
  CampaignStatus,
  {
    color:
      | "success"
      | "info"
      | "default"
      | "error"
      | "warning"
      | "primary"
      | "secondary";
    label: string;
  }
> = {
  active: { color: "success", label: "Active" },
  upcoming: { color: "info", label: "Upcoming" },
  ended: { color: "default", label: "Ended" },
};

interface StatusChipProps {
  status: CampaignStatus;
  size?: "small" | "medium";
}

export default function StatusChip({
  status,
  size = "small",
}: StatusChipProps) {
  const config = statusConfig[status];

  return (
    <Chip
      label={config.label}
      color={config.color}
      size={size}
      sx={{ fontWeight: 500 }}
    />
  );
}
