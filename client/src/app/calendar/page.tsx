"use client"
import React, { useState } from 'react';
import { CalendarEvent, AlarmSettings, CalendarFilters as CalendarFiltersType } from '@/types';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';
import Loading from '@/components/ui/loading';
import { CalendarFilters, EventList, EventSettingsDialog } from '@/components/calendar';
import { useCalendar } from '@/hooks/useCalendar';

export default function CalendarPage() {
  const router = useRouter();
  const { user, isSyncing } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsForm, setSettingsForm] = useState<AlarmSettings>({
    sprayFlag: false,
    userPrompt: '',
    alarmInterval: 5,
    alarmRepeatTimes: 3,
    receivers: [],
  });
  const [isSettingsLoading, setIsSettingsLoading] = useState(false);

  const {
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
  } = useCalendar({ userToken: user?.token });

  // Filter and group events
  const filteredEvents = filterEvents(searchQuery);
  const groupedEvents = groupEventsByDate(filteredEvents);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    handleCalendarFilterChange({
      searchQuery: query,
      dateRange: { start: new Date(), end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
      calendarSources: [],
    });
  };

  const handleOpenSettings = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setSettingsForm(event.alarmSettings);
    setIsSettingsOpen(true);
    setError(null);
  };

  const handleCloseSettings = () => {
    setIsSettingsOpen(false);
    setSelectedEvent(null);
    setError(null);
  };

  const handleSaveSettings = async () => {
    if (selectedEvent) {
      setIsSettingsLoading(true);
      try {
        await createAlarm(selectedEvent, settingsForm);
        updateAlarmSettings(selectedEvent.id, settingsForm);
        toggleAlarm(selectedEvent.id, true);
        setError(null);
        handleCloseSettings();
      } catch (error) {
        console.error('Error creating alarm:', error);
        setError('Failed to create alarm. Please try again.');
      } finally {
        setIsSettingsLoading(false);
      }
    }
  };

  const handleDeleteAlarm = async () => {
    if (selectedEvent) {
      setIsSettingsLoading(true);
      try {
        console.log(selectedEvent.id);
        await deleteAlarm(selectedEvent.id);
        toggleAlarm(selectedEvent.id, false);
        updateAlarmSettings(selectedEvent.id, {
          sprayFlag: false,
          userPrompt: '',
          alarmInterval: 5,
          alarmRepeatTimes: 3,
          receivers: [],
        });
        setError(null);
        handleCloseSettings();
      } catch (error) {
        console.error('Error deleting alarm:', error);
        setError('Failed to delete alarm. Please try again.');
      } finally {
        setIsSettingsLoading(false);
      }
    }
  };

  const handleSettingsChange = (field: keyof AlarmSettings, value: any) => {
    setSettingsForm(prev => ({ ...prev, [field]: value }));
  };

  const handleToggleAlarm = (eventId: string, enabled: boolean) => {
    if (enabled) {
      const event = events.find(e => e.id === eventId);
      if (event) {
        handleOpenSettings(event);
      }
    } else {
      toggleAlarm(eventId, false);
    }
  };

  const handleCalendarFilterChange = (filters: CalendarFiltersType) => {
    console.log('Calendar filters changed:', filters);
  };

  const handleRefresh = async () => {
    if (!isSyncing) {
      await loadCalendarEvents();
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filter Panel */}
          <div className="lg:col-span-1">
            <CalendarFilters
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              onRefresh={handleRefresh}
              isSyncing={isSyncing}
            />
          </div>

          {/* Events List */}
          <div className="lg:col-span-3">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <EventList
              groupedEvents={groupedEvents}
              onToggleAlarm={handleToggleAlarm}
              onOpenSettings={handleOpenSettings}
              isLoading={isLoading}
              searchQuery={searchQuery}
            />
          </div>
        </div>

        {/* Event Settings Dialog */}
        <EventSettingsDialog
          isOpen={isSettingsOpen}
          onClose={handleCloseSettings}
          selectedEvent={selectedEvent}
          settingsForm={settingsForm}
          onSettingsChange={handleSettingsChange}
          onSaveSettings={handleSaveSettings}
          onDeleteAlarm={handleDeleteAlarm}
          userContacts={user?.defaultContacts || []}
          error={error}
          isLoading={isSettingsLoading}
        />
      </div>
    </div>
  );
} 