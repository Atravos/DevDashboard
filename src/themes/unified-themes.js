// src/themes/unified-themes.js

const themes = {
  professional: {
    name: 'Professional',
    style: 'clean',
    colors: {
      background: '#ffffff',
      surface: '#f8f9fa',
      primary: '#0066cc',
      secondary: '#6c757d',
      success: '#28a745',
      warning: '#ffc107',
      danger: '#dc3545',
      text: '#212529',
      textMuted: '#6c757d',
      border: '#dee2e6',
      chart: ['#0066cc', '#28a745', '#ffc107', '#dc3545', '#6f42c1', '#20c997', '#fd7e14', '#6c757d']
    },
    effects: {
      shadow: '0 0.125rem 0.25rem rgba(0,0,0,0.075)',
      borderRadius: '0.375rem',
      transition: 'all 0.2s ease'
    }
  },
  
  // Dark mode for late-night coding sessions
  darkMode: {
    name: 'Dark Mode',
    style: 'modern',
    colors: {
      background: '#0d1117',
      surface: '#161b22',
      primary: '#58a6ff',
      secondary: '#8b949e',
      success: '#3fb950',
      warning: '#d29922',
      danger: '#f85149',
      text: '#c9d1d9',
      textMuted: '#8b949e',
      border: '#30363d',
      chart: ['#58a6ff', '#3fb950', '#d29922', '#f85149', '#bc8cff', '#39d3d0', '#ff7b72', '#8b949e']
    },
    effects: {
      shadow: '0 0 0 1px rgba(255,255,255,0.1)',
      borderRadius: '0.375rem',
      transition: 'all 0.2s ease'
    }
  },
  
  // Cyberpunk theme
  cyberpunk: {
    name: 'Cyberpunk',
    style: 'futuristic',
    colors: {
      background: '#0a0a0a',
      surface: '#1a1a2e',
      primary: '#00ff88',
      secondary: '#ff0088',
      success: '#00ff88',
      warning: '#ffff00',
      danger: '#ff0088',
      text: '#00ff88',
      textMuted: '#00cc66',
      border: '#00ff88',
      chart: ['#00ff88', '#ff0088', '#00ffff', '#ff00ff', '#ffff00', '#8800ff', '#ff8800', '#0088ff']
    },
    effects: {
      shadow: '0 0 20px rgba(0,255,136,0.5)',
      borderRadius: '0',
      transition: 'all 0.1s ease',
      glow: true,
      scanlines: true
    }
  },
  
  // Ocean theme for a calming experience
  ocean: {
    name: 'Ocean',
    style: 'gradient',
    colors: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      surface: 'rgba(255, 255, 255, 0.1)',
      primary: '#80deea',
      secondary: '#c5e1a5',
      success: '#c5e1a5',
      warning: '#fff59d',
      danger: '#ef9a9a',
      text: '#ffffff',
      textMuted: 'rgba(255, 255, 255, 0.8)',
      border: 'rgba(255, 255, 255, 0.2)',
      chart: ['#80deea', '#c5e1a5', '#fff59d', '#ef9a9a', '#ce93d8', '#90caf9', '#ffcc80', '#bcaaa4']
    },
    effects: {
      shadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      borderRadius: '1rem',
      transition: 'all 0.3s ease',
      backdrop: 'blur(20px)',
      glassmorphism: true
    }
  }
};

export default themes;