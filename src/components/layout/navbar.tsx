"use client"
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Calendar, 
  Activity, 
  RefreshCw, 
  User, 
  LogOut, 
  ChevronDown, 
  Sparkles,
  Wifi,
  WifiOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ViewMode } from '@/types';
import { useUser } from '@/contexts/UserContext';



export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewMode>('');
  const { user, isAuthenticated, isSyncing, logout } = useUser();

  useEffect(() => {
    const newView = pathname?.startsWith('/') ? pathname.substring(1).split('/')[0] : pathname?.split('/')[0] || '';
    setCurrentView(newView as ViewMode);
  }, [pathname]);

  const onViewChange = (id: string)=>{
    router.push(`/${id}`);
  }

  const onRefresh = ()=>{
    console.log('refresh');
  }

  const navItems = [
    {
      id: 'calendar' as ViewMode,
      label: 'Calendar',
      icon: Calendar,
      description: 'Manage events and alarms'
    },
    {
      id: 'activity' as ViewMode,
      label: 'Activity',
      icon: Activity,
      description: 'View alarm history'
    },
  ];

  if (!isAuthenticated) return null;

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.15,
        ease: "easeIn"
      }
    }
  };

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 glass-morphism border-b border-gray-200/30 shadow-lg"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-gray-900 to-black rounded-lg shadow-md"
              whileHover={{ rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Sparkles className="h-5 w-5 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-black bg-clip-text text-transparent">
                Immersive Alarm
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">Smart Wake-up System</p>
            </div>
          </motion.div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant={currentView === item.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onViewChange(item.id)}
                  className={`
                    relative flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
                    ${currentView === item.id 
                      ? 'bg-gray-900 text-white shadow-md' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/70'
                    }
                  `}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                  
                  {/* Active indicator */}
                  {currentView === item.id && (
                    <motion.div
                      className="absolute bottom-0 left-1/2 w-1 h-1 bg-white rounded-full"
                      layoutId="activeIndicator"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30
                      }}
                      style={{ transform: 'translateX(-50%)' }}
                    />
                  )}
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Sync Button */}
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
                title="Sync Calendar Data"
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

            {/* Connection Status */}
            <motion.div
              className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-white/50 border border-gray-200/30"
              whileHover={{ scale: 1.05 }}
              title={user?.isGoogleConnected ? 'Google Calendar Connected' : 'Google Calendar Disconnected'}
            >
              {user?.isGoogleConnected ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center space-x-1"
                >
                  <Wifi className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-700 font-medium hidden sm:inline">Connected</span>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center space-x-1"
                >
                  <WifiOff className="h-3 w-3 text-red-600" />
                  <span className="text-xs text-red-700 font-medium hidden sm:inline">Offline</span>
                </motion.div>
              )}
            </motion.div>

            {/* User Menu */}
            <div className="relative">
              <motion.button
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100/70 transition-all duration-200"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-7 h-7 bg-gradient-to-r from-gray-900 to-black rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium hidden md:inline truncate max-w-32">
                  {user?.email}
                </span>
                <motion.div
                  animate={{ rotate: isUserMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-4 w-4" />
                </motion.div>
              </motion.button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isUserMenuOpen && (
                  <>
                    {/* Backdrop */}
                    <motion.div
                      className="fixed inset-0 z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    
                    {/* Dropdown */}
                    <motion.div
                      className="absolute right-0 mt-2 w-64 glass-morphism border border-gray-200/50 rounded-lg shadow-xl z-20 overflow-hidden"
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      {/* User Info Section */}
                      <div className="p-4 border-b border-gray-200/30">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-gray-900 to-black rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {user?.email}
                            </p>
                            <div className="flex items-center space-x-1 mt-1">
                              {user?.isGoogleConnected ? (
                                <>
                                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                                  <span className="text-xs text-gray-600">Google Connected</span>
                                </>
                              ) : (
                                <>
                                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                                  <span className="text-xs text-gray-600">Google Disconnected</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="p-2">
                        <motion.button
                          className="w-full flex items-center space-x-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100/70 rounded-lg transition-colors"
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          whileHover={{ scale: 1.02, x: 5 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Sign Out</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
} 