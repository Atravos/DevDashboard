// src/core/dashboard.js
/**
 * DevDashboard - Main dashboard class
 * @class
 */
class DevDashboard {
  /**
   * Create a new dashboard instance
   * @param {Object} config - Configuration options
   * @param {string|HTMLElement} config.container - Container selector or element
   * @param {string} [config.theme='light'] - Dashboard theme
   */
  constructor(config = {}) {
    this.config = {
      container: null,
      theme: 'light',
      ...config
    };
    
    this.visualizations = new Map();
    this.eventListeners = {};
    
    this._initContainer();
    this._initTheme();
  }
  
  /**
   * Initialize the container element
   * @private
   */
  _initContainer() {
    if (!this.config.container) {
      throw new Error('DevDashboard: Container is required');
    }
    
    if (typeof this.config.container === 'string') {
      this.container = document.querySelector(this.config.container);
      if (!this.container) {
        throw new Error(`DevDashboard: Container "${this.config.container}" not found`);
      }
    } else if (this.config.container instanceof HTMLElement) {
      this.container = this.config.container;
    } else {
      throw new Error('DevDashboard: Container must be a selector string or HTMLElement');
    }
    
    // Add dashboard class for styling
    this.container.classList.add('dev-dashboard');
  }
  
  /**
   * Initialize the theme
   * @private
   */
  _initTheme() {
    // Will be expanded with a proper theme manager
    this.container.setAttribute('data-theme', this.config.theme);
  }
  
  /**
   * Add a visualization to the dashboard
   * @param {Object} config - Visualization configuration
   * @param {string} config.id - Unique visualization ID
   * @param {string} config.type - Visualization type
   * @param {Object} config.data - Visualization data
   * @param {Object} [config.options={}] - Visualization options
   * @returns {DevDashboard} - The dashboard instance for chaining
   */
  addVisualization(config) {
    if (!config.id || !config.type) {
      throw new Error('DevDashboard: Visualization ID and type are required');
    }
    
    if (this.visualizations.has(config.id)) {
      throw new Error(`DevDashboard: Visualization with ID "${config.id}" already exists`);
    }
    
    // Create visualization element
    const vizElement = document.createElement('div');
    vizElement.classList.add('dev-dashboard-viz');
    vizElement.setAttribute('data-viz-id', config.id);
    vizElement.setAttribute('data-viz-type', config.type);
    this.container.appendChild(vizElement);
    
    // Create visualization instance (will be expanded)
    const visualization = this._createVisualization(config.type, {
      element: vizElement,
      data: config.data,
      options: config.options || {}
    });
    
    this.visualizations.set(config.id, {
      config,
      element: vizElement,
      instance: visualization
    });
    
    // Trigger visualization added event
    this._triggerEvent('visualizationAdded', {
      id: config.id,
      type: config.type
    });
    
    return this;
  }
  
  /**
   * Create a visualization instance based on type
   * @private
   * @param {string} type - Visualization type
   * @param {Object} config - Visualization config
   * @returns {Object} - Visualization instance
   */
  _createVisualization(type, config) {
    // Will be expanded with a proper factory pattern
    // For now, return a placeholder
    return {
      render: () => {
        config.element.textContent = `${type} visualization (placeholder)`;
      }
    };
  }
  
  /**
   * Update data for a specific visualization
   * @param {string} id - Visualization ID
   * @param {Object} data - New data
   * @returns {DevDashboard} - The dashboard instance for chaining
   */
  updateData(id, data) {
    if (!this.visualizations.has(id)) {
      throw new Error(`DevDashboard: Visualization with ID "${id}" not found`);
    }
    
    const viz = this.visualizations.get(id);
    viz.config.data = data;
    
    // Update visualization (will be expanded)
    // viz.instance.updateData(data);
    
    // Trigger data updated event
    this._triggerEvent('dataUpdated', {
      id,
      data
    });
    
    return this;
  }
  
  /**
   * Register an event listener
   * @param {string} event - Event name
   * @param {Function} callback - Event callback
   * @returns {DevDashboard} - The dashboard instance for chaining
   */
  on(event, callback) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    
    this.eventListeners[event].push(callback);
    
    return this;
  }
  
  /**
   * Trigger an event
   * @private
   * @param {string} event - Event name
   * @param {Object} data - Event data
   */
  _triggerEvent(event, data) {
    if (!this.eventListeners[event]) {
      return;
    }
    
    this.eventListeners[event].forEach(callback => {
      callback(data);
    });
  }
  
  /**
   * Remove a visualization
   * @param {string} id - Visualization ID
   * @returns {DevDashboard} - The dashboard instance for chaining
   */
  removeVisualization(id) {
    if (!this.visualizations.has(id)) {
      throw new Error(`DevDashboard: Visualization with ID "${id}" not found`);
    }
    
    const viz = this.visualizations.get(id);
    viz.element.remove();
    this.visualizations.delete(id);
    
    // Trigger visualization removed event
    this._triggerEvent('visualizationRemoved', {
      id
    });
    
    return this;
  }
  
  /**
   * Set dashboard theme
   * @param {string} theme - Theme name
   * @returns {DevDashboard} - The dashboard instance for chaining
   */
  setTheme(theme) {
    this.config.theme = theme;
    this.container.setAttribute('data-theme', theme);
    
    // Trigger theme changed event
    this._triggerEvent('themeChanged', {
      theme
    });
    
    return this;
  }
  
  /**
   * Destroy the dashboard instance
   */
  destroy() {
    // Clean up event listeners
    this.eventListeners = {};
    
    // Remove all visualizations
    this.visualizations.forEach((viz, id) => {
      this.removeVisualization(id);
    });
    
    // Remove dashboard class
    this.container.classList.remove('dev-dashboard');
    this.container.removeAttribute('data-theme');
  }
}

export default DevDashboard;