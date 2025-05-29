"use client"
import React from 'react';
import { Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarEvent } from '@/types';
import { EventCard } from './EventCard';

interface EventListProps {
  groupedEvents: Record<string, CalendarEvent[]>;
  onToggleAlarm: (eventId: string, enabled: boolean) => void;
  onOpenSettings: (event: CalendarEvent) => void;
  isLoading: boolean;
  searchQuery: string;
}

export function EventList({
  groupedEvents,
  onToggleAlarm,
  onOpenSettings,
  isLoading,
  searchQuery
}: EventListProps) {
  const hasEvents = Object.keys(groupedEvents).length > 0;

  if (!hasEvents && !isLoading) {
    return (
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
    );
  }

  return (
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
              <EventCard
                key={event.id}
                event={event}
                onToggleAlarm={onToggleAlarm}
                onOpenSettings={onOpenSettings}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 