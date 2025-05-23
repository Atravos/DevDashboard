// src/index.js
import DevDashboard from './core/dashboard';
import DevDashboardFactory from './devdashboard'; // The new simplified API
import Config from './core/config';
import ThemeManager from './themes/theme-manager';
import DataProcessor from './processors/data-processor';

// Import all visualizations
import BaseVisualization from './visualizations/base';
import CommitChart from './visualizations/commit-chart';
import QualityMetricsChart from './visualizations/quality-metrics';
import VelocityChart from './visualizations/velocity-chart';

// Export the simplified API as the default
export default DevDashboardFactory;

// Also export individual components for advanced users
export {
  DevDashboard as Dashboard,  // Core dashboard class
  DevDashboardFactory,        // Simplified API
  Config,
  ThemeManager,
  DataProcessor,
  BaseVisualization,
  CommitChart,
  QualityMetricsChart,
  VelocityChart
};

// For backward compatibility and CDN usage
if (typeof window !== 'undefined') {
  window.DevDashboard = DevDashboardFactory;
}