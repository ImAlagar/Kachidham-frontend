// ThemeProviderUtils.js
import { THEME_COLORS } from '../../constants/themeConstants';

export const useThemeColors = (theme) => {
  return THEME_COLORS[theme] || THEME_COLORS.light;
};

export const getTopbarStyles = (theme) => {
  return THEME_COLORS[theme]?.topbar || THEME_COLORS.light.topbar;
};