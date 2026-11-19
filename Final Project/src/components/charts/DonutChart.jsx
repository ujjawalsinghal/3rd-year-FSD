import React, { useState } from 'react';

export default function DonutChart({
  data = [
    { label: 'Normal Priority', value: 12, color: 'var(--color-success)' },
    { label: 'Urgent Care', value: 5, color: 'var(--color-warning)' },
    { label: 'Emergency Triage', value: 2, color: 'var(--color-danger)' }
  ],
  size = 180,
  strokeWidth = 24
}) {
  const [activeSlice, setActiveSlice] = useState(null);

  const total = data.reduce((acc, cur) => acc + cur.value, 0) || 1;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let currentOffset = 0;
  const slices = data.map((item) => {
    const percentage = item.value / total;
    const strokeDasharray = `${circumference * percentage} ${circumference * (1 - percentage)}`;
    const strokeDashoffset = -currentOffset;
    currentOffset += circumference * percentage;
    return {
      ...item,
      percentage: Math.round(percentage * 100),
      strokeDasharray,
      strokeDashoffset
    };
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
      <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background circle track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--bg-surface-hover)"
            strokeWidth={strokeWidth}
          />
          {slices.map((slice, i) => (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={slice.color}
              strokeWidth={activeSlice === i ? strokeWidth + 4 : strokeWidth}
              strokeDasharray={slice.strokeDasharray}
              strokeDashoffset={slice.strokeDashoffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
              onMouseEnter={() => setActiveSlice(i)}
              onMouseLeave={() => setActiveSlice(null)}
              style={{
                transition: 'stroke-width 0.2s ease, opacity 0.2s ease',
                cursor: 'pointer',
                opacity: activeSlice === null || activeSlice === i ? 1 : 0.6
              }}
            />
          ))}
        </svg>

        {/* Center label */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none'
          }}
        >
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {activeSlice !== null ? slices[activeSlice].value : total}
          </span>
          <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            {activeSlice !== null ? slices[activeSlice].label.split(' ')[0] : 'Total Cases'}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, minWidth: '140px' }}>
        {slices.map((slice, idx) => (
          <div
            key={idx}
            onMouseEnter={() => setActiveSlice(idx)}
            onMouseLeave={() => setActiveSlice(null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: activeSlice === idx ? 'var(--bg-surface-hover)' : 'transparent',
              transition: 'background-color 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: slice.color,
                  display: 'inline-block'
                }}
              />
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                {slice.label}
              </span>
            </div>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {slice.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
