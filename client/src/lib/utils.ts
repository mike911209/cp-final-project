import { clsx, type ClassValue } from "clsx";
import { format, formatDistanceToNow, isToday, isTomorrow, isYesterday } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatEventTime(date: Date): string {
  if (isToday(date)) {
    return `Today ${format(date, 'HH:mm')}`;
  }
  if (isTomorrow(date)) {
    return `Tomorrow ${format(date, 'HH:mm')}`;
  }
  if (isYesterday(date)) {
    return `Yesterday ${format(date, 'HH:mm')}`;
  }
  console.log("date: ", date);
  return format(date, 'MMM dd HH:mm');
}

export function formatRelativeTime(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}

export function formatSuccessRate(rate: number): string {
  return `${Math.round(rate * 100)}%`;
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateSerialNumber(serialNumber: string): boolean {
  // Assume serial number should be alphanumeric and at least 8 characters
  const serialRegex = /^[A-Za-z0-9]{8,}$/;
  return serialRegex.test(serialNumber);
}

export function getStatusIcon(status: 'success' | 'in_progress' | 'failed'): string {
  switch (status) {
    case 'success':
      return '✅';
    case 'in_progress':
      return '🔄';
    case 'failed':
      return '❌';
    default:
      return '⏸️';
  }
}

export function getStatusColor(status: 'success' | 'in_progress' | 'failed'): string {
  switch (status) {
    case 'success':
      return 'text-green-600';
    case 'in_progress':
      return 'text-blue-600';
    case 'failed':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
} 

