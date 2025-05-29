"use client"
import React, { useRef } from 'react';
import { Droplets } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { CalendarEvent, Contact, AlarmSettings } from '@/types';
import { formatEventTime } from '@/lib/utils';

interface EventSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEvent: CalendarEvent | null;
  settingsForm: AlarmSettings;
  onSettingsChange: (field: keyof AlarmSettings, value: any) => void;
  onSaveSettings: () => void;
  onDeleteAlarm: () => void;
  userContacts: Contact[];
  error: string | null;
  isLoading: boolean;
}

export function EventSettingsDialog({
  isOpen,
  onClose,
  selectedEvent,
  settingsForm,
  onSettingsChange,
  onSaveSettings,
  onDeleteAlarm,
  userContacts,
  error,
  isLoading
}: EventSettingsDialogProps) {
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Email validation helper
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAddEmail = () => {
    const email = emailInputRef.current?.value.trim() || '';
    if (email && isValidEmail(email) && !settingsForm.receivers.includes(email)) {
      onSettingsChange('receivers', [...settingsForm.receivers, email]);
      if (emailInputRef.current) {
        emailInputRef.current.value = '';
      }
    } else if (email && !isValidEmail(email)) {
      alert('Please enter a valid email address');
    } else if (email && settingsForm.receivers.includes(email)) {
      alert('This email is already added');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddEmail();
    }
  };

  const handleRemoveEmail = (index: number) => {
    const newReceivers = settingsForm.receivers.filter((_, i) => i !== index);
    onSettingsChange('receivers', newReceivers);
  };

  if (!selectedEvent) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] flex flex-col overflow-y-auto">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Alarm Settings</DialogTitle>
          <DialogDescription>
            Configure alarm settings for this calendar event including water spray, custom messages, and email notifications.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto flex-1 px-1">
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Event Info */}
          <div className="p-3 bg-gray-50 rounded-md">
            <h4 className="font-medium text-gray-900">{selectedEvent.title}</h4>
            <p className="text-sm text-gray-600">
              {formatEventTime(selectedEvent.startTime)}
            </p>
          </div>

          {/* Water Spray Flag */}
          <div className="space-y-3">
            <h5 className="font-medium text-gray-900">Alarm Settings</h5>
            
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settingsForm.sprayFlag}
                onChange={(e) => onSettingsChange('sprayFlag', e.target.checked)}
                className="rounded"
              />
              <Droplets className="h-4 w-4 text-blue-500" />
              <span className="text-sm">Enable water spray</span>
            </label>
          </div>

          {/* User Prompt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Wake-up Message
            </label>
            <textarea
              value={settingsForm.userPrompt || ''}
              onChange={(e) => onSettingsChange('userPrompt', e.target.value)}
              placeholder="Enter a custom wake-up message..."
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              rows={3}
            />
          </div>

          {/* Alarm Interval */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alarm Interval (minutes)
            </label>
            <select
              value={settingsForm.alarmInterval}
              onChange={(e) => onSettingsChange('alarmInterval', parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value={1}>1 minute</option>
              <option value={3}>3 minutes</option>
              <option value={5}>5 minutes</option>
              <option value={10}>10 minutes</option>
              <option value={15}>15 minutes</option>
            </select>
          </div>

          {/* Alarm Repeat Times */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Repeat Times
            </label>
            <select
              value={settingsForm.alarmRepeatTimes}
              onChange={(e) => onSettingsChange('alarmRepeatTimes', parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value={1}>1 time</option>
              <option value={2}>2 times</option>
              <option value={3}>3 times</option>
              <option value={5}>5 times</option>
              <option value={10}>10 times</option>
            </select>
          </div>

          {/* Receivers */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Email Notification Recipients
              </label>
              {settingsForm.receivers.length > 0 && (
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {settingsForm.receivers.length} recipient{settingsForm.receivers.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            
            {/* Current Receivers List */}
            {settingsForm.receivers.length > 0 && (
              <div className="mb-3 space-y-2">
                {settingsForm.receivers.map((email, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                    <span className="text-sm text-gray-700">{email}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveEmail(index)}
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Receiver Options */}
            <div className="space-y-2">
              {/* Select from Contacts */}
              <div>
                <select
                  value=""
                  onChange={(e) => {
                    if (e.target.value && !settingsForm.receivers.includes(e.target.value)) {
                      onSettingsChange('receivers', [...settingsForm.receivers, e.target.value]);
                    }
                  }}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="">Select from contacts...</option>
                  {userContacts
                    .filter(contact => !settingsForm.receivers.includes(contact.email))
                    .map((contact) => (
                      <option key={contact.id} value={contact.email}>
                        {contact.name} ({contact.email})
                      </option>
                    ))}
                </select>
              </div>

              {/* Manual Email Input */}
              <div className="flex space-x-2">
                <input
                  ref={emailInputRef}
                  type="email"
                  placeholder="Enter email address..."
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
                  onKeyPress={handleKeyPress}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddEmail}
                >
                  Add
                </Button>
              </div>
            </div>

            {/* Helper Text */}
            <p className="mt-2 text-xs text-gray-500">
              Select from your contacts or manually enter email addresses. Press Enter or click Add to add an email.
            </p>
          </div>
        </div>

        <DialogFooter className="flex-shrink-0">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          {selectedEvent?.isAlarmEnabled && (
            <Button 
              variant="destructive" 
              onClick={onDeleteAlarm}
              disabled={isLoading}
            >
              {isLoading ? 'Deleting...' : 'Delete Alarm'}
            </Button>
          )}
          <Button 
            onClick={onSaveSettings}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Settings'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 