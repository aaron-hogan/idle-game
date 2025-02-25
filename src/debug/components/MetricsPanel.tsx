import React from 'react';

export interface MetricItem {
  name: string;
  value: string | number;
  status?: 'good' | 'warning' | 'bad' | 'neutral';
}

interface MetricsPanelProps {
  title: string;
  metrics: MetricItem[];
}

/**
 * A reusable panel for displaying debug metrics
 */
const MetricsPanel: React.FC<MetricsPanelProps> = ({ title, metrics }) => {
  return (
    <div className="metrics-panel">
      <div className="metrics-panel-title">{title}</div>
      <div className="metrics-grid">
        {metrics.map((metric, index) => (
          <React.Fragment key={index}>
            <div className="metric-name">{metric.name}:</div>
            <div className={`metric-value ${metric.status || 'neutral'}`}>
              {typeof metric.value === 'number' ? 
                Number.isInteger(metric.value) ? metric.value : metric.value.toFixed(2) : 
                metric.value}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default MetricsPanel;