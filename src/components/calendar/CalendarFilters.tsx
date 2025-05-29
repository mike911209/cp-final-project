"use client"
import React from 'react';
import { Search, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface CalendarFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onRefresh: () => void;
  isSyncing: boolean;
}

export function CalendarFilters({
  searchQuery,
  onSearchChange,
  onRefresh,
  isSyncing
}: CalendarFiltersProps) {
  return (
    <Card className="sticky top-20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={isSyncing}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100/70 rounded-lg"
              title="Refresh Calendar"
            >
              <motion.div
                animate={isSyncing ? { rotate: 360 } : { rotate: 0 }}
                transition={{
                  duration: 1,
                  repeat: isSyncing ? Infinity : 0,
                  ease: "linear"
                }}
              >
                <RefreshCw className="h-4 w-4" />
              </motion.div>
              
              {/* Sync indicator */}
              {isSyncing && (
                <motion.div
                  className="absolute -top-1 -right-1 w-2 h-2 bg-gray-900 rounded-full"
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </Button>
          </motion.div>
        </div>
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
              onChange={(e) => onSearchChange(e.target.value)}
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
  );
} 