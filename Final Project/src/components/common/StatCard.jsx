import React from 'react';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendPositive = true,
  colorVariant = 'primary' // primary | success | warning | danger | purple
}) {
  const getVariantStyles = () => {
    switch (colorVariant) {
      case 'success':
        return {
          bg: 'var(--color-success-light)',
          color: 'var(--color-success)',
          border: 'var(--color-success)'
        };
      case 'warning':
        return {
          bg: 'var(--color-warning-light)',
          color: 'var(--color-warning)',
          border: 'var(--color-warning)'
        };
      case 'danger':
        return {
          bg: 'var(--color-danger-light)',
          color: 'var(--color-danger)',
          border: 'var(--color-danger)'
        };
      case 'purple':
        return {
          bg: 'var(--color-purple-light)',
          color: 'var(--color-purple)',
          border: 'var(--color-purple)'
        };
      default:
        return {
          bg: 'var(--color-primary-light)',
          color: 'var(--color-primary)',
          border: 'var(--color-primary)'
        };
    }
  };

  const variant = getVariantStyles();

  return (
    <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.02em' }}>
            {title}
          </span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px', letterSpacing: '-0.02em' }}>
            {value}
          </div>
        </div>
        {Icon && (
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: variant.bg,
              color: variant.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Icon size={22} />
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem' }}>
          {trend && (
            <span
              style={{
                fontWeight: 700,
                color: trendPositive ? 'var(--color-success)' : 'var(--color-danger)',
                backgroundColor: trendPositive ? 'var(--color-success-light)' : 'var(--color-danger-light)',
                padding: '2px 6px',
                borderRadius: 'var(--radius-sm)'
              }}
            >
              {trend}
            </span>
          )}
          {subtitle && <span style={{ color: 'var(--text-muted)' }}>{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
