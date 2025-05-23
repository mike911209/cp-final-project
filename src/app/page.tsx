'use client';
import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { user, isAuthenticated, isSyncing, login } = useUser();

  useEffect(() => {
    if (user) {
      router.push('/calendar');
    }else{
      router.push('/auth');
    }
  }, [user]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <motion.div
        className="flex items-center justify-center w-20 h-20 bg-gradient-to-r from-gray-900 to-black rounded-lg shadow-lg"
        initial={{ scale: 0, rotate: 0 }}
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 360],
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        whileHover={{ 
          scale: 1.5,
          rotate: 180,
          transition: { duration: 0.3 }
        }}
      >
        <Sparkles className="h-10 w-10 text-white" />
      </motion.div>
    </div>
  );
}
