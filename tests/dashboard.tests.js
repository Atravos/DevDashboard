// tests/dashboard.test.js
import { DevDashboard, ThemeManager, DataProcessor } from '../src';

// Mock DOM elements
beforeEach(() => {
  document.body.innerHTML = `
    <div id="dashboard-container"></div>
  `;
});

describe('DevDashboard', () => {
  test('should initialize with default config', () => {
    const dashboard = new DevDashboard({
      container: '#dashboard-container'
    });
    
    expect(dashboard.container).toBeDefined();
    expect(dashboard.config.theme).toBe('light');
  });
  
  test('should throw error if container is not found', () => {
    expect(() => {
      new DevDashboard({
        container: '#non-existent-container'
      });
    }).toThrow();
  });
  
  test('should add visualization', () => {
    const dashboard = new DevDashboard({
      container: '#dashboard-container'
    });
    
    // Mock visualization creation
    dashboard._createVisualization = jest.fn().mockReturnValue({
      render: jest.fn()
    });
    
    dashboard.addVisualization({
      id: 'test-viz',
      type: 'test',
      data: { test: 'data' },
      options: { test: 'options' }
    });
    
    expect(dashboard.visualizations.has('test-viz')).toBe(true);
    expect(dashboard._createVisualization).toHaveBeenCalledWith('test', expect.objectContaining({
      data: { test: 'data' },
      options: { test: 'options' }
    }));
  });
  
  test('should update data', () => {
    const dashboard = new DevDashboard({
      container: '#dashboard-container'
    });
    
    const mockViz = {
      render: jest.fn()
    };
    
    // Mock visualization creation
    dashboard._createVisualization = jest.fn().mockReturnValue(mockViz);
    
    dashboard.addVisualization({
      id: 'test-viz',
      type: 'test',
      data: { test: 'data' },
      options: { test: 'options' }
    });
    
    dashboard.updateData('test-viz', { test: 'updated-data' });
    
    const viz = dashboard.visualizations.get('test-viz');
    expect(viz.config.data).toEqual({ test: 'updated-data' });
  });
  
  test('should set theme', () => {
    const dashboard = new DevDashboard({
      container: '#dashboard-container'
    });
    
    dashboard.setTheme('dark');
    
    expect(dashboard.config.theme).toBe('dark');
    expect(dashboard.container.getAttribute('data-theme')).toBe('dark');
  });
  
  test('should register event listeners', () => {
    const dashboard = new DevDashboard({
      container: '#dashboard-container'
    });
    
    const mockCallback = jest.fn();
    dashboard.on('test-event', mockCallback);
    
    dashboard._triggerEvent('test-event', { test: 'data' });
    
    expect(mockCallback).toHaveBeenCalledWith({ test: 'data' });
  });
  
  test('should destroy dashboard', () => {
    const dashboard = new DevDashboard({
      container: '#dashboard-container'
    });
    
    // Mock visualization creation
    dashboard._createVisualization = jest.fn().mockReturnValue({
      render: jest.fn()
    });
    
    dashboard.addVisualization({
      id: 'test-viz',
      type: 'test',
      data: { test: 'data' }
    });
    
    dashboard.destroy();
    
    expect(dashboard.visualizations.size).toBe(0);
    expect(dashboard.container.classList.contains('dev-dashboard')).toBe(false);
  });
});

describe('ThemeManager', () => {
  test('should get theme by name', () => {
    const theme = ThemeManager.getTheme('light');
    
    expect(theme).toBeDefined();
    expect(theme.name).toBe('Light');
  });
  
  test('should return light theme if theme not found', () => {
    const theme = ThemeManager.getTheme('non-existent-theme');
    
    expect(theme).toBeDefined();
    expect(theme.name).toBe('Light');
  });
  
  test('should register custom theme', () => {
    ThemeManager.registerTheme('custom', {
      name: 'Custom Theme',
      colors: {
        background: '#f0f0f0'
      }
    });
    
    const theme = ThemeManager.getTheme('custom');
    
    expect(theme).toBeDefined();
    expect(theme.name).toBe('Custom Theme');
    expect(theme.colors.background).toBe('#f0f0f0');
  });
  
  test('should get available themes', () => {
    const themes = ThemeManager.getAvailableThemes();
    
    expect(themes).toBeDefined();
    expect(themes.light).toBe('Light');
    expect(themes.dark).toBe('Dark');
  });
});

describe('DataProcessor', () => {
  test('should process commit data', () => {
    const rawData = [
      { date: '2025-05-01', author: 'dev1@example.com', repository: 'repo1' },
      { date: '2025-05-01', author: 'dev2@example.com', repository: 'repo1' },
      { date: '2025-05-02', author: 'dev1@example.com', repository: 'repo2' }
    ];
    
    const processedData = DataProcessor.processCommitData(rawData);
    
    expect(processedData).toBeDefined();
    expect(processedData.commits).toHaveLength(2); // Grouped by date
    expect(processedData.summary).toBeDefined();
    expect(processedData.summary.totalCommits).toBe(3);
    expect(processedData.summary.uniqueAuthors).toBe(2);
    expect(processedData.summary.uniqueRepositories).toBe(2);
  });
  
  test('should filter commit data', () => {
    const rawData = [
      { date: '2025-05-01', author: 'dev1@example.com', repository: 'repo1' },
      { date: '2025-05-01', author: 'dev2@example.com', repository: 'repo1' },
      { date: '2025-05-02', author: 'dev1@example.com', repository: 'repo2' }
    ];
    
    const processedData = DataProcessor.processCommitData(rawData, {
      filter: commit => commit.author === 'dev1@example.com'
    });
    
    expect(processedData.commits).toHaveLength(2); // Grouped by date
    expect(processedData.summary.totalCommits).toBe(2);
    expect(processedData.summary.uniqueAuthors).toBe(1);
  });
  
  test('should process code quality data', () => {
    const rawData = [
      { date: '2025-05-01', bugs: 10, vulnerabilities: 5, codeSmells: 100, coverage: 75 },
      { date: '2025-05-02', bugs: 8, vulnerabilities: 4, codeSmells: 90, coverage: 78 }
    ];
    
    const processedData = DataProcessor.processCodeQualityData(rawData);
    
    expect(processedData).toBeDefined();
    expect(processedData.qualityData).toHaveLength(2);
    expect(processedData.summary).toBeDefined();
    expect(processedData.summary.bugs).toBeDefined();
    expect(processedData.summary.bugs.current).toBe(8);
    expect(processedData.summary.bugs.trend).toBe(-2);
  });
  
  test('should process story points data', () => {
    const rawData = [
      { sprint: 'Sprint 1', points: 10, status: 'done' },
      { sprint: 'Sprint 1', points: 5, status: 'in-progress' },
      { sprint: 'Sprint 2', points: 15, status: 'done' },
      { sprint: 'Sprint 2', points: 5, status: 'todo' }
    ];
    
    const processedData = DataProcessor.processStoryPointsData(rawData);
    
    expect(processedData).toBeDefined();
    expect(processedData.storyPoints).toHaveLength(2);
    expect(processedData.summary).toBeDefined();
    expect(processedData.summary.totalStories).toBe(4);
    expect(processedData.summary.totalPoints).toBe(35);
    expect(processedData.summary.completedPoints).toBe(25);
  });
});