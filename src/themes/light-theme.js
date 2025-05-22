// src/themes/light-theme.js

/**
 * Default light theme configuration
 */
const lightTheme = {
  name: 'Light',
  colors: {
    background: '#ffffff',
    surface: '#f5f5f5',
    primary: '#2196f3',
    secondary: '#ff9800',
    text: '#212121',
    textSecondary: '#757575',
    border: '#e0e0e0',
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
    chart: [
      '#2196f3', // blue
      '#4caf50', // green
      '#ff9800', // orange
      '#f44336', // red
      '#9c27b0', // purple
      '#00bcd4', // cyan
      '#ffeb3b', // yellow
      '#795548'  // brown
    ]
  },
  typography: {
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
    fontSize: '14px',
    fontWeightRegular: '400',
    fontWeightBold: '700',
    titleSize: '16px',
    subtitleSize: '14px',
    labelSize: '12px'
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px'
  },
  borderRadius: {
    sm: '2px',
    md: '4px',
    lg: '8px',
    xl: '16px'
  },
  shadows: {
    none: 'none',
    sm: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    md: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    lg: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
    xl: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)'
  }
};

export default lightTheme;