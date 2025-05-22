// src/themes/dark-theme.js

/**
 * Dark theme configuration
 */
const darkTheme = {
  name: 'Dark',
  colors: {
    background: '#121212',
    surface: '#1e1e1e',
    primary: '#90caf9',
    secondary: '#ffb74d',
    text: '#ffffff',
    textSecondary: '#b0b0b0',
    border: '#424242',
    success: '#81c784',
    warning: '#ffb74d',
    error: '#e57373',
    chart: [
      '#90caf9', // light blue
      '#81c784', // light green
      '#ffb74d', // light orange
      '#e57373', // light red
      '#ce93d8', // light purple
      '#80deea', // light cyan
      '#fff59d', // light yellow
      '#a1887f'  // light brown
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

export default darkTheme;