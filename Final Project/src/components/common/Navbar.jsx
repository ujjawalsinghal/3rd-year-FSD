import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Activity,
  Sun,
  Moon,
  Search,
  AlertCircle,
  Menu,
  Clock,
  Building2
} from 'lucide-react';

export default function Navbar() {
  const {
    clinicSettings,
    vitals,
    setActiveTab,
    globalSearch,
    setGlobalSearch,
    setIsMobileSidebarOpen
  } = useApp();
  const { theme, toggleTheme } = useTheme();

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const criticalCount = vitals.filter(v => v.riskLevel === 'Critical').length;

  const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const formattedDate = currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <header
      style={{
        height: 'var(--navbar-height)',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-light)',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: 'var(--shadow-xs)'
      }}
    >
      {/* Left: Mobile trigger & Clinic identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={() => setIsMobileSidebarOpen(prev => !prev)}
          className="btn btn-ghost btn-icon mobile-only"
          style={{ display: 'none' }}
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)'
            }}
          >
            <Activity size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
              MediPulse <span style={{ color: 'var(--color-primary)' }}>360</span>
            </h1>
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Building2 size={11} /> {clinicSettings.clinicName}
            </span>
          </div>
        </div>
      </div>

      {/* Middle: Universal Search Bar */}
      <div style={{ flex: 1, maxWidth: '420px', margin: '0 24px' }} className="hide-on-mobile">
        <div style={{ position: 'relative' }}>
          <Search
            size={16}
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            className="form-control"
            style={{ paddingLeft: '36px', height: '38px', borderRadius: 'var(--radius-full)' }}
            placeholder="Search patients, UHID, doctors, diagnoses..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Right: Clock, Critical Alert Banner, Theme Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* System Time */}
        <div
          className="hide-on-tablet"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            backgroundColor: 'var(--bg-surface-hover)',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)'
          }}
        >
          <Clock size={13} color="var(--color-primary)" />
          <span>{formattedDate}</span>
          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{formattedTime}</span>
        </div>

        {/* Critical Alerts Trigger */}
        {criticalCount > 0 && (
          <button
            onClick={() => setActiveTab('vitals')}
            className="btn btn-sm"
            style={{
              backgroundColor: 'var(--color-danger-light)',
              color: 'var(--color-danger)',
              border: '1px solid var(--color-danger)',
              borderRadius: 'var(--radius-full)',
              padding: '4px 10px',
              animation: 'pulse 2s infinite'
            }}
            title="Critical Vitals Triage Alerts"
          >
            <AlertCircle size={14} />
            <span>{criticalCount} Critical</span>
          </button>
        )}

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="btn btn-ghost btn-icon"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          aria-label="Toggle color theme"
          style={{ borderRadius: 'var(--radius-full)' }}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} color="#f59e0b" />}
        </button>

        {/* Status Chip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 8px',
            backgroundColor: 'var(--color-success-light)',
            color: 'var(--color-success-dark)',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.6875rem',
            fontWeight: 700
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-success)',
              display: 'inline-block'
            }}
          />
          ONLINE
        </div>
      </div>
    </header>
  );
}
