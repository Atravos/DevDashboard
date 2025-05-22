// src/themes/theme-manager.js
import lightTheme from './light-theme';
import darkTheme from './dark-theme';
import oceanTheme from './ocean-theme';

/**
 * ThemeManager for handling dashboard themes
 */
class ThemeManager {
  /**
   * Available themes
   * @type {Object}
   */
  static themes = {
    light: lightTheme,
    dark: darkTheme,
    ocean: oceanTheme
  };
  
  /**
   * Get a theme by name
   * @param {string} name - Theme name
   * @returns {Object} - Theme object
   */
  static getTheme(name) {
    return this.themes[name] || this.themes.light;
  }
  
  /**
   * Register a custom theme
   * @param {string} name - Theme name
   * @param {Object} theme - Theme object
   */
  static registerTheme(name, theme) {
    this.themes[name] = {
      ...this.themes.light, // Use light as base
      ...theme,
      name: theme.name || name
    };
  }
  
  /**
   * Get all available themes
   * @returns {Object} - Available themes
   */
  static getAvailableThemes() {
    const themes = {};
    
    Object.keys(this.themes).forEach(key => {
      themes[key] = this.themes[key].name;
    });
    
    return themes;
  }
  
  /**
   * Apply theme to the dashboard
   * @param {string} themeName - Theme name
   * @param {HTMLElement} container - Dashboard container
   */
  static applyTheme(themeName, container) {
    const theme = this.getTheme(themeName);
    
    // Apply theme to container
    container.setAttribute('data-theme', themeName);
    
    // Apply CSS variables
    const cssVars = this._themeToCssVars(theme);
    Object.entries(cssVars).forEach(([key, value]) => {
      container.style.setProperty(key, value);
    });
    
    // Apply base styles
    if (!document.querySelector('#dev-dashboard-theme-style')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'dev-dashboard-theme-style';
      styleEl.textContent = this._getBaseStyles();
      document.head.appendChild(styleEl);
    }
  }
  
  /**
   * Convert theme to CSS variables
   * @private
   * @param {Object} theme - Theme object
   * @returns {Object} - CSS variables
   */
  static _themeToCssVars(theme) {
    const cssVars = {};
    
    // Colors
    Object.entries(theme.colors).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((color, index) => {
          cssVars[`--dd-color-${key}-${index}`] = color;
        });
      } else {
        cssVars[`--dd-color-${key}`] = value;
      }
    });
    
    // Typography
    Object.entries(theme.typography).forEach(([key, value]) => {
      cssVars[`--dd-typography-${key}`] = value;
    });
    
    // Spacing
    Object.entries(theme.spacing).forEach(([key, value]) => {
      cssVars[`--dd-spacing-${key}`] = value;
    });
    
    // Border radius
    Object.entries(theme.borderRadius).forEach(([key, value]) => {
      cssVars[`--dd-border-radius-${key}`] = value;
    });
    
    // Shadows
    Object.entries(theme.shadows).forEach(([key, value]) => {
      cssVars[`--dd-shadow-${key}`] = value;
    });
    
    return cssVars;
  }
  
  /**
   * Get base styles for the dashboard
   * @private
   * @returns {string} - CSS styles
   */
  static _getBaseStyles() {
    return `
      .dev-dashboard {
        font-family: var(--dd-typography-fontFamily);
        font-size: var(--dd-typography-fontSize);
        color: var(--dd-color-text);
        background-color: var(--dd-color-background);
        box-sizing: border-box;
      }
      
      .dev-dashboard * {
        box-sizing: border-box;
      }
      
      .dev-dashboard-viz {
        background-color: var(--dd-color-surface);
        border-radius: var(--dd-border-radius-md);
        box-shadow: var(--dd-shadow-sm);
        margin: var(--dd-spacing-md);
        overflow: hidden;
      }
      
      .viz-loading {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(0, 0, 0, 0.5);
        color: white;
        z-index: 10;
      }
      
      .viz-error {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--dd-color-surface);
        color: var(--dd-color-error);
        padding: var(--dd-spacing-md);
        text-align: center;
        z-index: 5;
      }
      
      .chart-title {
        font-size: var(--dd-typography-titleSize);
        font-weight: var(--dd-typography-fontWeightBold);
        fill: var(--dd-color-text);
      }
      
      .axis-label {
        font-size: var(--dd-typography-labelSize);
        fill: var(--dd-color-textSecondary);
      }
      
      .x-axis, .y-axis {
        color: var(--dd-color-textSecondary);
      }
      
      .x-axis path, .y-axis path,
      .x-axis line, .y-axis line {
        stroke: var(--dd-color-border);
      }
      
      .tooltip {
        font-family: var(--dd-typography-fontFamily);
        font-size: var(--dd-typography-labelSize);
        background-color: var(--dd-color-surface);
        color: var(--dd-color-text);
        border: 1px solid var(--dd-color-border);
        border-radius: var(--dd-border-radius-sm);
        box-shadow: var(--dd-shadow-md);
        padding: var(--dd-spacing-sm);
      }
    `;
  }
}

export default ThemeManager;