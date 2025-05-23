"use client"
import React, { useState, useEffect } from 'react';
import { Search, Calendar, Settings, Clock, MoreHorizontal, Droplets, Zap, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { CalendarEvent, Contact, AlarmSettings } from '@/types';
import { formatEventTime } from '@/lib/utils';
import { useUser } from '@/contexts/UserContext';
import { CalendarFilters } from '@/types';

export default function CalendarPage() {
  const { user, isAuthenticated, isSyncing, login } = useUser();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsForm, setSettingsForm] = useState<AlarmSettings>({
    enableWaterSpray: false,
    enableSlapping: false,
    customVoiceMessage: '',
    reminderContactId: '',
    reminderDelayMinutes: 5,
  });
  const [error, setError] = useState<string | null>(null);

  // Filter events based on search query
  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group events by date
  const groupedEvents = filteredEvents.reduce((groups, event) => {
    const dateKey = event.startTime.toDateString();
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(event);
    return groups;
  }, {} as Record<string, CalendarEvent[]>);

  useEffect(() => {
    if (user) {
      loadMockData();
    }
  }, [user]);

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
    setEvents(mockEvents);
  }


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
  };

  const handleCloseSettings = () => {
    setIsSettingsOpen(false);
    setSelectedEvent(null);
  };

  const handleSaveSettings = () => {
    if (selectedEvent) {
      handleUpdateAlarmSettings(selectedEvent.id, settingsForm);
    }
    handleCloseSettings();
  };

  const handleSettingsChange = (field: keyof AlarmSettings, value: any) => {
    setSettingsForm(prev => ({ ...prev, [field]: value }));
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

  if (isLoading) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading calendar events...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filter Panel */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="text-lg">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Events
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Filter by title..."
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Date Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Range
                  </label>
                  <div className="space-y-2">
                    <Input type="date" placeholder="From" />
                    <Input type="date" placeholder="To" />
                  </div>
                </div>

                {/* Calendar Sources */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Calendar Sources
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span className="text-sm">Primary Calendar</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span className="text-sm">Work Calendar</span>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Events List */}
          <div className="lg:col-span-3">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="space-y-6">
              {Object.entries(groupedEvents).map(([dateKey, dayEvents]) => (
                <div key={dateKey}>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    {new Date(dateKey).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </h2>
                  
                  <div className="space-y-3">
                    {dayEvents.map((event) => (
                      <Card key={event.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2">
                                    <Clock className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm font-medium text-gray-900">
                                      {formatEventTime(event.startTime)}
                                    </span>
                                  </div>
                                  <h3 className="text-lg font-medium text-gray-900 mt-1">
                                    {event.title}
                                  </h3>
                                  {event.description && (
                                    <p className="text-sm text-gray-600 mt-1">
                                      {event.description}
                                    </p>
                                  )}
                                  {event.location && (
                                    <p className="text-sm text-gray-500 mt-1">
                                      📍 {event.location}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-3">
                              {/* Alarm Settings Indicators */}
                              {event.isAlarmEnabled && (
                                <div className="flex items-center space-x-1">
                                  {event.alarmSettings.enableWaterSpray && (
                                    <div title="Water spray enabled">
                                      <Droplets className="h-4 w-4 text-blue-500" />
                                    </div>
                                  )}
                                  {event.alarmSettings.enableSlapping && (
                                    <div title="Slapping device enabled">
                                      <Zap className="h-4 w-4 text-orange-500" />
                                    </div>
                                  )}
                                  {event.alarmSettings.customVoiceMessage && (
                                    <div title="Custom voice message">
                                      <MessageSquare className="h-4 w-4 text-green-500" />
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Alarm Toggle */}
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">Alarm</span>
                                <Switch
                                  checked={event.isAlarmEnabled}
                                  onCheckedChange={(checked) => handleToggleAlarm(event.id, checked)}
                                />
                              </div>

                              {/* Settings Button */}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleOpenSettings(event)}
                                className="h-8 w-8"
                              >
                                <Settings className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}

              {filteredEvents.length === 0 && !isLoading && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
                    <p className="text-gray-600">
                      {searchQuery
                        ? 'Try adjusting your search filters'
                        : 'No calendar events in the selected time range'}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Event Settings Dialog */}
        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Alarm Settings</DialogTitle>
            </DialogHeader>

            {selectedEvent && (
              <div className="space-y-4">
                {/* Event Info */}
                <div className="p-3 bg-gray-50 rounded-md">
                  <h4 className="font-medium text-gray-900">{selectedEvent.title}</h4>
                  <p className="text-sm text-gray-600">
                    {formatEventTime(selectedEvent.startTime)}
                  </p>
                </div>

                {/* Remedial Actions */}
                <div className="space-y-3">
                  <h5 className="font-medium text-gray-900">Remedial Actions</h5>
                  
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={settingsForm.enableWaterSpray}
                      onChange={(e) => handleSettingsChange('enableWaterSpray', e.target.checked)}
                      className="rounded"
                    />
                    <Droplets className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Enable water spray</span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={settingsForm.enableSlapping}
                      onChange={(e) => handleSettingsChange('enableSlapping', e.target.checked)}
                      className="rounded"
                    />
                    <Zap className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">Enable slapping device</span>
                  </label>
                </div>

                {/* Custom Voice Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Voice Message
                  </label>
                  <textarea
                    value={settingsForm.customVoiceMessage || ''}
                    onChange={(e) => handleSettingsChange('customVoiceMessage', e.target.value)}
                    placeholder="Enter a custom wake-up message..."
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    rows={3}
                  />
                </div>

                {/* Email Notification */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    If still in bed after
                  </label>
                  <div className="flex items-center space-x-2">
                    <select
                      value={settingsForm.reminderDelayMinutes}
                      onChange={(e) => handleSettingsChange('reminderDelayMinutes', parseInt(e.target.value))}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                    >
                      <option value={3}>3 minutes</option>
                      <option value={5}>5 minutes</option>
                      <option value={10}>10 minutes</option>
                      <option value={15}>15 minutes</option>
                    </select>
                    <span className="text-sm text-gray-600">send email to:</span>
                  </div>
                  <select
                    value={settingsForm.reminderContactId || ''}
                    onChange={(e) => handleSettingsChange('reminderContactId', e.target.value)}
                    className="w-full mt-2 border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="">Select a contact...</option>
                    {user?.defaultContacts.map((contact: Contact) => (
                      <option key={contact.id} value={contact.id}>
                        {contact.name} ({contact.email})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={handleCloseSettings}>
                Cancel
              </Button>
              <Button onClick={handleSaveSettings}>
                Save Settings
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
} 