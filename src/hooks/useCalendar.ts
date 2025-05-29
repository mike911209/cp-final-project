import { useState, useEffect } from 'react';
import { CalendarEvent, AlarmSettings } from '@/types';

interface UseCalendarProps {
  userToken?: string;
}

export function useCalendar({ userToken }: UseCalendarProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCalendarEvents = async () => {
    if (!userToken) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('https://kiciu82fdd.execute-api.us-east-1.amazonaws.com/prod/calendar', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${userToken}`,
        },
      });
      const data = await response.json();
      console.log("loaded events", data);
      setEvents(data.events.map((event: any) => ({
        id: event.id,
        title: event.summary || 'No title',
        startTime: new Date(event.start.dateTime),
        endTime: new Date(event.end?.dateTime || event.start.dateTime),
        description: event.description || '',
        isAlarmEnabled: false,
        alarmSettings: {
          sprayFlag: false,
          userPrompt: '',
          alarmInterval: 5,
          alarmRepeatTimes: 3,
          receivers: [],
        },
      })));
      setError(null);
    } catch (error) {
      console.error('Error loading calendar events:', error);
      setError('Failed to load calendar events. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAlarm = (eventId: string, enabled: boolean) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, isAlarmEnabled: enabled }
        : event
    ));
  };

  const updateAlarmSettings = (eventId: string, settings: AlarmSettings) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, alarmSettings: settings }
        : event
    ));
  };

  const createAlarm = async (event: CalendarEvent, settings: AlarmSettings) => {
    if (!userToken) throw new Error('No user token available');

    const eventData = {
      id: event.id,
      start: {
        dateTime: event.startTime.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      spray_flag: settings.sprayFlag,
      user_prompt: settings.userPrompt,
      alarm_interval: settings.alarmInterval,
      alarm_repeat_times: settings.alarmRepeatTimes,
      receivers: settings.receivers
    };

    const response = await fetch('https://kiciu82fdd.execute-api.us-east-1.amazonaws.com/prod/alarm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        event: JSON.stringify(eventData)
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create alarm');
    }

    return response.json();
  };

  const deleteAlarm = async (eventId: string) => {
    if (!userToken) throw new Error('No user token available');
    console.log(eventId);
    const response = await fetch('https://kiciu82fdd.execute-api.us-east-1.amazonaws.com/prod/alarm', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        event_id: eventId,
        schedule_name: "test"
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to delete alarm');
    }

    return response.json();
  };

  const filterEvents = (searchQuery: string) => {
    return events.filter(event =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const groupEventsByDate = (filteredEvents: CalendarEvent[]) => {
    return filteredEvents.reduce((groups, event) => {
      const dateKey = event.startTime.toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(event);
      return groups;
    }, {} as Record<string, CalendarEvent[]>);
  };

  // Load events when user token changes
  useEffect(() => {
    if (userToken) {
      loadCalendarEvents();
    }
  }, [userToken]);

  return {
    events,
    isLoading,
    error,
    setError,
    loadCalendarEvents,
    toggleAlarm,
    updateAlarmSettings,
    createAlarm,
    deleteAlarm,
    filterEvents,
    groupEventsByDate,
  };
} 