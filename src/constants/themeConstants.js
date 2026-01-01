// themeConstants.js
export const THEME_COLORS = {
  dark: {
    bgColor: "bg-gray-900",
    headingColor: "text-white",
    textColor: "text-gray-300",
    borderColor: "border-amber-800",
    accentColor: "text-amber-400",
    iconBgColor: "bg-amber-400/20",
    goldGradient: "bg-gradient-to-r from-amber-500 to-yellow-500",
    topbar: {
      background: "bg-gradient-to-r from-gray-900 via-amber-500/20 to-gray-900",
      textColor: "text-amber-400",
      border: "border-b border-amber-500/30"
    }
  },
  light: {
    bgColor: "bg-amber-50",
    headingColor: "text-gray-900",
    textColor: "text-gray-700",
    borderColor: "border-amber-200",
    accentColor: "text-amber-600",
    iconBgColor: "bg-amber-500/20",
    goldGradient: "bg-gradient-to-r from-amber-500 to-yellow-500",
    topbar: {
      background: "bg-gradient-to-r from-amber-500 to-yellow-400",
      textColor: "text-gray-900",
      border: "border-b border-amber-500"
    }
  }
};

// Reusable color classes
export const SOCIAL_MEDIA_COLORS = {
  instagram: "hover:bg-gradient-to-r from-purple-600 to-pink-600",
  facebook: "hover:bg-blue-600",
  youtube: "hover:bg-red-600",
  twitter: "hover:bg-blue-400"
};



// Theme Constants for Girls' Nightwear Business
export const BUSINESS_THEME = {
  name: "Dreamy Nights",
  tagline: "Cozy Sleepwear for Sweet Dreams",
  colors: {
    // Primary palette - Soft pinks and purples for girls' nightwear
    primary: {
      50: "#fdf2f8",   // Lightest pink
      100: "#fce7f3",  // Very light pink
      200: "#fbcfe8",  // Light pink
      300: "#f9a8d4",  // Soft pink
      400: "#f472b6",  // Medium pink
      500: "#ec4899",  // Primary pink
      600: "#db2777",  // Dark pink
      700: "#be185d",  // Deep pink
      800: "#9d174d",  // Darker pink
      900: "#831843",  // Deepest pink
    },
    
    // Secondary palette - Soft purples and lavenders
    secondary: {
      50: "#faf5ff",   // Lightest lavender
      100: "#f3e8ff",  // Very light lavender
      200: "#e9d5ff",  // Light lavender
      300: "#d8b4fe",  // Soft purple
      400: "#c084fc",  // Medium purple
      500: "#a855f7",  // Primary purple
      600: "#9333ea",  // Dark purple
      700: "#7e22ce",  // Deep purple
      800: "#6b21a8",  // Darker purple
      900: "#581c87",  // Deepest purple
    },
    
    // Accent colors - Soft blues and teals
    accent: {
      50: "#f0f9ff",   // Lightest sky blue
      100: "#e0f2fe",  // Very light blue
      200: "#bae6fd",  // Light blue
      300: "#7dd3fc",  // Soft blue
      400: "#38bdf8",  // Medium blue
      500: "#0ea5e9",  // Primary blue
      600: "#0284c7",  // Dark blue
      700: "#0369a1",  // Deep blue
      800: "#075985",  // Navy blue
      900: "#0c4a6e",  // Deep navy
    },
    
    // Neutral colors
    neutral: {
      50: "#fafafa",   // Off-white
      100: "#f5f5f5",  // Light gray
      200: "#e5e5e5",  // Light gray
      300: "#d4d4d4",  // Medium gray
      400: "#a3a3a3",  // Gray
      500: "#737373",  // Dark gray
      600: "#525252",  // Darker gray
      700: "#404040",  // Dark
      800: "#262626",  // Darker
      900: "#171717",  // Darkest
    }
  },
  
  // Font families
  fonts: {
    heading: "'Poppins', sans-serif",
    body: "'Inter', sans-serif",
    accent: "'Playfair Display', serif",
  },
  
  // Border radius
  borderRadius: {
    sm: "0.5rem",
    md: "0.75rem",
    lg: "1rem",
    xl: "1.5rem",
    full: "9999px",
  },
  
  // Shadows
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    xl: "0 20px 25px -5px rgba(236, 72, 153, 0.1)",
    "2xl": "0 25px 50px -12px rgba(236, 72, 153, 0.25)",
  }
};

// Theme configurations for light/dark mode
export const THEME_CONFIG = {
  light: {
    bg: {
      primary: BUSINESS_THEME.colors.primary[50],
      secondary: "#ffffff",
      accent: BUSINESS_THEME.colors.accent[50],
    },
    text: {
      primary: BUSINESS_THEME.colors.neutral[900],
      secondary: BUSINESS_THEME.colors.neutral[700],
      accent: BUSINESS_THEME.colors.primary[600],
      inverted: "#ffffff",
    },
    border: BUSINESS_THEME.colors.primary[200],
    icon: BUSINESS_THEME.colors.primary[500],
    button: {
      primary: `bg-gradient-to-r from-${BUSINESS_THEME.colors.primary[500]} to-${BUSINESS_THEME.colors.secondary[500]} text-white`,
      secondary: `bg-${BUSINESS_THEME.colors.primary[100]} text-${BUSINESS_THEME.colors.primary[700]}`,
    }
  },
  dark: {
    bg: {
      primary: BUSINESS_THEME.colors.neutral[900],
      secondary: BUSINESS_THEME.colors.neutral[800],
      accent: BUSINESS_THEME.colors.neutral[800],
    },
    text: {
      primary: BUSINESS_THEME.colors.neutral[100],
      secondary: BUSINESS_THEME.colors.neutral[300],
      accent: BUSINESS_THEME.colors.primary[300],
      inverted: BUSINESS_THEME.colors.neutral[900],
    },
    border: BUSINESS_THEME.colors.primary[800],
    icon: BUSINESS_THEME.colors.primary[400],
    button: {
      primary: `bg-gradient-to-r from-${BUSINESS_THEME.colors.primary[600]} to-${BUSINESS_THEME.colors.secondary[600]} text-white`,
      secondary: `bg-${BUSINESS_THEME.colors.primary[900]} text-${BUSINESS_THEME.colors.primary[200]}`,
    }
  }
};

// CSS Classes for easy usage
export const THEME_CLASSES = {
  // Backgrounds
  bgPrimary: "bg-gradient-to-br from-pink-50 to-purple-50",
  bgSecondary: "bg-white dark:bg-gray-900",
  bgAccent: "bg-gradient-to-r from-pink-500 to-purple-500",
  
  // Text
  textPrimary: "text-gray-900 dark:text-white",
  textSecondary: "text-gray-700 dark:text-gray-300",
  textAccent: "text-pink-600 dark:text-pink-400",
  
  // Borders
  border: "border-pink-200 dark:border-pink-800",
  borderAccent: "border-pink-500 dark:border-pink-400",
  
  // Buttons
  btnPrimary: "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white",
  btnSecondary: "bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-200 hover:bg-pink-200 dark:hover:bg-pink-800",
  
  // Cards
  card: "bg-white dark:bg-gray-800 border border-pink-100 dark:border-pink-900",
  cardHover: "hover:shadow-xl hover:border-pink-300 dark:hover:border-pink-700 transition-all",
};