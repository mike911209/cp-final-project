'use client';
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { LoginView } from '@/components/views/login-view';
import { CalendarView } from '@/components/views/calendar-view';
import { ActivityView } from '@/components/views/activity-view';
import { 
  ViewMode, 
  User, 
  CalendarEvent, 
  AlarmActivity, 
  Contact, 
  AlarmSettings,
  ActivityFilters,
  ActivityStatistics,
  CalendarFilters 
} from '@/types';
import { generateId } from '@/lib/utils';

export function App() {
  // State management
  const [currentView, setCurrentView] = useState<ViewMode>('login');
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Calendar state
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [calendarError, setCalendarError] = useState<string | null>(null);

  // Activity state
  const [activities, setActivities] = useState<AlarmActivity[]>([]);
  const [activityStatistics, setActivityStatistics] = useState<ActivityStatistics>({
    totalTriggers: 0,
    successRate: 0,
    averageWakeUpTime: 0,
    remedialActionsTriggered: 0,
  });
  const [activityError, setActivityError] = useState<string | null>(null);

  // Mock contacts data
  const [contacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'Emergency Contact',
      email: 'emergency@example.com',
      phone: '+1234567890',
      relationship: 'Family',
    },
    {
      id: '2',
      name: 'Roommate',
      email: 'roommate@example.com',
      phone: '+0987654321',
      relationship: 'Friend',
    },
  ]);

  // Initialize with mock data
  useEffect(() => {
    if (isAuthenticated) {
      loadMockData();
    }
  }, [isAuthenticated]);

  const loadMockData = () => {
    // Mock calendar events
    const mockEvents: CalendarEvent[] = [
      {
        id: '1',
        title: 'Morning Exercise',
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // 1 hour later
        description: 'Daily workout routine',
        location: 'Home Gym',
        calendarSource: 'Primary',
        isAlarmEnabled: true,
        alarmSettings: {
          enableWaterSpray: false,
          enableSlapping: true,
          customVoiceMessage: 'Time to get up and exercise!',
          reminderContactId: '1',
          reminderDelayMinutes: 5,
        },
      },
      {
        id: '2',
        title: 'Work Meeting',
        startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000), // Day after tomorrow at 9 AM
        endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000), // 1 hour later
        description: 'Team standup meeting',
        location: 'Office',
        calendarSource: 'Work',
        isAlarmEnabled: true,
        alarmSettings: {
          enableWaterSpray: true,
          enableSlapping: false,
          customVoiceMessage: 'Important meeting today!',
          reminderContactId: '2',
          reminderDelayMinutes: 10,
        },
      },
      {
        id: '3',
        title: 'Weekend Sleep In',
        startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000), // Weekend at 10 AM
        endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 11 * 60 * 60 * 1000), // 1 hour later
        description: 'Relaxing weekend morning',
        calendarSource: 'Personal',
        isAlarmEnabled: false,
        alarmSettings: {
          enableWaterSpray: false,
          enableSlapping: false,
          reminderDelayMinutes: 15,
        },
      },
    ];

    // Mock activity data
    const mockActivities: AlarmActivity[] = [
      {
        id: '1',
        eventId: '1',
        eventTitle: 'Morning Exercise',
        triggerTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        status: 'success',
        wakeUpTime: new Date(Date.now() - 24 * 60 * 60 * 1000 + 3 * 60 * 1000), // 3 minutes later
        sensorData: [
          {
            id: '1',
            type: 'pressure_mat',
            value: false,
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 + 3 * 60 * 1000),
          },
          {
            id: '2',
            type: 'infrared',
            value: true,
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 + 2 * 60 * 1000),
          },
        ],
        remedialActions: [
          {
            id: '1',
            type: 'slapping',
            triggerTime: new Date(Date.now() - 24 * 60 * 60 * 1000 + 2 * 60 * 1000),
            executed: true,
            result: 'Device activated successfully',
          },
        ],
        notes: 'User responded well to slapping device',
      },
      {
        id: '2',
        eventId: '2',
        eventTitle: 'Work Meeting',
        triggerTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        status: 'failed',
        sensorData: [
          {
            id: '3',
            type: 'pressure_mat',
            value: true,
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000),
          },
        ],
        remedialActions: [
          {
            id: '2',
            type: 'water_spray',
            triggerTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000),
            executed: true,
            result: 'Water spray activated',
          },
          {
            id: '3',
            type: 'email_notification',
            triggerTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000),
            executed: true,
            result: 'Email sent successfully',
            targetContact: contacts[1],
          },
        ],
        notes: 'User did not respond to alarm, email sent to emergency contact',
      },
    ];

    setEvents(mockEvents);
    setActivities(mockActivities);
    setActivityStatistics({
      totalTriggers: mockActivities.length,
      successRate: mockActivities.filter(a => a.status === 'success').length / mockActivities.length,
      averageWakeUpTime: 5.5,
      remedialActionsTriggered: mockActivities.reduce((sum, a) => sum + a.remedialActions.length, 0),
    });
  };

  // Authentication handlers
  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email === 'demo@example.com' && password === 'password') {
        const mockUser: User = {
          id: '1',
          email,
          deviceSerialNumber: 'ALARM123456',
          googleAccessToken: 'mock-token',
          isGoogleConnected: true,
          defaultContacts: contacts,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        setUser(mockUser);
        setIsAuthenticated(true);
        setCurrentView('calendar');
        setSuccess('Successfully signed in!');
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: {
    email: string;
    password: string;
    serialNumber: string;
    googleToken: string;
  }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockUser: User = {
        id: generateId(),
        email: data.email,
        deviceSerialNumber: data.serialNumber,
        googleAccessToken: data.googleToken,
        isGoogleConnected: true,
        defaultContacts: contacts,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      setCurrentView('calendar');
      setSuccess('Account created successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const token = `google-token-${Date.now()}`;
        resolve(token);
      }, 1000);
    });
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setCurrentView('login');
    setError(null);
    setSuccess(null);
    setEvents([]);
    setActivities([]);
  };

  // Calendar handlers
  const handleRefresh = async () => {
    setIsSyncing(true);
    try {
      // Simulate API call to refresh calendar data
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In a real app, this would fetch fresh data from Google Calendar API
      loadMockData();
    } catch (err) {
      setCalendarError('Failed to sync calendar data');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleToggleAlarm = (eventId: string, enabled: boolean) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, isAlarmEnabled: enabled }
        : event
    ));
  };

  const handleUpdateAlarmSettings = (eventId: string, settings: AlarmSettings) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, alarmSettings: settings }
        : event
    ));
  };

  const handleCalendarFilterChange = (filters: CalendarFilters) => {
    // In a real app, this would filter the events based on the filters
    console.log('Calendar filters changed:', filters);
  };

  // Activity handlers
  const handleActivityFilterChange = (filters: ActivityFilters) => {
    // In a real app, this would filter the activities based on the filters
    console.log('Activity filters changed:', filters);
  };

  const handleExportCSV = () => {
    // Generate CSV content
    const csvContent = [
      ['Date', 'Event', 'Status', 'Wake Up Time', 'Remedial Actions'].join(','),
      ...activities.map(activity => [
        activity.triggerTime.toISOString().split('T')[0],
        activity.eventTitle,
        activity.status,
        activity.wakeUpTime?.toISOString() || '',
        activity.remedialActions.map(a => a.type).join('; ')
      ].join(','))
    ].join('\n');

    // Download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alarm-activity-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Clear messages after a delay
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        currentView={currentView}
        isAuthenticated={isAuthenticated}
        user={user ? {
          email: user.email,
          isGoogleConnected: user.isGoogleConnected,
        } : undefined}
        isSyncing={isSyncing}
        onViewChange={setCurrentView}
        onRefresh={handleRefresh}
        onLogout={handleLogout}
      />

      {currentView === 'login' && (
        <LoginView
          onLogin={handleLogin}
          onRegister={handleRegister}
          onGoogleAuth={handleGoogleAuth}
          isLoading={isLoading}
          error={error}
          success={success}
          googleConnected={user?.isGoogleConnected}
        />
      )}

      {currentView === 'calendar' && isAuthenticated && (
        <CalendarView
          events={events}
          contacts={contacts}
          isLoading={false}
          error={calendarError}
          onToggleAlarm={handleToggleAlarm}
          onUpdateAlarmSettings={handleUpdateAlarmSettings}
          onFilterChange={handleCalendarFilterChange}
        />
      )}

      {currentView === 'activity' && isAuthenticated && (
        <ActivityView
          activities={activities}
          statistics={activityStatistics}
          isLoading={false}
          error={activityError}
          onFilterChange={handleActivityFilterChange}
          onExportCSV={handleExportCSV}
        />
      )}
    </div>
  );
} 