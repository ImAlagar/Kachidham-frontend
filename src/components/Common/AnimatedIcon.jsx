import React from 'react';
import { motion } from 'framer-motion';
import { ICON_ANIMATIONS } from '../../constants/animationConstants';

const AnimatedIcon = React.memo(({ 
  icon: Icon, 
  animation = "pulse", 
  size = 18, 
  className = "",
  style = {},
  children 
}) => {
  const animationProps = ICON_ANIMATIONS[animation] || ICON_ANIMATIONS.pulse;
  
  // If children are provided, render them (backward compatibility)
  if (children) {
    return (
      <motion.div
        animate={animationProps}
        className="flex items-center justify-center"
        style={style}
      >
        {children}
      </motion.div>
    );
  }
  
  // Check if Icon is valid
  if (!Icon) {
    console.error('Icon prop is undefined in AnimatedIcon');
    return null;
  }
  
  return (
    <motion.div
      animate={animationProps}
      className="flex items-center justify-center"
      style={style}
    >
      <Icon size={size} className={className} />
    </motion.div>
  );
});

AnimatedIcon.displayName = 'AnimatedIcon';
export default AnimatedIcon;