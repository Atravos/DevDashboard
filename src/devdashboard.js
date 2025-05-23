// src/devdashboard.js

import DevDashboard from './core/dashboard';
import DataProcessor from './processors/data-processor';
import themes from './themes/unified-themes';
import { RealtimeSimulator } from './utils/realtime-simulator';
import { exportToCSV, exportToPNG } from './utils/export';

/**
 * DevDashboard - Developer Productivity Metrics at a Glance
 * 
 * @example
 * // Quick start with demo data
 * DevDashboard.create('#app', { demo: true });
 * 
 * @example
 * // With your own data
 * DevDashboard.create('#app', {
 *   theme: 'darkMode',
 *   data: {
 *     commits: myCommitData,
 *     quality: myQualityData,
 *     velocity: myVelocityData
 *   }
 * });
 */
class DevDashboardFactory {
  /**
   * Create a complete dashboard with a single call
   */
  static create(container, options = {}) {
    const {
      theme = 'professional',
      demo = false,
      realtime = false,
      data = null,
      features = ['commits', 'quality', 'velocity'],
      layout = 'auto',
      exportEnabled = true,
      responsive = true
    } = options;
    
    // Create dashboard instance
    const dashboard = new DevDashboard({
      container,
      theme,
      responsive
    });
    
    // Add header with controls
    if (exportEnabled || realtime) {
      this._addDashboardHeader(dashboard, { exportEnabled, realtime, theme });
    }
    
    // Set up layout
    const layoutConfig = this._getLayoutConfig(layout, features);
    
    // Initialize data source
    let dataSource;
    if (demo || realtime) {
      dataSource = new RealtimeSimulator();
      if (realtime) {
        dataSource.start();
        dashboard.simulator = dataSource; // Store reference for cleanup
      }
    }
    
    // Add visualizations
    features.forEach((feature, index) => {
      const config = this._getVisualizationConfig(feature, layoutConfig[index]);
      const vizData = data ? data[feature] : (dataSource ? dataSource.getData(feature) : []);
      
      dashboard.addVisualization({
        id: feature,
        type: config.type,
        data: vizData,
        options: config.options
      });
      
      // Set up real-time updates if enabled
      if (realtime && dataSource) {
        dataSource.subscribe(feature, (newData) => {
          const processed = this._processDataForFeature(feature, newData);
          dashboard.updateData(feature, processed);
        });
      }
    });
    
    // Add keyboard shortcuts
    this._addKeyboardShortcuts(dashboard);
    
    // Return dashboard instance for further customization
    return dashboard;
  }
  
  /**
   * Create a single metric widget
   */
  static createWidget(container, type, options = {}) {
    const {
      theme = 'professional',
      data = null,
      demo = false,
      ...vizOptions
    } = options;
    
    const dashboard = new DevDashboard({
      container,
      theme,
      responsive: true
    });
    
    const vizData = demo ? this._getDemoData(type) : data;
    
    dashboard.addVisualization({
      id: type,
      type: this._getVisualizationType(type),
      data: vizData,
      options: vizOptions
    });
    
    return dashboard;
  }
  
  /**
   * Process data for a specific feature
   */
  static _processDataForFeature(feature, rawData) {
    switch (feature) {
      case 'commits':
        return DataProcessor.processCommitData(rawData);
      case 'quality':
        return DataProcessor.processCodeQualityData(rawData);
      case 'velocity':
        return DataProcessor.processStoryPointsData(rawData);
      default:
        return rawData;
    }
  }
  
  /**
   * Get visualization configuration
   */
  static _getVisualizationConfig(feature, layout) {
    const configs = {
      commits: {
        type: 'commitFrequency',
        options: {
          title: 'Commit Activity',
          xAxisLabel: 'Date',
          yAxisLabel: 'Commits',
          timeRange: 'daily',
          ...layout
        }
      },
      quality: {
        type: 'codeQuality',
        options: {
          title: 'Code Quality Trends',
          metrics: ['bugs', 'vulnerabilities', 'codeSmells', 'coverage'],
          xAxisLabel: 'Date',
          yAxisLabel: 'Count',
          ...layout
        }
      },
      velocity: {
        type: 'velocity',
        options: {
          title: 'Sprint Velocity',
          xAxisLabel: 'Sprint',
          yAxisLabel: 'Story Points',
          showVelocity: true,
          velocityWindow: 3,
          ...layout
        }
      }
    };
    
    return configs[feature] || { type: feature, options: layout };
  }
  
  /**
   * Get layout configuration based on feature count
   */
  static _getLayoutConfig(layout, features) {
    if (layout === 'auto') {
      const count = features.length;
      if (count === 1) {
        return [{ width: '100%', height: '500px' }];
      } else if (count === 2) {
        return [
          { width: '50%', height: '500px' },
          { width: '50%', height: '500px' }
        ];
      } else {
        return [
          { width: '100%', height: '400px' },
          { width: '50%', height: '400px' },
          { width: '50%', height: '400px' }
        ];
      }
    }
    
    return layout;
  }
  
  /**
   * Add dashboard header with controls
   */
  static _addDashboardHeader(dashboard, options) {
    const header = document.createElement('div');
    header.className = 'devdashboard-header';
    header.innerHTML = `
      <div class="dd-header-title">
        <h2>Developer Metrics</h2>
        <span class="dd-header-subtitle">Real-time productivity insights</span>
      </div>
      <div class="dd-header-controls">
        ${options.realtime ? '<button class="dd-btn dd-btn-pause" data-action="toggle-realtime">⏸️ Pause</button>' : ''}
        ${options.exportEnabled ? `
          <button class="dd-btn" data-action="export-png">📸 Export PNG</button>
          <button class="dd-btn" data-action="export-csv">📊 Export CSV</button>
        ` : ''}
        <select class="dd-theme-selector" data-action="change-theme">
          ${Object.entries(themes).map(([key, theme]) => 
            `<option value="${key}" ${key === options.theme ? 'selected' : ''}>${theme.name}</option>`
          ).join('')}
        </select>
      </div>
    `;
    
    dashboard.container.parentElement.insertBefore(header, dashboard.container);
    
    // Add event listeners
    header.addEventListener('click', (e) => {
      const action = e.target.dataset.action;
      if (action === 'toggle-realtime') {
        const isPaused = e.target.textContent.includes('Resume');
        if (isPaused) {
          dashboard.simulator?.start();
          e.target.textContent = '⏸️ Pause';
        } else {
          dashboard.simulator?.stop();
          e.target.textContent = '▶️ Resume';
        }
      } else if (action === 'export-png') {
        exportToPNG(dashboard.container, 'devdashboard-metrics.png');
      } else if (action === 'export-csv') {
        this._exportAllData(dashboard);
      }
    });
    
    header.addEventListener('change', (e) => {
      if (e.target.dataset.action === 'change-theme') {
        dashboard.setTheme(e.target.value);
      }
    });
  }
  
  /**
   * Add keyboard shortcuts
   */
  static _addKeyboardShortcuts(dashboard) {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + S to export
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        exportToPNG(dashboard.container, 'devdashboard-metrics.png');
      }
      
      // T to cycle themes
      if (e.key === 't' && !e.ctrlKey && !e.metaKey) {
        const themeKeys = Object.keys(themes);
        const currentIndex = themeKeys.indexOf(dashboard.config.theme);
        const nextIndex = (currentIndex + 1) % themeKeys.length;
        dashboard.setTheme(themeKeys[nextIndex]);
        
        // Update theme selector if exists
        const selector = document.querySelector('.dd-theme-selector');
        if (selector) selector.value = themeKeys[nextIndex];
      }
    });
  }
  
  /**
   * Export all dashboard data
   */
  static _exportAllData(dashboard) {
    const data = {};
    dashboard.visualizations.forEach((viz, key) => {
      data[key] = viz.config.data;
    });
    
    exportToCSV(data, 'devdashboard-export.csv');
  }
  
  /**
   * Get demo data for a specific visualization type
   */
  static _getDemoData(type) {
    const simulator = new RealtimeSimulator();
    return simulator.getData(type);
  }
  
  /**
   * Get visualization type mapping
   */
  static _getVisualizationType(type) {
    const typeMap = {
      commits: 'commitFrequency',
      quality: 'codeQuality',
      velocity: 'velocity'
    };
    
    return typeMap[type] || type;
  }
}

// Add static properties
DevDashboardFactory.themes = Object.keys(themes);
DevDashboardFactory.features = ['commits', 'quality', 'velocity'];
DevDashboardFactory.version = '1.0.0';

// Export as default
export default DevDashboardFactory;