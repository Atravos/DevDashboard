# DevDashboard

A lightweight JavaScript library for visualizing developer productivity metrics and project data.

## Features

- 📊 Clean, responsive data visualization components
- 👨‍💻 Support for various developer metrics (commit frequency, code quality, story points, etc.)
- 🎨 Customizable themes and styling options
- 🔌 Simple API for data input and configuration
- 📝 Well-documented with examples

## Installation

```bash
npm install dev-dashboard
```

## Usage

### Basic Example

```javascript
import { DevDashboard } from 'dev-dashboard';

// Create a new dashboard
const dashboard = new DevDashboard({
  container: '#dashboard-container',
  theme: 'light'
});

// Add a visualization
dashboard.addVisualization({
  id: 'commit-frequency',
  type: 'commitFrequency',
  data: {
    commits: [
      { date: '2025-05-01', count: 10, authors: ['dev1@example.com'], repositories: ['repo1'] },
      { date: '2025-05-02', count: 15, authors: ['dev1@example.com', 'dev2@example.com'], repositories: ['repo1'] },
      { date: '2025-05-03', count: 5, authors: ['dev2@example.com'], repositories: ['repo1'] }
    ]
  },
  options: {
    title: 'Commit Frequency',
    timeRange: 'daily',
    xAxisLabel: 'Date',
    yAxisLabel: 'Commits'
  }
});
```

### Data Processing

The library includes data processors to transform raw data into formats suitable for visualization.

```javascript
import { DataProcessor } from 'dev-dashboard';

// Raw commit data
const rawCommits = [
  { id: 'c1', date: '2025-05-01', author: 'dev1@example.com', repository: 'repo1', message: 'Fix bug' },
  { id: 'c2', date: '2025-05-01', author: 'dev2@example.com', repository: 'repo1', message: 'Add feature' },
  // ...more commits
];

// Process data
const processedData = DataProcessor.processCommitData(rawCommits, {
  timeRange: 'daily' // or 'weekly', 'monthly'
});

// Use processed data with visualization
dashboard.addVisualization({
  id: 'commit-frequency',
  type: 'commitFrequency',
  data: processedData,
  options: {
    title: 'Commit Frequency'
  }
});
```

### Themes

The library includes built-in themes and supports custom themes.

```javascript
import { DevDashboard, ThemeManager } from 'dev-dashboard';

// Register a custom theme
ThemeManager.registerTheme('custom', {
  name: 'Custom Theme',
  colors: {
    background: '#f0f0f0',
    surface: '#ffffff',
    primary: '#3f51b5',
    // ...more colors
  },
  // ...more theme properties
});

// Create dashboard with custom theme
const dashboard = new DevDashboard({
  container: '#dashboard-container',
  theme: 'custom'
});

// Change theme
dashboard.setTheme('dark');
```

## Available Visualizations

### Commit Frequency Chart

Displays commit frequency over time.

```javascript
dashboard.addVisualization({
  id: 'commit-frequency',
  type: 'commitFrequency',
  data: commitData,
  options: {
    title: 'Commit Frequency',
    timeRange: 'daily', // 'daily', 'weekly', 'monthly'
    xAxisLabel: 'Date',
    yAxisLabel: 'Commits'
  }
});
```

### Code Quality Chart

Displays code quality metrics over time.

```javascript
dashboard.addVisualization({
  id: 'code-quality',
  type: 'codeQuality',
  data: qualityData,
  options: {
    title: 'Code Quality',
    metrics: ['bugs', 'vulnerabilities', 'codeSmells', 'coverage']
  }
});
```

### Story Points Chart

Displays story points and velocity.

```javascript
dashboard.addVisualization({
  id: 'story-points',
  type: 'storyPoints',
  data: storyPointsData,
  options: {
    title: 'Story Points',
    timeRange: 'sprint', // 'sprint', 'weekly', 'monthly'
    showVelocity: true
  }
});
```

## API Reference

### DevDashboard

#### Constructor

```javascript
new DevDashboard(config)
```

**Config Options:**
- `container`: String selector or HTMLElement (required)
- `theme`: Theme name (default: 'light')

#### Methods

- `addVisualization(config)`: Add a visualization
- `updateData(id, data)`: Update data for a specific visualization
- `removeVisualization(id)`: Remove a visualization
- `setTheme(theme)`: Set dashboard theme
- `on(event, callback)`: Register an event listener
- `destroy()`: Destroy the dashboard instance

### ThemeManager

#### Methods

- `getTheme(name)`: Get a theme by name
- `registerTheme(name, theme)`: Register a custom theme
- `getAvailableThemes()`: Get all available themes
- `applyTheme(themeName, container)`: Apply theme to container

### DataProcessor

#### Methods

- `processCommitData(rawData, options)`: Process commit data
- `processCodeQualityData(rawData, options)`: Process code quality data
- `processStoryPointsData(rawData, options)`: Process story points data

## Events

The dashboard emits events that you can listen to:

```javascript
dashboard.on('visualizationAdded', data => {
  console.log(`Visualization ${data.id} added`);
});

dashboard.on('dataUpdated', data => {
  console.log(`Data updated for ${data.id}`);
});

dashboard.on('visualizationRemoved', data => {
  console.log(`Visualization ${data.id} removed`);
});

dashboard.on('themeChanged', data => {
  console.log(`Theme changed to ${data.theme}`);
});
```

## Browser Support

DevDashboard supports all modern browsers, including:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Building from Source

```bash
# Clone the repository
git clone https://github.com/yourusername/dev-dashboard.git
cd dev-dashboard

# Install dependencies
npm install

# Build the library
npm run build

# Run tests
npm test

# Start development server
npm run dev
```

## License

MIT