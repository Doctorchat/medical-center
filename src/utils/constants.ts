import type { ConsultationStatus } from "@/types";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const CONSULTATION_STATUS: Record<number, ConsultationStatus> = {
  0: {
    label: "reserved",
    badgeColor: "gold",
  },
  1: {
    label: "confirmed",
    badgeColor: "green",
    type: "confirm",
  },
  2: {
    label: "cancelled",
    badgeColor: "red",
    type: "cancel",
  },
  3: {
    label: "completed",
    badgeColor: "blue",
    type: "complete",
  },
};

export const CONSULTATION_STATUS_LIST = Object.entries(CONSULTATION_STATUS).map(
  ([key, value]) => {
    return {
      value: key,
      ...value,
    };
  },
);
