// src/visualizations/base.js
/**
 * Base Visualization class that all chart types will extend
 * @class
 */
class BaseVisualization {
  /**
   * Create a new visualization
   * @param {Object} config - Visualization configuration
   * @param {HTMLElement} config.element - Container element
   * @param {Object} config.data - Visualization data
   * @param {Object} [config.options={}] - Visualization options
   */
  constructor(config) {
    if (!config.element) {
      throw new Error('BaseVisualization: Element is required');
    }
    
    this.element = config.element;
    this.data = config.data || {};
    this.options = {
      width: '100%',
      height: '300px',
      margin: { top: 20, right: 20, bottom: 30, left: 40 },
      ...config.options
    };
    
    // Set up resize observer
    this.resizeObserver = new ResizeObserver(() => {
      this.resize();
    });
    this.resizeObserver.observe(this.element);
    
    // Initialize the visualization
    this._init();
  }
  
  /**
   * Initialize the visualization (to be implemented by subclasses)
   * @protected
   */
  _init() {
    // Set up base element structure
    this.element.style.position = 'relative';
    this.element.style.width = this.options.width;
    this.element.style.height = this.options.height;
    
    // Create wrapper for the visualization
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('viz-wrapper');
    this.wrapper.style.width = '100%';
    this.wrapper.style.height = '100%';
    this.wrapper.style.position = 'absolute';
    this.wrapper.style.top = '0';
    this.wrapper.style.left = '0';
    this.element.appendChild(this.wrapper);
    
    // Add a loading indicator
    this.loadingIndicator = document.createElement('div');
    this.loadingIndicator.classList.add('viz-loading');
    this.loadingIndicator.textContent = 'Loading...';
    this.loadingIndicator.style.display = 'none';
    this.element.appendChild(this.loadingIndicator);
    
    // Add an error message container
    this.errorContainer = document.createElement('div');
    this.errorContainer.classList.add('viz-error');
    this.errorContainer.style.display = 'none';
    this.element.appendChild(this.errorContainer);
  }
  
  /**
   * Show loading indicator
   */
  showLoading() {
    this.loadingIndicator.style.display = 'flex';
  }
  
  /**
   * Hide loading indicator
   */
  hideLoading() {
    this.loadingIndicator.style.display = 'none';
  }
  
  /**
   * Show error message
   * @param {string} message - Error message
   */
  showError(message) {
    this.errorContainer.textContent = message;
    this.errorContainer.style.display = 'block';
  }
  
  /**
   * Hide error message
   */
  hideError() {
    this.errorContainer.style.display = 'none';
  }
  
  /**
   * Update visualization data
   * @param {Object} data - New data
   */
  updateData(data) {
    this.data = data;
    this.render();
  }
  
  /**
   * Update visualization options
   * @param {Object} options - New options
   */
  updateOptions(options) {
    this.options = {
      ...this.options,
      ...options
    };
    this.render();
  }
  
  /**
   * Handle resize events
   */
  resize() {
    // To be implemented by subclasses
  }
  
  /**
   * Render the visualization (to be implemented by subclasses)
   */
  render() {
    throw new Error('BaseVisualization: render() method must be implemented by subclass');
  }
  
  /**
   * Destroy the visualization and clean up resources
   */
  destroy() {
    // Stop observing resizes
    this.resizeObserver.disconnect();
    
    // Clean up DOM
    while (this.element.firstChild) {
      this.element.removeChild(this.element.firstChild);
    }
  }
}

export default BaseVisualization;