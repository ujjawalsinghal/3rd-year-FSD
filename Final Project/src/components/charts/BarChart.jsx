import React, { useState } from 'react';

export default function BarChart({
  data = [
    { label: 'Cardio', value: 18, color: 'var(--color-primary)' },
    { label: 'Neuro', value: 12, color: 'var(--color-purple)' },
    { label: 'Ortho', value: 15, color: 'var(--color-accent)' },
    { label: 'Pulmo', value: 9, color: 'var(--color-warning)' },
    { label: 'General', value: 24, color: 'var(--color-success)' }
  ],
  height = 180
}) {
  const [hoverIndex, setHoverIndex] = useState(null);
  const maxValue = Math.max(...data.map(d => d.value), 25);

  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          height: `${height}px`,
          padding: '10px 0 0 0',
          gap: '12px'
        }}
      >
        {data.map((item, idx) => {
          const heightPercent = Math.max((item.value / maxValue) * 100, 8);
          const isHovered = hoverIndex === idx;

          return (
            <div
              key={idx}
              onMouseEnter={() => setHoverIndex(idx)}
              onMouseLeave={() => setHoverIndex(null)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%',
                justifyContent: 'flex-end',
                cursor: 'pointer'
              }}
            >
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  color: isHovered ? 'var(--color-primary)' : 'var(--text-muted)',
                  marginBottom: '4px',
                  opacity: isHovered ? 1 : 0.7,
                  transition: 'opacity 0.15s ease'
                }}
              >
                {item.value}
              </span>
              <div
                style={{
                  width: '100%',
                  maxWidth: '36px',
                  height: `${heightPercent}%`,
                  backgroundColor: item.color || 'var(--color-primary)',
                  borderRadius: '6px 6px 2px 2px',
                  transition: 'height 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.15s ease',
                  transform: isHovered ? 'scaleY(1.05)' : 'none',
                  transformOrigin: 'bottom'
                }}
              />
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  color: isHovered ? 'var(--text-primary)' : 'var(--text-secondary)',
                  marginTop: '8px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '50px'
                }}
                title={item.label}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
