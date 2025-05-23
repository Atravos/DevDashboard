// src/themes/theme-manager.js
import unifiedThemes from './unified-themes';

/**
 * ThemeManager for handling dashboard themes
 */
class ThemeManager {
  /**
   * Available themes - now using unified themes
   * @type {Object}
   */
  static themes = unifiedThemes;
  
  /**
   * Get a theme by name
   * @param {string} name - Theme name
   * @returns {Object} - Theme object
   */
  static getTheme(name) {
    return this.themes[name] || this.themes.professional;
  }
  
  /**
   * Register a custom theme
   * @param {string} name - Theme name
   * @param {Object} theme - Theme object
   */
  static registerTheme(name, theme) {
    this.themes[name] = {
      ...this.themes.professional, // Use professional as base
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
    
    // Apply special effects based on theme style
    this._applyThemeEffects(theme, container);
    
    // Apply base styles
    if (!document.querySelector('#dev-dashboard-theme-style')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'dev-dashboard-theme-style';
      styleEl.textContent = this._getBaseStyles();
      document.head.appendChild(styleEl);
    }
  }
  
  /**
   * Apply special theme effects
   * @private
   */
  static _applyThemeEffects(theme, container) {
    // Remove all effect classes first
    container.classList.remove('theme-glassmorphism', 'theme-glow', 'theme-scanlines');
    
    // Apply new effects
    if (theme.effects) {
      if (theme.effects.glassmorphism) {
        container.classList.add('theme-glassmorphism');
      }
      if (theme.effects.glow) {
        container.classList.add('theme-glow');
      }
      if (theme.effects.scanlines) {
        container.classList.add('theme-scanlines');
      }
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
    
    // Effects
    if (theme.effects) {
      Object.entries(theme.effects).forEach(([key, value]) => {
        if (typeof value === 'string') {
          cssVars[`--dd-effect-${key}`] = value;
        }
      });
    }
    
    // Keep existing typography, spacing, etc.
    cssVars['--dd-font-family'] = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    cssVars['--dd-font-size'] = '14px';
    
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
        font-family: var(--dd-font-family);
        font-size: var(--dd-font-size);
        color: var(--dd-color-text);
        background: var(--dd-color-background);
        box-sizing: border-box;
        transition: var(--dd-effect-transition, all 0.3s ease);
      }
      
      .dev-dashboard * {
        box-sizing: border-box;
      }
      
      .dev-dashboard-viz {
        background-color: var(--dd-color-surface);
        border-radius: var(--dd-effect-borderRadius, 8px);
        box-shadow: var(--dd-effect-shadow);
        margin: 16px;
        overflow: hidden;
        border: 1px solid var(--dd-color-border);
      }
      
      /* Special theme effects */
      .theme-glassmorphism .dev-dashboard-viz {
        backdrop-filter: var(--dd-effect-backdrop, blur(10px));
        -webkit-backdrop-filter: var(--dd-effect-backdrop, blur(10px));
      }
      
      .theme-glow .dev-dashboard-viz {
        box-shadow: var(--dd-effect-shadow), 0 0 20px var(--dd-color-primary);
      }
      
      .theme-scanlines::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(0, 255, 136, 0.03) 2px,
          rgba(0, 255, 136, 0.03) 4px
        );
        pointer-events: none;
        z-index: 1;
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
        color: var(--dd-color-danger);
        padding: 16px;
        text-align: center;
        z-index: 5;
      }
      
      .chart-title {
        font-size: 16px;
        font-weight: 700;
        fill: var(--dd-color-text);
      }
      
      .axis-label {
        font-size: 12px;
        fill: var(--dd-color-textMuted);
      }
      
      .x-axis, .y-axis {
        color: var(--dd-color-textMuted);
      }
      
      .x-axis path, .y-axis path,
      .x-axis line, .y-axis line {
        stroke: var(--dd-color-border);
      }
      
      .tooltip {
        font-family: var(--dd-font-family);
        font-size: 12px;
        background-color: var(--dd-color-surface);
        color: var(--dd-color-text);
        border: 1px solid var(--dd-color-border);
        border-radius: var(--dd-effect-borderRadius, 4px);
        box-shadow: var(--dd-effect-shadow);
        padding: 8px;
      }
      
      /* Dashboard header styles */
      .devdashboard-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        background: var(--dd-color-surface);
        border: 1px solid var(--dd-color-border);
        border-radius: var(--dd-effect-borderRadius, 8px);
        margin-bottom: 1rem;
      }
      
      .dd-header-title h2 {
        margin: 0;
        color: var(--dd-color-primary);
      }
      
      .dd-header-subtitle {
        color: var(--dd-color-textMuted);
        font-size: 0.9rem;
      }
      
      .dd-header-controls {
        display: flex;
        gap: 1rem;
        align-items: center;
      }
      
      .dd-btn {
        padding: 0.5rem 1rem;
        background: var(--dd-color-primary);
        color: var(--dd-color-background);
        border: none;
        border-radius: var(--dd-effect-borderRadius, 4px);
        cursor: pointer;
        font-weight: 500;
        transition: var(--dd-effect-transition);
      }
      
      .dd-btn:hover {
        opacity: 0.8;
        transform: translateY(-2px);
      }
      
      .dd-theme-selector {
        padding: 0.5rem;
        background: var(--dd-color-surface);
        color: var(--dd-color-text);
        border: 1px solid var(--dd-color-border);
        border-radius: var(--dd-effect-borderRadius, 4px);
      }
    `;
  }
}

export default ThemeManager;