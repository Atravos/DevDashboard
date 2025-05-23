// src/utils/export.js

/**
 * Export utilities for DevDashboard
 */

/**
 * Export dashboard as PNG image
 */
export async function exportToPNG(element, filename = 'dashboard.png') {
  try {
    // Use html2canvas if available, otherwise use built-in method
    if (window.html2canvas) {
      const canvas = await window.html2canvas(element);
      downloadCanvas(canvas, filename);
    } else {
      // Fallback: Convert SVG to canvas
      const svgs = element.querySelectorAll('svg');
      if (svgs.length > 0) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Get element dimensions
        const rect = element.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        
        // Draw background
        ctx.fillStyle = getComputedStyle(element).backgroundColor || 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Convert first SVG (simplified approach)
        const svg = svgs[0];
        const svgData = new XMLSerializer().serializeToString(svg);
        const img = new Image();
        
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
          downloadCanvas(canvas, filename);
        };
        
        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
      }
    }
  } catch (error) {
    console.error('Export to PNG failed:', error);
    alert('Export failed. Please try again.');
  }
}

/**
 * Export data as CSV
 */
export function exportToCSV(data, filename = 'data.csv') {
  try {
    let csv = '';
    
    // Handle different data structures
    if (data.commits) {
      csv += 'Commit Data\n';
      csv += 'Date,Author,Repository,Message\n';
      data.commits.forEach(commit => {
        csv += `"${commit.date}","${commit.author}","${commit.repository}","${commit.message}"\n`;
      });
      csv += '\n';
    }
    
    if (data.quality) {
      csv += 'Code Quality Data\n';
      csv += 'Date,Bugs,Vulnerabilities,Code Smells,Coverage\n';
      data.quality.forEach(item => {
        csv += `"${item.date}",${item.bugs},${item.vulnerabilities},${item.codeSmells},${item.coverage}\n`;
      });
      csv += '\n';
    }
    
    if (data.velocity) {
      csv += 'Sprint Velocity Data\n';
      csv += 'Sprint,Completed,Total,Stories\n';
      data.velocity.forEach(item => {
        csv += `"${item.sprint}",${item.completed},${item.total},${item.stories}\n`;
      });
    }
    
    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  } catch (error) {
    console.error('Export to CSV failed:', error);
    alert('Export failed. Please try again.');
  }
}

/**
 * Export data as JSON
 */
export function exportToJSON(data, filename = 'data.json') {
  try {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  } catch (error) {
    console.error('Export to JSON failed:', error);
    alert('Export failed. Please try again.');
  }
}

/**
 * Helper function to download canvas as image
 */
function downloadCanvas(canvas, filename) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL();
  link.click();
}

/**
 * Copy data to clipboard
 */
export async function copyToClipboard(data) {
  try {
    const text = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    await navigator.clipboard.writeText(text);
    
    // Show success message
    showToast('Copied to clipboard!');
  } catch (error) {
    console.error('Copy to clipboard failed:', error);
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    showToast('Copied to clipboard!');
  }
}

/**
 * Show a toast notification
 */
function showToast(message, duration = 3000) {
  const toast = document.createElement('div');
  toast.className = 'dd-toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 12px 20px;
    border-radius: 4px;
    font-size: 14px;
    z-index: 9999;
    animation: slideIn 0.3s ease;
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => document.body.removeChild(toast), 300);
  }, duration);
}

// Add CSS for animations
if (!document.querySelector('#dd-export-styles')) {
  const style = document.createElement('style');
  style.id = 'dd-export-styles';
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}