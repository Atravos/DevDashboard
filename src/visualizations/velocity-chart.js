// src/visualizations/velocity-chart.js
import BaseVisualization from './base';
const d3 = window.d3;
/**
 * VelocityChart visualization for displaying story points and velocity
 * @class
 * @extends BaseVisualization
 */
class VelocityChart extends BaseVisualization {
  /**
   * Initialize the velocity chart
   * @protected
   */
  _init() {
    super._init();
    
    // Create SVG element
    this.svg = d3.select(this.wrapper)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('class', 'velocity-chart');
    
    // Create chart group
    this.chartGroup = this.svg.append('g')
      .attr('transform', `translate(${this.options.margin.left},${this.options.margin.top})`);
    
    // Create axes groups
    this.xAxisGroup = this.chartGroup.append('g')
      .attr('class', 'x-axis');
    
    this.yAxisGroup = this.chartGroup.append('g')
      .attr('class', 'y-axis');
    
    // Create legend group
    this.legendGroup = this.svg.append('g')
      .attr('class', 'legend');
    
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
   * Render the velocity chart
   */
  render() {
    if (!this.data || !this.data.storyPoints || this.data.storyPoints.length === 0) {
      this.showError('No data available');
      return;
    }
    
    this.hideError();
    
    // Get container dimensions
    const width = this.wrapper.clientWidth;
    const height = this.wrapper.clientHeight;
    const chartWidth = width - this.options.margin.left - this.options.margin.right;
    const chartHeight = height - this.options.margin.top - this.options.margin.bottom;
    
    // Update x scale
    this.xScale
      .domain(this.data.storyPoints.map(d => d.period))
      .range([0, chartWidth])
      .padding(0.2);
    
    // Update y scale
    const maxPoints = d3.max(this.data.storyPoints, d => Math.max(d.total, d.completed));
    
    this.yScale
      .domain([0, maxPoints * 1.1]) // Add 10% padding
      .range([chartHeight, 0]);
    
    // Update axes
    const xAxis = d3.axisBottom(this.xScale);
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
      .text(this.options.xAxisLabel || 'Sprint');
    
    // Add Y axis label
    this.svg.append('text')
      .attr('class', 'axis-label y-label')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', 15)
      .text(this.options.yAxisLabel || 'Story Points');
    
    // Define colors
    const totalColor = getComputedStyle(this.wrapper).getPropertyValue('--dd-color-chart-0') || '#2196f3';
    const completedColor = getComputedStyle(this.wrapper).getPropertyValue('--dd-color-chart-1') || '#4caf50';
    const velocityColor = getComputedStyle(this.wrapper).getPropertyValue('--dd-color-chart-2') || '#ff9800';
    
    // Remove existing elements
    this.chartGroup.selectAll('.bar-total').remove();
    this.chartGroup.selectAll('.bar-completed').remove();
    this.chartGroup.selectAll('.velocity-line').remove();
    this.chartGroup.selectAll('.velocity-point').remove();
    
    // Draw total points bars
    this.chartGroup.selectAll('.bar-total')
      .data(this.data.storyPoints)
      .enter()
      .append('rect')
      .attr('class', 'bar-total')
      .attr('x', d => this.xScale(d.period))
      .attr('y', d => this.yScale(d.total))
      .attr('width', this.xScale.bandwidth())
      .attr('height', d => chartHeight - this.yScale(d.total))
      .attr('fill', totalColor)
      .attr('opacity', 0.5)
      .on('mouseover', (event, d) => {
        // Show tooltip
        this.tooltip
          .style('opacity', 1)
          .html(`
            <div>
              <strong>Sprint:</strong> ${d.period}<br>
              <strong>Total Points:</strong> ${d.total}<br>
              <strong>Stories:</strong> ${d.stories}
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
    
    // Draw completed points bars
    this.chartGroup.selectAll('.bar-completed')
      .data(this.data.storyPoints)
      .enter()
      .append('rect')
      .attr('class', 'bar-completed')
      .attr('x', d => this.xScale(d.period))
      .attr('y', d => this.yScale(d.completed))
      .attr('width', this.xScale.bandwidth())
      .attr('height', d => chartHeight - this.yScale(d.completed))
      .attr('fill', completedColor)
      .on('mouseover', (event, d) => {
        // Show tooltip
        this.tooltip
          .style('opacity', 1)
          .html(`
            <div>
              <strong>Sprint:</strong> ${d.period}<br>
              <strong>Completed Points:</strong> ${d.completed}<br>
              <strong>Completion Rate:</strong> ${Math.round(d.completed / d.total * 100)}%
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
    
    // Draw velocity line if enabled
    if (this.options.showVelocity) {
      // Calculate velocity as moving average of completed points
      const velocityData = this._calculateVelocity(this.data.storyPoints);
      
      // Create line generator
      const lineGenerator = d3.line()
        .x(d => this.xScale(d.period) + this.xScale.bandwidth() / 2)
        .y(d => this.yScale(d.velocity))
        .curve(d3.curveMonotoneX);
      
      // Draw line
      if (velocityData.length > 1) {
        this.chartGroup.append('path')
          .datum(velocityData)
          .attr('class', 'velocity-line')
          .attr('fill', 'none')
          .attr('stroke', velocityColor)
          .attr('stroke-width', 2)
          .attr('stroke-dasharray', '5,5')
          .attr('d', lineGenerator);
        
        // Draw points
        this.chartGroup.selectAll('.velocity-point')
          .data(velocityData)
          .enter()
          .append('circle')
          .attr('class', 'velocity-point')
          .attr('cx', d => this.xScale(d.period) + this.xScale.bandwidth() / 2)
          .attr('cy', d => this.yScale(d.velocity))
          .attr('r', 4)
          .attr('fill', velocityColor)
          .on('mouseover', (event, d) => {
            // Show tooltip
            this.tooltip
              .style('opacity', 1)
              .html(`
                <div>
                  <strong>Sprint:</strong> ${d.period}<br>
                  <strong>Velocity:</strong> ${d.velocity.toFixed(1)} points/sprint
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
      }
    }
    
    // Create legend
    this._renderLegend(chartWidth, chartHeight, totalColor, completedColor, velocityColor);
    
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
    
    // Add summary text
    if (this.data.summary) {
      this._renderSummary(width, chartHeight);
    }
  }
  
  /**
   * Calculate velocity data
   * @private
   * @param {Object[]} storyPoints - Story points data
   * @returns {Object[]} - Velocity data
   */
  _calculateVelocity(storyPoints) {
    const velocityWindow = this.options.velocityWindow || 3; // Default to 3-sprint window
    const velocityData = [];
    
    for (let i = 0; i < storyPoints.length; i++) {
      // Calculate average of completed points in window
      let sum = 0;
      let count = 0;
      
      for (let j = Math.max(0, i - velocityWindow + 1); j <= i; j++) {
        sum += storyPoints[j].completed;
        count++;
      }
      
      velocityData.push({
        period: storyPoints[i].period,
        velocity: sum / count
      });
    }
    
    return velocityData;
  }
  
  /**
   * Render the legend
   * @private
   * @param {number} chartWidth - Chart width
   * @param {number} chartHeight - Chart height
   * @param {string} totalColor - Color for total points
   * @param {string} completedColor - Color for completed points
   * @param {string} velocityColor - Color for velocity line
   */
  _renderLegend(chartWidth, chartHeight, totalColor, completedColor, velocityColor) {
    // Remove existing legend
    this.legendGroup.selectAll('*').remove();
    
    // Legend position
    const legendX = this.options.margin.left;
    const legendY = this.options.margin.top + chartHeight + 40;
    
    const legendItems = [
      { label: 'Total Points', color: totalColor, type: 'rect' },
      { label: 'Completed Points', color: completedColor, type: 'rect' }
    ];
    
    if (this.options.showVelocity) {
      legendItems.push({ label: 'Velocity', color: velocityColor, type: 'line' });
    }
    
    // Create legend items
    legendItems.forEach((item, i) => {
      const itemGroup = this.legendGroup.append('g')
        .attr('transform', `translate(${legendX + i * 120}, ${legendY})`);
      
      // Add color marker based on type
      if (item.type === 'rect') {
        itemGroup.append('rect')
          .attr('width', 12)
          .attr('height', 12)
          .attr('fill', item.color)
          .attr('opacity', item.label === 'Total Points' ? 0.5 : 1);
      } else {
        itemGroup.append('line')
          .attr('x1', 0)
          .attr('y1', 6)
          .attr('x2', 12)
          .attr('y2', 6)
          .attr('stroke', item.color)
          .attr('stroke-width', 2)
          .attr('stroke-dasharray', item.label === 'Velocity' ? '5,5' : 'none');
        
        itemGroup.append('circle')
          .attr('cx', 6)
          .attr('cy', 6)
          .attr('r', 3)
          .attr('fill', item.color);
      }
      
      // Add text
      itemGroup.append('text')
        .attr('x', 20)
        .attr('y', 10)
        .style('font-size', '12px')
        .style('fill', 'var(--dd-color-text)')
        .text(item.label);
    });
  }
  
  /**
   * Render summary stats
   * @private
   * @param {number} width - Chart width
   * @param {number} chartHeight - Chart height
   */
  _renderSummary(width, chartHeight) {
    // Remove existing summary
    this.svg.selectAll('.summary-text').remove();
    
    // Summary position
    const summaryX = width - this.options.margin.right - 150;
    const summaryY = this.options.margin.top + 30;
    
    // Create summary box
    const summaryGroup = this.svg.append('g')
      .attr('class', 'summary-text')
      .attr('transform', `translate(${summaryX}, ${summaryY})`);
    
    // Add background
    summaryGroup.append('rect')
      .attr('width', 150)
      .attr('height', 80)
      .attr('fill', 'var(--dd-color-surface)')
      .attr('stroke', 'var(--dd-color-border)')
      .attr('stroke-width', 1)
      .attr('rx', 4);
    
    // Add stats
    const summary = this.data.summary;
    
    summaryGroup.append('text')
      .attr('x', 10)
      .attr('y', 20)
      .style('font-size', '12px')
      .style('fill', 'var(--dd-color-text)')
      .text(`Avg Velocity: ${summary.velocity} pts`);
    
    summaryGroup.append('text')
      .attr('x', 10)
      .attr('y', 40)
      .style('font-size', '12px')
      .style('fill', 'var(--dd-color-text)')
      .text(`Completion: ${summary.completionRate}%`);
    
    summaryGroup.append('text')
      .attr('x', 10)
      .attr('y', 60)
      .style('font-size', '12px')
      .style('fill', 'var(--dd-color-text)')
      .text(`Total Points: ${summary.totalPoints}`);
  }
}

export default VelocityChart;