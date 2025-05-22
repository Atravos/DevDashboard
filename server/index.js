// server/index.js
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from project root
app.use(express.static(path.join(__dirname, '..')));

// Example API endpoint for sample data
app.get('/api/data/commits', (req, res) => {
  // Generate sample commit data
  const days = parseInt(req.query.days) || 30;
  const commits = generateCommitData(days);
  
  res.json(commits);
});

app.get('/api/data/quality', (req, res) => {
  // Generate sample quality data
  const days = parseInt(req.query.days) || 30;
  const quality = generateCodeQualityData(days);
  
  res.json(quality);
});

app.get('/api/data/story-points', (req, res) => {
  // Generate sample story points data
  const sprints = parseInt(req.query.sprints) || 8;
  const storyPoints = generateStoryPointsData(sprints);
  
  res.json(storyPoints);
});

// Catch-all handler for SPA client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../examples/index.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// Data generation functions
function generateCommitData(days = 30) {
  const commits = [];
  const date = new Date();
  date.setDate(date.getDate() - days);
  
  for (let i = 0; i < days; i++) {
    date.setDate(date.getDate() + 1);
    
    // Random commit count (more commits on weekdays)
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const count = Math.floor(Math.random() * (isWeekend ? 5 : 15)) + (isWeekend ? 0 : 5);
    
    // Add commits
    for (let j = 0; j < count; j++) {
      commits.push({
        id: `commit-${i}-${j}`,
        date: new Date(date),
        author: `developer${Math.floor(Math.random() * 5) + 1}@example.com`,
        repository: ['main-app', 'api', 'docs', 'ui-components'][Math.floor(Math.random() * 4)],
        message: `Commit message ${i}-${j}`
      });
    }
  }
  
  return commits;
}

function generateCodeQualityData(days = 30) {
  const data = [];
  const date = new Date();
  date.setDate(date.getDate() - days);
  
  // Start with some baseline values
  let bugs = 15;
  let vulnerabilities = 8;
  let codeSmells = 120;
  let coverage = 75;
  
  for (let i = 0; i < days; i++) {
    date.setDate(date.getDate() + 1);
    
    // Randomly adjust values (mostly improving over time)
    bugs = Math.max(0, bugs + (Math.random() > 0.7 ? 1 : -1));
    vulnerabilities = Math.max(0, vulnerabilities + (Math.random() > 0.8 ? 1 : -1));
    codeSmells = Math.max(0, codeSmells + (Math.random() > 0.6 ? 5 : -8));
    coverage = Math.min(100, Math.max(0, coverage + (Math.random() > 0.3 ? 0.5 : -0.2)));
    
    data.push({
      date: new Date(date),
      bugs,
      vulnerabilities,
      codeSmells,
      coverage: Math.round(coverage * 10) / 10
    });
  }
  
  return data;
}

function generateStoryPointsData(sprints = 8) {
  const data = [];
  
  for (let i = 1; i <= sprints; i++) {
    // Total points between 20-40
    const totalPoints = Math.floor(Math.random() * 20) + 20;
    
    // Completion rate between 60-100%
    const completionRate = Math.random() * 0.4 + 0.6;
    const completedPoints = Math.floor(totalPoints * completionRate);
    
    // Number of stories between 5-15
    const storiesCount = Math.floor(Math.random() * 10) + 5;
    
    // Create stories
    for (let j = 1; j <= storiesCount; j++) {
      const storyPoints = Math.floor(Math.random() * 8) + 1;
      const isCompleted = j <= Math.floor(storiesCount * completionRate);
      
      data.push({
        sprint: `Sprint ${i}`,
        id: `story-${i}-${j}`,
        title: `Story ${i}-${j}`,
        points: storyPoints,
        status: isCompleted ? 'done' : Math.random() > 0.5 ? 'in-progress' : 'todo'
      });
    }
  }
  
  return data;
}