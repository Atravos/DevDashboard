// src/themes/ocean-theme.js

/**
 * Ocean theme configuration
 */
const oceanTheme = {
  name: 'Ocean',
  colors: {
    background: '#263238',
    surface: '#37474f',
    primary: '#80deea',
    secondary: '#c5e1a5',
    text: '#eceff1',
    textSecondary: '#b0bec5',
    border: '#546e7a',
    success: '#c5e1a5',
    warning: '#fff59d',
    error: '#ef9a9a',
    chart: [
      '#80deea', // light teal
      '#c5e1a5', // light green
      '#fff59d', // light yellow
      '#ef9a9a', // light red
      '#ce93d8', // light purple
      '#90caf9', // light blue
      '#ffcc80', // light orange
      '#bcaaa4'  // light brown
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
    sm: '0 1px 3px rgba(0,0,0,0.24), 0 1px 2px rgba(0,0,0,0.48)',
    md: '0 3px 6px rgba(0,0,0,0.32), 0 3px 6px rgba(0,0,0,0.46)',
    lg: '0 10px 20px rgba(0,0,0,0.38), 0 6px 6px rgba(0,0,0,0.46)',
    xl: '0 14px 28px rgba(0,0,0,0.50), 0 10px 10px rgba(0,0,0,0.44)'
  }
};

export default oceanTheme;