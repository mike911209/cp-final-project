import React, { useState } from 'react';
import { Calendar, Download, ChevronDown, ChevronRight, Clock, Zap, Droplets, Mail, Smartphone, Eye, Mic, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlarmActivity, ActivityFilters, ActivityStatistics } from '@/types';
import { formatEventTime, formatRelativeTime, getStatusIcon, getStatusColor, formatSuccessRate } from '@/lib/utils';

interface ActivityViewProps {
  activities: AlarmActivity[];
  statistics: ActivityStatistics;
  isLoading: boolean;
  error?: string | null;
  onFilterChange: (filters: ActivityFilters) => void;
  onExportCSV: () => void;
}

export function ActivityView({
  activities,
  statistics,
  isLoading,
  error,
  onFilterChange,
  onExportCSV,
}: ActivityViewProps) {
  const [expandedActivity, setExpandedActivity] = useState<string | null>(null);
  const [filters, setFilters] = useState<ActivityFilters>({
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      end: new Date(),
    },
  });

  const handleFilterChange = (newFilters: Partial<ActivityFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const toggleActivityExpansion = (activityId: string) => {
    setExpandedActivity(expandedActivity === activityId ? null : activityId);
  };

  const getSensorIcon = (type: string) => {
    switch (type) {
      case 'pressure_mat':
        return <div className="w-4 h-4 bg-purple-500 rounded-full" title="Pressure Mat" />;
      case 'infrared':
        return <Eye className="h-4 w-4 text-red-500" />;
      case 'camera':
        return <Camera className="h-4 w-4 text-blue-500" />;
      case 'microphone':
        return <Mic className="h-4 w-4 text-green-500" />;
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'water_spray':
        return <Droplets className="h-4 w-4 text-blue-500" />;
      case 'slapping':
        return <Zap className="h-4 w-4 text-orange-500" />;
      case 'email_notification':
        return <Mail className="h-4 w-4 text-gray-600" />;
      case 'sms_notification':
        return <Smartphone className="h-4 w-4 text-green-600" />;
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  if (isLoading) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading activity history...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Activity History</h1>
            <p className="text-gray-600 mt-1">View and analyze your alarm history</p>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Date Filters */}
            <div className="flex items-center space-x-2">
              <Input
                type="date"
                value={filters.dateRange.start.toISOString().split('T')[0]}
                onChange={(e) => handleFilterChange({
                  dateRange: {
                    ...filters.dateRange,
                    start: new Date(e.target.value),
                  },
                })}
                className="w-40"
              />
              <span className="text-gray-500">to</span>
              <Input
                type="date"
                value={filters.dateRange.end.toISOString().split('T')[0]}
                onChange={(e) => handleFilterChange({
                  dateRange: {
                    ...filters.dateRange,
                    end: new Date(e.target.value),
                  },
                })}
                className="w-40"
              />
            </div>
            
            <Button
              variant="outline"
              onClick={onExportCSV}
              className="flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-gray-700" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Triggers</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.totalTriggers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <div className="h-6 w-6 text-gray-700 flex items-center justify-center text-lg">✅</div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatSuccessRate(statistics.successRate)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Clock className="h-6 w-6 text-gray-700" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Wake Time</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(statistics.averageWakeUpTime)}m
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Zap className="h-6 w-6 text-gray-700" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Remedial Actions</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.remedialActionsTriggered}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activities Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            {activities.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
                <p className="text-gray-600">No alarm activities in the selected date range</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    {/* Activity Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getStatusIcon(activity.status)}</span>
                          <div>
                            <h4 className="font-medium text-gray-900">{activity.eventTitle}</h4>
                            <p className="text-sm text-gray-600">
                              {formatEventTime(activity.triggerTime)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        {/* Quick Stats */}
                        <div className="flex items-center space-x-3 text-sm text-gray-600">
                          {activity.status === 'success' && activity.wakeUpTime && (
                            <span>
                              Woke up {formatRelativeTime(activity.wakeUpTime)}
                            </span>
                          )}
                          {activity.remedialActions.length > 0 && (
                            <div className="flex items-center space-x-1">
                              {activity.remedialActions.slice(0, 3).map((action, index) => (
                                <div key={index} title={action.type}>
                                  {getActionIcon(action.type)}
                                </div>
                              ))}
                              {activity.remedialActions.length > 3 && (
                                <span className="text-xs">+{activity.remedialActions.length - 3}</span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Expand/Collapse Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleActivityExpansion(activity.id)}
                        >
                          {expandedActivity === activity.id ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                          Details
                        </Button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {expandedActivity === activity.id && (
                      <div className="mt-6 space-y-6 border-t border-gray-200 pt-6">
                        {/* Sensor Data */}
                        {activity.sensorData.length > 0 && (
                          <div>
                            <h5 className="font-medium text-gray-900 mb-3">Sensor Readings</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                              {activity.sensorData.map((sensor) => (
                                <div
                                  key={sensor.id}
                                  className="p-3 bg-gray-50 rounded-md"
                                >
                                  <div className="flex items-center space-x-2 mb-2">
                                    {getSensorIcon(sensor.type)}
                                    <span className="text-sm font-medium text-gray-900">
                                      {sensor.type.replace('_', ' ').toUpperCase()}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600">
                                    Value: {typeof sensor.value === 'boolean' 
                                      ? (sensor.value ? 'Active' : 'Inactive')
                                      : sensor.value}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {formatRelativeTime(sensor.timestamp)}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Remedial Actions */}
                        {activity.remedialActions.length > 0 && (
                          <div>
                            <h5 className="font-medium text-gray-900 mb-3">Remedial Actions</h5>
                            <div className="space-y-3">
                              {activity.remedialActions.map((action) => (
                                <div
                                  key={action.id}
                                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                                >
                                  <div className="flex items-center space-x-3">
                                    {getActionIcon(action.type)}
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">
                                        {action.type.replace('_', ' ').toUpperCase()}
                                      </p>
                                      <p className="text-xs text-gray-600">
                                        {formatRelativeTime(action.triggerTime)}
                                      </p>
                                      {action.targetContact && (
                                        <p className="text-xs text-gray-500">
                                          To: {action.targetContact.name}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      action.executed 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                      {action.executed ? 'Executed' : 'Failed'}
                                    </span>
                                    {action.result && (
                                      <p className="text-xs text-gray-500 mt-1">{action.result}</p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Notes */}
                        {activity.notes && (
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Notes</h5>
                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                              {activity.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 