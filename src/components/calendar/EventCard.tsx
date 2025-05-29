"use client"
import React from 'react';
import { Clock, Settings, Droplets, Zap, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { CalendarEvent } from '@/types';
import { formatEventTime } from '@/lib/utils';

interface EventCardProps {
  event: CalendarEvent;
  onToggleAlarm: (eventId: string, enabled: boolean) => void;
  onOpenSettings: (event: CalendarEvent) => void;
}

export function EventCard({
  event,
  onToggleAlarm,
  onOpenSettings
}: EventCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
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
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Alarm Settings Indicators */}
            {event.isAlarmEnabled && (
              <div className="flex items-center space-x-1">
                {event.alarmSettings.sprayFlag && (
                  <div title="Water spray enabled">
                    <Droplets className="h-4 w-4 text-blue-500" />
                  </div>
                )}
                {event.alarmSettings.userPrompt && (
                  <div title="Custom message enabled">
                    <MessageSquare className="h-4 w-4 text-green-500" />
                  </div>
                )}
                {event.alarmSettings.receivers.length > 0 && (
                  <div title={`Email notifications: ${event.alarmSettings.receivers.join(', ')}`} className="relative">
                    <Zap className="h-4 w-4 text-orange-500" />
                    {event.alarmSettings.receivers.length > 1 && (
                      <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-3 w-3 flex items-center justify-center" style={{fontSize: '8px'}}>
                        {event.alarmSettings.receivers.length}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Alarm Toggle */}
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-sm text-gray-600">Alarm</span>
              <Switch
                checked={event.isAlarmEnabled}
                onCheckedChange={(checked) => {
                  onOpenSettings(event);
                }}
              />
            </div>

            {/* Settings Button */}
            {event.isAlarmEnabled && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenSettings(event)}
                className="h-8 w-8"
                title="Edit alarm settings"
              >
                <Settings className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 