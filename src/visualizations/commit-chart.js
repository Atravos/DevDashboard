// src/visualizations/commit-chart.js
import BaseVisualization from './base';
const d3 = window.d3;

/**
 * CommitChart visualization for displaying commit frequency
 * @class
 * @extends BaseVisualization
 */
class CommitChart extends BaseVisualization {
  /**
   * Initialize the commit chart
   * @protected
   */
  _init() {
    super._init();
    
    // Create SVG element
    this.svg = d3.select(this.wrapper)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('class', 'commit-chart');
    
    // Create chart group
    this.chartGroup = this.svg.append('g')
      .attr('transform', `translate(${this.options.margin.left},${this.options.margin.top})`);
    
    // Create axes groups
    this.xAxisGroup = this.chartGroup.append('g')
      .attr('class', 'x-axis');
    
    this.yAxisGroup = this.chartGroup.append('g')
      .attr('class', 'y-axis');
    
    // Create tooltip
    this.tooltip = d3.select(this.wrapper)
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background-color', 'rgba(0, 0, 0, 0.7)')
      .style('color', 'white')
      .style('padding', '8px')
      .style('border-radius', '4px')
      .style('pointer-events', 'none');
    
    // Set up scales
    this.xScale = d3.scaleBand();
    this.yScale = d3.scaleLinear();
    
    // Initial render
    this.render();
  }
  
  /**
   * Handle resize events
   */
  resize() {
    this.render();
  }
  
  /**
   * Render the commit chart
   */
  render() {
    if (!this.data || !this.data.commits) {
      this.showError('No data available');
      return;
    }
    
    this.hideError();
    
    // Get container dimensions
    const width = this.wrapper.clientWidth;
    const height = this.wrapper.clientHeight;
    const chartWidth = width - this.options.margin.left - this.options.margin.right;
    const chartHeight = height - this.options.margin.top - this.options.margin.bottom;
    
    // Update scales
    this.xScale
      .domain(this.data.commits.map(d => d.date))
      .range([0, chartWidth])
      .padding(0.1);
    
    this.yScale
      .domain([0, d3.max(this.data.commits, d => d.count) * 1.1]) // Add 10% padding
      .range([chartHeight, 0]);
    
    // Update axes
    const xAxis = d3.axisBottom(this.xScale)
      .tickFormat(d => {
        // Format date based on timeRange option
        const date = new Date(d);
        if (this.options.timeRange === 'daily') {
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        } else if (this.options.timeRange === 'weekly') {
          return `Week ${date.getWeek()}`;
        } else if (this.options.timeRange === 'monthly') {
          return date.toLocaleDateString('en-US', { month: 'short' });
        }
        return date.toLocaleDateString();
      });
    
    const yAxis = d3.axisLeft(this.yScale)
      .ticks(5)
      .tickFormat(d => d);
    
    // Update axis groups
    this.xAxisGroup
      .attr('transform', `translate(0,${chartHeight})`)
      .call(xAxis)
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');
    
    this.yAxisGroup
      .call(yAxis);
    
    // Add axis labels
    // Remove existing labels first
    this.svg.selectAll('.axis-label').remove();
    
    // Add X axis label
    this.svg.append('text')
      .attr('class', 'axis-label x-label')
      .attr('text-anchor', 'middle')
      .attr('x', width / 2)
      .attr('y', height - 5)
      .text(this.options.xAxisLabel || 'Date');
    
    // Add Y axis label
    this.svg.append('text')
      .attr('class', 'axis-label y-label')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', 15)
      .text(this.options.yAxisLabel || 'Commit Count');
    
    // Create color scale
    const colorScale = d3.scaleLinear()
      .domain([0, d3.max(this.data.commits, d => d.count)])
      .range(['#7fcdbb', '#2c7fb8']);
    
    // Draw bars
    const bars = this.chartGroup.selectAll('.bar')
      .data(this.data.commits);
    
    // Remove old bars
    bars.exit().remove();
    
    // Update existing bars
    bars
      .attr('x', d => this.xScale(d.date))
      .attr('y', d => this.yScale(d.count))
      .attr('width', this.xScale.bandwidth())
      .attr('height', d => chartHeight - this.yScale(d.count))
      .attr('fill', d => colorScale(d.count));
    
    // Add new bars
    bars.enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => this.xScale(d.date))
      .attr('y', d => this.yScale(d.count))
      .attr('width', this.xScale.bandwidth())
      .attr('height', d => chartHeight - this.yScale(d.count))
      .attr('fill', d => colorScale(d.count))
      .on('mouseover', (event, d) => {
        // Show tooltip
        this.tooltip
          .style('opacity', 1)
          .html(`
            <div>
              <strong>Date:</strong> ${new Date(d.date).toLocaleDateString()}<br>
              <strong>Commits:</strong> ${d.count}
            </div>
          `)
          .style('left', `${event.pageX - this.wrapper.getBoundingClientRect().left + 10}px`)
          .style('top', `${event.pageY - this.wrapper.getBoundingClientRect().top - 40}px`);
      })
      .on('mouseout', () => {
        // Hide tooltip
        this.tooltip
          .style('opacity', 0);
      });
    
    // Add title
    this.svg.selectAll('.chart-title').remove();
    
    if (this.options.title) {
      this.svg.append('text')
        .attr('class', 'chart-title')
        .attr('text-anchor', 'middle')
        .attr('x', width / 2)
        .attr('y', 15)
        .style('font-size', '16px')
        .style('font-weight', 'bold')
        .text(this.options.title);
    }
  }
}

// Helper function to get week number
Date.prototype.getWeek = function() {
  const d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

export default CommitChart;