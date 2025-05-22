// src/core/config.js

/**
 * Configuration management for DevDashboard
 * @class
 */
class Config {
  /**
   * Create a new configuration instance
   * @param {Object} initialConfig - Initial configuration
   */
  constructor(initialConfig = {}) {
    this.config = {
      // Default configuration
      container: null,
      theme: 'light',
      responsive: true,
      animationDuration: 500,
      debounceResize: 300,
      locale: 'en-US',
      dateFormat: {
        daily: { month: 'short', day: 'numeric' },
        weekly: { week: 'numeric', year: 'numeric' },
        monthly: { month: 'short', year: 'numeric' },
      },
      tooltips: {
        enabled: true,
        followCursor: true,
        delay: 200
      },
      // Override with provided configuration
      ...initialConfig
    };
    
    // Event listeners
    this.listeners = {};
  }
  
  /**
   * Get a configuration value
   * @param {string} key - Configuration key
   * @param {*} defaultValue - Default value if key doesn't exist
   * @returns {*} - Configuration value
   */
  get(key, defaultValue) {
    return this._getNestedProperty(this.config, key, defaultValue);
  }
  
  /**
   * Set a configuration value
   * @param {string} key - Configuration key
   * @param {*} value - Configuration value
   * @returns {Config} - Config instance for chaining
   */
  set(key, value) {
    const oldValue = this.get(key);
    this._setNestedProperty(this.config, key, value);
    
    // Trigger change event if value changed
    if (JSON.stringify(oldValue) !== JSON.stringify(value)) {
      this._triggerEvent('change', { key, oldValue, newValue: value });
    }
    
    return this;
  }
  
  /**
   * Set multiple configuration values
   * @param {Object} values - Configuration values
   * @returns {Config} - Config instance for chaining
   */
  setMultiple(values) {
    Object.entries(values).forEach(([key, value]) => {
      this.set(key, value);
    });
    
    return this;
  }
  
  /**
   * Check if a configuration key exists
   * @param {string} key - Configuration key
   * @returns {boolean} - True if key exists
   */
  has(key) {
    return this._getNestedProperty(this.config, key, undefined) !== undefined;
  }
  
  /**
   * Reset configuration to defaults
   * @param {Object} [defaults={}] - Default configuration
   * @returns {Config} - Config instance for chaining
   */
  reset(defaults = {}) {
    this.config = {
      container: null,
      theme: 'light',
      responsive: true,
      animationDuration: 500,
      debounceResize: 300,
      locale: 'en-US',
      dateFormat: {
        daily: { month: 'short', day: 'numeric' },
        weekly: { week: 'numeric', year: 'numeric' },
        monthly: { month: 'short', year: 'numeric' },
      },
      tooltips: {
        enabled: true,
        followCursor: true,
        delay: 200
      },
      ...defaults
    };
    
    this._triggerEvent('reset', { config: this.config });
    
    return this;
  }
  
  /**
   * Get a nested property from an object
   * @private
   * @param {Object} obj - Object to get property from
   * @param {string} path - Property path (e.g. 'a.b.c')
   * @param {*} defaultValue - Default value if property doesn't exist
   * @returns {*} - Property value or default value
   */
  _getNestedProperty(obj, path, defaultValue) {
    if (!path) {
      return obj;
    }
    
    const keys = path.split('.');
    let result = obj;
    
    for (const key of keys) {
      if (result === undefined || result === null || !Object.prototype.hasOwnProperty.call(result, key)) {
        return defaultValue;
      }
      
      result = result[key];
    }
    
    return result;
  }
  
  /**
   * Set a nested property on an object
   * @private
   * @param {Object} obj - Object to set property on
   * @param {string} path - Property path (e.g. 'a.b.c')
   * @param {*} value - Property value
   */
  _setNestedProperty(obj, path, value) {
    if (!path) {
      return;
    }
    
    const keys = path.split('.');
    const lastKey = keys.pop();
    let current = obj;
    
    for (const key of keys) {
      if (!Object.prototype.hasOwnProperty.call(current, key) || current[key] === null) {
        current[key] = {};
      }
      
      current = current[key];
    }
    
    current[lastKey] = value;
  }
  
  /**
   * Register an event listener
   * @param {string} event - Event name
   * @param {Function} callback - Event callback
   * @returns {Config} - Config instance for chaining
   */
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    
    this.listeners[event].push(callback);
    
    return this;
  }
  
  /**
   * Remove an event listener
   * @param {string} event - Event name
   * @param {Function} callback - Event callback
   * @returns {Config} - Config instance for chaining
   */
  off(event, callback) {
    if (!this.listeners[event]) {
      return this;
    }
    
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    
    return this;
  }
  
  /**
   * Trigger an event
   * @private
   * @param {string} event - Event name
   * @param {Object} data - Event data
   */
  _triggerEvent(event, data) {
    if (!this.listeners[event]) {
      return;
    }
    
    this.listeners[event].forEach(callback => {
      callback(data);
    });
  }
  
  /**
   * Export configuration as an object
   * @returns {Object} - Configuration object
   */
  toObject() {
    return JSON.parse(JSON.stringify(this.config));
  }
  
  /**
   * Import configuration from an object
   * @param {Object} config - Configuration object
   * @returns {Config} - Config instance for chaining
   */
  fromObject(config) {
    this.config = JSON.parse(JSON.stringify(config));
    this._triggerEvent('import', { config: this.config });
    
    return this;
  }
}

export default Config;