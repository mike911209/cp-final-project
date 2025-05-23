export interface User {
  id: string;
  email: string;
  deviceSerialNumber?: string;
  googleAccessToken?: string;
  isGoogleConnected: boolean;
  defaultContacts: Contact[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  relationship: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  description?: string;
  location?: string;
  calendarSource: string;
  isAlarmEnabled: boolean;
  alarmSettings: AlarmSettings;
}

export interface AlarmSettings {
  enableWaterSpray: boolean;
  enableSlapping: boolean;
  customVoiceMessage?: string;
  reminderContactId?: string;
  reminderDelayMinutes: number;
}

export interface AlarmActivity {
  id: string;
  eventId: string;
  eventTitle: string;
  triggerTime: Date;
  status: 'success' | 'in_progress' | 'failed';
  sensorData: SensorReading[];
  remedialActions: RemedialAction[];
  wakeUpTime?: Date;
  notes?: string;
}

export interface SensorReading {
  id: string;
  type: 'pressure_mat' | 'infrared' | 'camera' | 'microphone';
  value: number | boolean | string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface RemedialAction {
  id: string;
  type: 'water_spray' | 'slapping' | 'email_notification' | 'sms_notification';
  triggerTime: Date;
  executed: boolean;
  result?: string;
  targetContact?: Contact;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface CalendarState {
  events: CalendarEvent[];
  isLoading: boolean;
  error: string | null;
  filters: CalendarFilters;
  lastSync: Date | null;
}

export interface CalendarFilters {
  searchQuery: string;
  dateRange: {
    start: Date;
    end: Date;
  };
  calendarSources: string[];
}

export interface ActivityState {
  activities: AlarmActivity[];
  isLoading: boolean;
  error: string | null;
  filters: ActivityFilters;
  statistics: ActivityStatistics;
}

export interface ActivityFilters {
  dateRange: {
    start: Date;
    end: Date;
  };
  status?: 'success' | 'in_progress' | 'failed';
}

export interface ActivityStatistics {
  totalTriggers: number;
  successRate: number;
  averageWakeUpTime: number;
  remedialActionsTriggered: number;
}

export type ViewMode = 'login' | 'calendar' | 'activity';

export interface AppState {
  currentView: ViewMode;
  auth: AuthState;
  calendar: CalendarState;
  activity: ActivityState;
} 