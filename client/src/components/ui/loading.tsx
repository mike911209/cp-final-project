import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

function Loading() {
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
      >
        <Sparkles className="h-10 w-10 text-white" />
      </motion.div>
    </div>
  )
}

export default Loading;