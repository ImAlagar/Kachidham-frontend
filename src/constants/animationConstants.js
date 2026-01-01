    // animationConstants.js

import { BUSINESS_THEME } from './themeConstants';


export const MOTION_VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06, duration: 0.6 }
    }
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  },
  topbar: {
    hidden: { height: 0, opacity: 0 },
    visible: { height: "auto", opacity: 1 },
    exit: { height: 0, opacity: 0 }
  }
};


// Animation Constants for Smooth Transitions

export const PAGE_TRANSITIONS = {
  // Page transitions
  page: {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] // Smooth easing
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.4 }
    }
  },
  
  // Staggered container animations
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  },
  
  // Item animations
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  },
  
  // Fade in animations
  fade: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.8 }
    }
  },
  
  // Scale animations
  scale: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5,
        ease: "backOut"
      }
    }
  },
  
  // Slide animations
  slideLeft: {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6 }
    }
  },
  
  slideRight: {
    hidden: { opacity: 0, x: 50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6 }
    }
  },
  
  // Topbar animation
  topbar: {
    hidden: { height: 0, opacity: 0 },
    visible: { 
      height: "auto", 
      opacity: 1,
      transition: { 
        height: { duration: 0.4 },
        opacity: { duration: 0.3, delay: 0.1 }
      }
    },
    exit: { 
      height: 0, 
      opacity: 0,
      transition: { 
        height: { duration: 0.3 },
        opacity: { duration: 0.2 }
      }
    }
  }
};

// Icon animations
export const ICON_ANIMATIONS = {
  // Gentle pulse (for notifications)
  pulse: {
    scale: [1, 1.1, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  },
  
  // Gentle float (for decorative elements)
  float: {
    y: [0, -8, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  },
  
  // Slow rotate (for loading/spinners)
  rotateSlow: {
    rotate: [0, 360],
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: "linear"
    }
  },
  
  // Heartbeat (for favorites/likes)
  heartbeat: {
    scale: [1, 1.15, 1],
    transition: {
      duration: 1.2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  },
  
  // Glow effect (for featured items)
  glow: {
    opacity: [0.7, 1, 0.7],
    boxShadow: [
      `0 0 0px ${BUSINESS_THEME.colors.primary[300]}`,
      `0 0 20px ${BUSINESS_THEME.colors.primary[300]}`,
      `0 0 0px ${BUSINESS_THEME.colors.primary[300]}`
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  },
  
  // Shimmer effect (for text/buttons)
  shimmer: {
    x: [0, 5, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  },
  
  // Bounce (for CTAs)
  bounce: {
    y: [0, -10, 0],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Hover animations
export const HOVER_ANIMATIONS = {
  // Button hover
  button: {
    scale: 1.05,
    transition: { duration: 0.2 }
  },
  
  // Card hover
  card: {
    y: -5,
    scale: 1.02,
    transition: { duration: 0.3 }
  },
  
  // Image hover
  image: {
    scale: 1.05,
    transition: { duration: 0.4 }
  },
  
  // Link hover
  link: {
    x: 5,
    transition: { duration: 0.2 }
  },
  
  // Icon hover
  icon: {
    scale: 1.2,
    rotate: 5,
    transition: { duration: 0.3 }
  }
};

// Loading animations
export const LOADING_ANIMATIONS = {
  // Skeleton loading
  skeleton: {
    background: [
      `linear-gradient(90deg, ${BUSINESS_THEME.colors.primary[100]} 25%, ${BUSINESS_THEME.colors.primary[200]} 50%, ${BUSINESS_THEME.colors.primary[100]} 75%)`,
      `linear-gradient(90deg, ${BUSINESS_THEME.colors.primary[100]} 25%, ${BUSINESS_THEME.colors.primary[200]} 50%, ${BUSINESS_THEME.colors.primary[100]} 75%)`
    ],
    backgroundSize: "200% 100%",
    transition: {
      backgroundPosition: {
        repeat: Infinity,
        duration: 1.5,
        ease: "linear"
      }
    }
  },
  
  // Pulse loading
  pulse: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};