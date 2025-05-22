// src/processors/data-processor.js

/**
 * DataProcessor for handling data transformation and preparation
 */
class DataProcessor {
  /**
   * Process commit data into a format suitable for visualization
   * @param {Object[]} rawData - Raw commit data
   * @param {Object} options - Processing options
   * @param {string} [options.timeRange='daily'] - Time range for grouping (daily, weekly, monthly)
   * @param {Function} [options.filter] - Filter function for commits
   * @returns {Object} - Processed data
   */
  static processCommitData(rawData, options = {}) {
    const { 
      timeRange = 'daily',
      filter = () => true
    } = options;
    
    // Apply filter
    const filteredData = rawData.filter(filter);
    
    // Group by time period
    const groupedData = this._groupByTimePeriod(filteredData, timeRange);
    
    // Format for visualization
    const commits = Object.entries(groupedData).map(([date, commits]) => ({
      date,
      count: commits.length,
      authors: this._extractUniqueAuthors(commits),
      repositories: this._extractUniqueRepositories(commits)
    }));
    
    // Sort by date
    commits.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return { 
      commits,
      summary: {
        totalCommits: commits.reduce((sum, item) => sum + item.count, 0),
        averageCommitsPerPeriod: Math.round(commits.reduce((sum, item) => sum + item.count, 0) / commits.length),
        maxCommitsInPeriod: Math.max(...commits.map(item => item.count)),
        uniqueAuthors: this._extractUniqueAuthors(filteredData).length,
        uniqueRepositories: this._extractUniqueRepositories(filteredData).length
      }
    };
  }
  
  /**
   * Process code quality data into a format suitable for visualization
   * @param {Object[]} rawData - Raw code quality data
   * @param {Object} options - Processing options
   * @returns {Object} - Processed data
   */
  static processCodeQualityData(rawData, options = {}) {
    const { 
      metrics = ['bugs', 'vulnerabilities', 'codeSmells', 'coverage'],
      filter = () => true
    } = options;
    
    // Apply filter
    const filteredData = rawData.filter(filter);
    
    // Sort by date
    filteredData.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Extract required metrics
    const qualityData = filteredData.map(item => {
      const result = {
        date: item.date
      };
      
      metrics.forEach(metric => {
        result[metric] = item[metric] || 0;
      });
      
      return result;
    });
    
    return { 
      qualityData,
      summary: this._calculateMetricsSummary(qualityData, metrics)
    };
  }
  
  /**
   * Process story points data into a format suitable for visualization
   * @param {Object[]} rawData - Raw story points data
   * @param {Object} options - Processing options
   * @returns {Object} - Processed data
   */
  static processStoryPointsData(rawData, options = {}) {
    const { 
      timeRange = 'sprint',
      filter = () => true
    } = options;
    
    // Apply filter
    const filteredData = rawData.filter(filter);
    
    // Group by sprint or time period
    const groupedData = timeRange === 'sprint' 
      ? this._groupBySprint(filteredData) 
      : this._groupByTimePeriod(filteredData, timeRange);
    
    // Format for visualization
    const storyPoints = Object.entries(groupedData).map(([period, stories]) => ({
      period,
      completed: stories.filter(s => s.status === 'done').reduce((sum, story) => sum + (story.points || 0), 0),
      total: stories.reduce((sum, story) => sum + (story.points || 0), 0),
      stories: stories.length
    }));
    
    // Calculate velocity
    let velocity = 0;
    if (storyPoints.length > 0) {
      velocity = storyPoints.reduce((sum, sprint) => sum + sprint.completed, 0) / storyPoints.length;
    }
    
    return { 
      storyPoints,
      summary: {
        totalStories: filteredData.length,
        totalPoints: filteredData.reduce((sum, story) => sum + (story.points || 0), 0),
        completedPoints: filteredData.filter(s => s.status === 'done').reduce((sum, story) => sum + (story.points || 0), 0),
        velocity: Math.round(velocity * 10) / 10,
        completionRate: Math.round(storyPoints.reduce((sum, sprint) => sum + sprint.completed, 0) / 
                                 Math.max(1, storyPoints.reduce((sum, sprint) => sum + sprint.total, 0)) * 100)
      }
    };
  }
  
  /**
   * Group data by time period
   * @private
   * @param {Object[]} data - Data to group
   * @param {string} timeRange - Time range for grouping (daily, weekly, monthly)
   * @returns {Object} - Grouped data
   */
  static _groupByTimePeriod(data, timeRange) {
    const groupedData = {};
    
    data.forEach(item => {
      const date = new Date(item.date || item.timestamp || item.createdAt);
      let key;
      
      if (timeRange === 'daily') {
        key = date.toISOString().split('T')[0]; // YYYY-MM-DD
      } else if (timeRange === 'weekly') {
        // Get week number
        const yearStart = new Date(date.getFullYear(), 0, 1);
        const weekNumber = Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
        key = `${date.getFullYear()}-W${weekNumber.toString().padStart(2, '0')}`;
      } else if (timeRange === 'monthly') {
        key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      } else {
        key = date.toISOString().split('T')[0]; // Default to daily
      }
      
      if (!groupedData[key]) {
        groupedData[key] = [];
      }
      
      groupedData[key].push(item);
    });
    
    return groupedData;
  }
  
  /**
   * Group data by sprint
   * @private
   * @param {Object[]} data - Data to group
   * @returns {Object} - Grouped data
   */
  static _groupBySprint(data) {
    const groupedData = {};
    
    data.forEach(item => {
      const sprint = item.sprint || 'Unassigned';
      
      if (!groupedData[sprint]) {
        groupedData[sprint] = [];
      }
      
      groupedData[sprint].push(item);
    });
    
    return groupedData;
  }
  
  /**
   * Extract unique authors from commits
   * @private
   * @param {Object[]} commits - Commit data
   * @returns {string[]} - Unique authors
   */
  static _extractUniqueAuthors(commits) {
    const authors = new Set();
    
    commits.forEach(commit => {
      const author = commit.author || commit.authorName || commit.authorEmail;
      if (author) {
        authors.add(author);
      }
    });
    
    return Array.from(authors);
  }
  
  /**
   * Extract unique repositories from commits
   * @private
   * @param {Object[]} commits - Commit data
   * @returns {string[]} - Unique repositories
   */
  static _extractUniqueRepositories(commits) {
    const repositories = new Set();
    
    commits.forEach(commit => {
      const repo = commit.repository || commit.repositoryName || commit.repoName;
      if (repo) {
        repositories.add(repo);
      }
    });
    
    return Array.from(repositories);
  }
  
  /**
   * Calculate metrics summary
   * @private
   * @param {Object[]} data - Quality data
   * @param {string[]} metrics - Metrics to calculate
   * @returns {Object} - Metrics summary
   */
  static _calculateMetricsSummary(data, metrics) {
    const summary = {};
    
    metrics.forEach(metric => {
      const values = data.map(item => item[metric] || 0);
      
      summary[metric] = {
        current: values[values.length - 1] || 0,
        min: Math.min(...values),
        max: Math.max(...values),
        average: Math.round(values.reduce((sum, val) => sum + val, 0) / Math.max(1, values.length) * 10) / 10,
        trend: values.length > 1 ? values[values.length - 1] - values[0] : 0
      };
    });
    
    return summary;
  }
}

export default DataProcessor;