// TrendIcon.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

export const TrendIcon = ({ trend, delay = 0, color, size = 'default' }) => {
  if (!trend || trend === 'neutral') return null;
  
  const isPositive = trend === 'up';
  
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: delay + 0.5, type: "spring" }}
      className={`ml-2 inline-flex items-center ${isPositive ? color : 'text-red-500'}`}
    >
      <TrendingUp className={`${size === 'compact' ? 'w-2 h-2' : 'w-3 h-3'} ${isPositive ? '' : 'rotate-180'}`} />
    </motion.div>
  );
};

export default TrendIcon;