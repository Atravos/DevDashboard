// src/utils/realtime-simulator.js

/**
 * Simulates real-time developer metrics for impressive demos
 */
export class RealtimeSimulator {
  constructor(options = {}) {
    this.options = {
      updateInterval: 3000, // 3 seconds
      smoothTransitions: true,
      ...options
    };
    
    this.callbacks = new Map();
    this.intervals = new Map();
    this.data = {
      commits: [],
      quality: [],
      velocity: []
    };
    
    this._initializeData();
  }
  
  /**
   * Start simulating real-time updates
   */
  start() {
    // Simulate new commits
    this.intervals.set('commits', setInterval(() => {
      this._addNewCommit();
      this._triggerUpdate('commits');
    }, this.options.updateInterval));
    
    // Simulate quality metrics changes
    this.intervals.set('quality', setInterval(() => {
      this._updateQualityMetrics();
      this._triggerUpdate('quality');
    }, this.options.updateInterval * 1.5));
    
    // Simulate sprint progress
    this.intervals.set('velocity', setInterval(() => {
      this._updateSprintProgress();
      this._triggerUpdate('velocity');
    }, this.options.updateInterval * 2));
  }
  
  /**
   * Stop simulation
   */
  stop() {
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals.clear();
  }
  
  /**
   * Subscribe to data updates
   */
  subscribe(type, callback) {
    if (!this.callbacks.has(type)) {
      this.callbacks.set(type, new Set());
    }
    this.callbacks.get(type).add(callback);
    
    // Return unsubscribe function
    return () => {
      this.callbacks.get(type).delete(callback);
    };
  }
  
  /**
   * Get current data
   */
  getData(type) {
    return this.data[type];
  }
  
  _initializeData() {
    // Initialize with 30 days of commit history
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const dayCommits = this._generateDayCommits(date);
      this.data.commits.push(...dayCommits);
    }
    
    // Initialize quality metrics
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      this.data.quality.push({
        date: date.toISOString(),
        bugs: Math.floor(Math.random() * 20) + 5,
        vulnerabilities: Math.floor(Math.random() * 10),
        codeSmells: Math.floor(Math.random() * 100) + 50,
        coverage: Math.random() * 30 + 65
      });
    }
    
    // Initialize sprint data
    for (let i = 1; i <= 6; i++) {
      this.data.velocity.push({
        sprint: `Sprint ${i}`,
        completed: Math.floor(Math.random() * 30) + 20,
        total: Math.floor(Math.random() * 40) + 30,
        stories: Math.floor(Math.random() * 10) + 5
      });
    }
    
    // Add current sprint in progress
    this.data.velocity.push({
      sprint: 'Sprint 7',
      completed: 15,
      total: 35,
      stories: 8,
      inProgress: true
    });
  }
  
  _addNewCommit() {
    const developers = ['alex@company.com', 'sarah@company.com', 'mike@company.com', 'emma@company.com'];
    const repos = ['backend-api', 'frontend-app', 'mobile-app', 'data-pipeline'];
    const actions = ['Fixed', 'Added', 'Updated', 'Refactored', 'Optimized', 'Implemented'];
    const targets = ['authentication', 'user dashboard', 'API endpoints', 'database queries', 'caching layer', 'UI components'];
    
    const commit = {
      id: `commit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      date: new Date().toISOString(),
      author: developers[Math.floor(Math.random() * developers.length)],
      repository: repos[Math.floor(Math.random() * repos.length)],
      message: `${actions[Math.floor(Math.random() * actions.length)]} ${targets[Math.floor(Math.random() * targets.length)]}`
    };
    
    this.data.commits.push(commit);
    
    // Keep only last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    this.data.commits = this.data.commits.filter(c => new Date(c.date) > thirtyDaysAgo);
  }
  
  _updateQualityMetrics() {
    const latest = this.data.quality[this.data.quality.length - 1];
    
    // Simulate gradual improvement
    const newMetrics = {
      date: new Date().toISOString(),
      bugs: Math.max(0, latest.bugs + (Math.random() > 0.7 ? 1 : -1)),
      vulnerabilities: Math.max(0, latest.vulnerabilities + (Math.random() > 0.8 ? 1 : -1)),
      codeSmells: Math.max(0, latest.codeSmells + (Math.random() > 0.6 ? 3 : -5)),
      coverage: Math.min(100, Math.max(0, latest.coverage + (Math.random() - 0.3) * 2))
    };
    
    this.data.quality.push(newMetrics);
    
    // Keep only last 30 days
    if (this.data.quality.length > 30) {
      this.data.quality.shift();
    }
  }
  
  _updateSprintProgress() {
    const currentSprint = this.data.velocity.find(v => v.inProgress);
    if (currentSprint && currentSprint.completed < currentSprint.total) {
      // Simulate story completion
      const pointsToAdd = Math.floor(Math.random() * 5) + 1;
      currentSprint.completed = Math.min(currentSprint.total, currentSprint.completed + pointsToAdd);
      
      // If sprint is complete, start a new one
      if (currentSprint.completed >= currentSprint.total) {
        currentSprint.inProgress = false;
        
        const sprintNumber = parseInt(currentSprint.sprint.split(' ')[1]) + 1;
        this.data.velocity.push({
          sprint: `Sprint ${sprintNumber}`,
          completed: 0,
          total: Math.floor(Math.random() * 40) + 30,
          stories: Math.floor(Math.random() * 10) + 5,
          inProgress: true
        });
        
        // Keep only last 8 sprints
        if (this.data.velocity.length > 8) {
          this.data.velocity.shift();
        }
      }
    }
  }
  
  _generateDayCommits(date) {
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const commitCount = Math.floor(Math.random() * (isWeekend ? 5 : 15)) + (isWeekend ? 0 : 5);
    const commits = [];
    
    for (let i = 0; i < commitCount; i++) {
      const commitDate = new Date(date);
      commitDate.setHours(Math.floor(Math.random() * 10) + 9); // 9 AM to 7 PM
      commitDate.setMinutes(Math.floor(Math.random() * 60));
      
      commits.push({
        id: `commit-${date.toISOString()}-${i}`,
        date: commitDate.toISOString(),
        author: ['alex@company.com', 'sarah@company.com', 'mike@company.com', 'emma@company.com'][Math.floor(Math.random() * 4)],
        repository: ['backend-api', 'frontend-app', 'mobile-app', 'data-pipeline'][Math.floor(Math.random() * 4)],
        message: `Commit message for ${date.toDateString()} #${i}`
      });
    }
    
    return commits;
  }
  
  _triggerUpdate(type) {
    if (this.callbacks.has(type)) {
      this.callbacks.get(type).forEach(callback => {
        callback(this.data[type]);
      });
    }
  }
}

// Export a singleton for easy demo usage
export const demoSimulator = new RealtimeSimulator({
  updateInterval: 2000,
  smoothTransitions: true
});