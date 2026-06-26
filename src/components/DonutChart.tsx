import React, { useState } from 'react';
import { ChartDataSegment } from '../types';
import { formatIndianCurrency } from '../utils/calculatorMath';

interface DonutChartProps {
  segments: ChartDataSegment[];
  centerLabel?: string;
  centerValue?: number;
}

export default function DonutChart({ segments, centerLabel = 'Total Value', centerValue }: DonutChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Compute total
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  
  // Circle calculations
  const radius = 70;
  const strokeWidth = 14;
  const hoverStrokeWidth = 18;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate cumulative percentages
  let accumulatedPercent = 0;

  const displayLabel = hoveredIndex !== null ? segments[hoveredIndex].name : centerLabel;
  const displayValue = hoveredIndex !== null ? segments[hoveredIndex].value : (centerValue ?? total);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Chart Canvas */}
      <div className="relative w-64 h-64 md:w-72 md:h-72 flex items-center justify-center transition-all duration-300">
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full transform -rotate-90 select-none filter drop-shadow-sm"
          id="svg-financial-chart"
        >
          {/* Default background circle if total is zero */}
          {total === 0 ? (
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="transparent"
              stroke="#e2e8f0"
              strokeWidth={strokeWidth}
              id="empty-chart-circle"
            />
          ) : (
            segments.map((segment, index) => {
              const percentage = segment.value / total;
              const strokeLength = percentage * circumference;
              // The offset is negative to rotate clockwise from -90deg starting position
              const strokeOffset = -(accumulatedPercent * circumference);
              
              accumulatedPercent += percentage;

              const isHovered = hoveredIndex === index;

              return (
                <circle
                  key={segment.name}
                  id={`donut-slice-${index}`}
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="transparent"
                  stroke={segment.color}
                  strokeWidth={isHovered ? hoverStrokeWidth : strokeWidth}
                  strokeDasharray={`${strokeLength} ${circumference}`}
                  strokeDashoffset={strokeOffset}
                  strokeLinecap={percentage > 0.02 ? 'round' : 'butt'} // Round caps for a beautiful organic premium feel
                  className="cursor-pointer transition-all duration-300 ease-out"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              );
            })
          )}
        </svg>

        {/* Centered Summary Text Container - Structured explicitly to prevent any truncation */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 pointer-events-none select-none">
          <span className="text-[11px] font-sans font-semibold text-slate-400 uppercase tracking-widest leading-none mb-1.5">
            {displayLabel}
          </span>
          <span className="text-xl md:text-2xl font-mono font-bold text-slate-900 tracking-tight leading-tight transition-all duration-200">
            {formatIndianCurrency(displayValue)}
          </span>
          {total > 0 && (
            <span className="text-[11px] font-mono font-medium text-slate-500 mt-1">
              {hoveredIndex !== null 
                ? `${((segments[hoveredIndex].value / total) * 100).toFixed(1)}%`
                : '100.0%'}
            </span>
          )}
        </div>
      </div>

      {/* Modern High-Contrast Minimalist Legends */}
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4 max-w-sm">
        {segments.map((segment, index) => {
          const percent = total > 0 ? (segment.value / total) * 100 : 0;
          return (
            <div
              key={segment.name}
              id={`chart-legend-item-${index}`}
              className={`flex items-center gap-2 px-2 py-1 rounded-md transition-all duration-200 cursor-pointer ${
                hoveredIndex === index ? 'bg-slate-50' : ''
              }`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: segment.color }}
              />
              <span className="text-xs font-sans font-medium text-slate-600">
                {segment.name}
              </span>
              <span className="text-xs font-mono font-bold text-slate-800 ml-1">
                {percent.toFixed(0)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
