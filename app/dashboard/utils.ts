// This file will store shared utility functions
import type { Timestamp } from './types';

export const formatRelativeTimestamp = (timestamp: Timestamp): string => {
  const now = new Date();
  const then = new Date(timestamp);
  const diffInSeconds = Math.round((now.getTime() - then.getTime()) / 1000);

  if (diffInSeconds < 5) return "just now";
  if (diffInSeconds < 60) return `${diffInSeconds} sec ago`;

  const diffInMinutes = Math.round(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} min ago`;

  const diffInHours = Math.round(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hr ago`;

  const diffInDays = Math.round(diffInHours / 24);
  if (diffInDays === 1) return "yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;

  return then.toLocaleDateString([], { month: "short", day: "numeric" });
};

export const formatExactTimestamp = (timestamp: Timestamp): string => {
  const then = new Date(timestamp);
  return then.toLocaleString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatShortTimeForFlow = (timestamp: Timestamp): string => {
  const then = new Date(timestamp);
  return then.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Add other shared utility functions here as they are identified and moved.
