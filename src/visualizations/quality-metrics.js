// src/visualizations/quality-metrics.js
import BaseVisualization from './base';
const d3 = window.d3;

/**
 * QualityMetricsChart visualization for displaying code quality metrics
 * @class
 * @extends BaseVisualization
 */
class QualityMetricsChart extends BaseVisualization {
  /**
   * Initialize the quality metrics chart
   * @protected
   */
  _init() {
    super._init();
    
    // Default metrics to display
    this.metrics = this.options.metrics || ['bugs', 'vulnerabilities', 'codeSmells', 'coverage'];
    
    // Create SVG element
    this.svg = d3.select(this.wrapper)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('class', 'quality-metrics-chart');
    
    // Create chart group
    this.chartGroup = this.svg.append('g')
      .attr('transform', `translate(${this.options.margin.left},${this.options.margin.top})`);
    
    // Create axes groups
    this.xAxisGroup = this.chartGroup.append('g')
      .attr('class', 'x-axis');
    
    this.yAxisGroup = this.chartGroup.append('g')
      .attr('class', 'y-axis');
    
    // Create second y-axis group if needed (for coverage)
    if (this.metrics.includes('coverage')) {
      this.y2AxisGroup = this.chartGroup.append('g')
        .attr('class', 'y2-axis');
    }
    
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
    this.xScale = d3.scaleTime();
    this.yScale = d3.scaleLinear();
    this.y2Scale = d3.scaleLinear(); // For coverage (percentage)
    this.colorScale = d3.scaleOrdinal();
    
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
   * Render the quality metrics chart
   */
  render() {
    if (!this.data || !this.data.qualityData || this.data.qualityData.length === 0) {
      this.showError('No data available');
      return;
    }
    
    this.hideError();
    
    // Get container dimensions
    const width = this.wrapper.clientWidth;
    const height = this.wrapper.clientHeight;
    const chartWidth = width - this.options.margin.left - this.options.margin.right;
    const chartHeight = height - this.options.margin.top - this.options.margin.bottom;
    
    // Filter metrics to display
    const metricsToDisplay = this.options.metrics || this.metrics;
    
    // Separate coverage from other metrics (for secondary Y-axis)
    const hasCoverage = metricsToDisplay.includes('coverage');
    const metricsForPrimaryAxis = metricsToDisplay.filter(m => m !== 'coverage');
    
    // Set domain for color scale
    this.colorScale
      .domain(metricsToDisplay)
      .range(d3.range(metricsToDisplay.length).map(i => {
        const cssVar = getComputedStyle(this.wrapper).getPropertyValue(`--dd-color-chart-${i}`);
        // Fallback colors if CSS variables aren't set
        const fallbackColors = ['#2196f3', '#4caf50', '#ff9800', '#f44336', '#9c27b0', '#00bcd4', '#ffeb3b', '#795548'];
        return cssVar || fallbackColors[i] || '#666';
      }));
    
    // Update x scale
    this.xScale
      .domain(d3.extent(this.data.qualityData, d => new Date(d.date)))
      .range([0, chartWidth]);
    
    // Update y scale for primary metrics (issues)
    const maxIssues = d3.max(this.data.qualityData, d => {
      return d3.max(metricsForPrimaryAxis.map(metric => d[metric] || 0));
    });
    
    this.yScale
      .domain([0, maxIssues * 1.1]) // Add 10% padding
      .range([chartHeight, 0]);
    
    // Update y2 scale for coverage (percentage)
    if (hasCoverage) {
      this.y2Scale
        .domain([0, 100])
        .range([chartHeight, 0]);
    }
    
    // Update axes
    const xAxis = d3.axisBottom(this.xScale)
      .ticks(5)
      .tickFormat(d => d.toLocaleDateString(this.options.locale || 'en-US', {
        month: 'short',
        day: 'numeric'
      }));
    
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
    
    // Add coverage axis if needed
    if (hasCoverage) {
      const y2Axis = d3.axisRight(this.y2Scale)
        .ticks(5)
        .tickFormat(d => `${d}%`);
      
      this.y2AxisGroup
        .attr('transform', `translate(${chartWidth},0)`)
        .call(y2Axis);
    }
    
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
      .text(this.options.yAxisLabel || 'Issues');
    
    // Add Y2 axis label if needed
    if (hasCoverage) {
      this.svg.append('text')
        .attr('class', 'axis-label y2-label')
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(90)')
        .attr('x', height / 2)
        .attr('y', -width + 15)
        .text('Coverage %');
    }
    
    // Create line generators
    const lineGenerator = d3.line()
      .x(d => this.xScale(new Date(d.date)))
      .y(d => this.yScale(d.value))
      .curve(d3.curveMonotoneX);
    
    const coverageLineGenerator = d3.line()
      .x(d => this.xScale(new Date(d.date)))
      .y(d => this.y2Scale(d.value))
      .curve(d3.curveMonotoneX);
    
    // Prepare data for lines
    const lineData = [];
    
    // Add primary metrics
    metricsForPrimaryAxis.forEach(metric => {
      const values = this.data.qualityData.map(d => ({
        date: d.date,
        value: d[metric] || 0
      }));
      
      lineData.push({
        metric,
        values,
        generator: lineGenerator
      });
    });
    
    // Add coverage if needed
    if (hasCoverage) {
      const values = this.data.qualityData.map(d => ({
        date: d.date,
        value: d.coverage || 0
      }));
      
      lineData.push({
        metric: 'coverage',
        values,
        generator: coverageLineGenerator
      });
    }
    
    // Draw lines
    this.chartGroup.selectAll('.metric-line').remove();
    this.chartGroup.selectAll('.metric-circle').remove();
    
    lineData.forEach(line => {
      // Draw line
      this.chartGroup.append('path')
        .datum(line.values)
        .attr('class', 'metric-line')
        .attr('fill', 'none')
        .attr('stroke', this.colorScale(line.metric))
        .attr('stroke-width', 2)
        .attr('d', line.generator);
      
      // Draw circles for data points
      this.chartGroup.selectAll(`.metric-circle-${line.metric}`)
        .data(line.values)
        .enter()
        .append('circle')
        .attr('class', `metric-circle metric-circle-${line.metric}`)
        .attr('cx', d => this.xScale(new Date(d.date)))
        .attr('cy', d => line.metric === 'coverage' ? this.y2Scale(d.value) : this.yScale(d.value))
        .attr('r', 4)
        .attr('fill', this.colorScale(line.metric))
        .on('mouseover', (event, d) => {
          // Show tooltip
          this.tooltip
            .style('opacity', 1)
            .html(`
              <div>
                <strong>Date:</strong> ${new Date(d.date).toLocaleDateString()}<br>
                <strong>${this._formatMetricName(line.metric)}:</strong> ${line.metric === 'coverage' ? `${d.value}%` : d.value}
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
    });
    
    // Create legend
    this._renderLegend(metricsToDisplay, chartWidth, chartHeight);
    
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
  
  /**
   * Render the legend
   * @private
   * @param {string[]} metrics - Metrics to display in legend
   * @param {number} chartWidth - Chart width
   * @param {number} chartHeight - Chart height
   */
  _renderLegend(metrics, chartWidth, chartHeight) {
    // Remove existing legend
    this.legendGroup.selectAll('*').remove();
    
    // Legend position
    const legendX = this.options.margin.left;
    const legendY = this.options.margin.top + chartHeight + 40;
    
    // Create legend items
    metrics.forEach((metric, i) => {
      const itemGroup = this.legendGroup.append('g')
        .attr('transform', `translate(${legendX + i * 120}, ${legendY})`);
      
      // Add color marker
      itemGroup.append('rect')
        .attr('width', 12)
        .attr('height', 12)
        .attr('fill', this.colorScale(metric));
      
      // Add text
      itemGroup.append('text')
        .attr('x', 20)
        .attr('y', 10)
        .style('font-size', '12px')
        .style('fill', 'var(--dd-color-text)')
        .text(this._formatMetricName(metric));
    });
  }
  
  /**
   * Format metric name for display
   * @private
   * @param {string} metric - Metric name
   * @returns {string} - Formatted metric name
   */
  _formatMetricName(metric) {
    // Convert camelCase to Title Case with spaces
    return metric
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  }
}

export default QualityMetricsChart;