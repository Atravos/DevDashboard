// src/index.js
import DevDashboard from './core/dashboard';
import Config from './core/config';
import ThemeManager from './themes/theme-manager';
import DataProcessor from './processors/data-processor';

// Import all visualizations
import BaseVisualization from './visualizations/base';
import CommitChart from './visualizations/commit-chart';
import QualityMetricsChart from './visualizations/quality-metrics';
import VelocityChart from './visualizations/velocity-chart';

// Register visualizations
const visualizations = {
  commitFrequency: CommitChart,
  codeQuality: QualityMetricsChart,
  velocity: VelocityChart
};

// Visualization factory
function createVisualization(type, config) {
  const VisualizationClass = visualizations[type];
  if (!VisualizationClass) {
    throw new Error(`Visualization type "${type}" not found`);
  }
  
  return new VisualizationClass(config);
}

// Add visualization factory to DevDashboard
DevDashboard.prototype._createVisualization = function(type, config) {
  return createVisualization(type, config);
};

// Export public API
export {
  DevDashboard,
  Config,
  ThemeManager,
  DataProcessor,
  BaseVisualization,
  CommitChart,
  QualityMetricsChart,
  VelocityChart
};

// Default export
export default {
  dashboard: DevDashboard,
  config: Config,
  theme: ThemeManager,
  data: DataProcessor
};