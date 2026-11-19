import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Activity,
  CreditCard,
  Settings,
  ShieldAlert,
  UserCheck
} from 'lucide-react';

export default function Sidebar() {
  const {
    activeTab,
    setActiveTab,
    appointments,
    vitals,
    clinicSettings,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen
  } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointmentsCount = appointments.filter(
    a => a.date === todayStr && a.status !== 'Completed' && a.status !== 'Cancelled'
  ).length;

  const criticalVitalsCount = vitals.filter(v => v.riskLevel === 'Critical').length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Clinical Cockpit',
      icon: LayoutDashboard
    },
    {
      id: 'patients',
      label: 'Patient Records (EHR)',
      icon: Users
    },
    {
      id: 'appointments',
      label: 'Appointments & Triage',
      icon: Calendar,
      badge: todayAppointmentsCount > 0 ? todayAppointmentsCount : null,
      badgeVariant: 'badge-primary'
    },
    {
      id: 'prescriptions',
      label: 'Digital Rx Studio',
      icon: FileText
    },
    {
      id: 'vitals',
      label: 'Vitals & Telemetry',
      icon: Activity,
      badge: criticalVitalsCount > 0 ? `${criticalVitalsCount} Alert` : null,
      badgeVariant: 'badge-danger'
    },
    {
      id: 'billing',
      label: 'Billing & Invoices',
      icon: CreditCard
    },
    {
      id: 'settings',
      label: 'Clinic Settings & Data',
      icon: Settings
    }
  ];

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    if (isMobileSidebarOpen) {
      setIsMobileSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            zIndex: 90,
            backdropFilter: 'blur(2px)'
          }}
        />
      )}

      <aside
        className={`app-sidebar ${isMobileSidebarOpen ? 'sidebar-open' : ''}`}
        style={{
          width: 'var(--sidebar-width)',
          backgroundColor: 'var(--bg-sidebar)',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 100,
          transition: 'transform var(--transition-normal)',
          flexShrink: 0
        }}
      >
        {/* Clinic Reg Subheader */}
        <div
          style={{
            padding: '20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary)'
              }}
            />
            <span
              style={{
                fontSize: '0.6875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontWeight: 700,
                color: 'var(--text-sidebar)'
              }}
            >
              Clinical EHR System
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
            LIC: {clinicSettings.registrationNumber}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
          <div
            style={{
              fontSize: '0.6875rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#64748b',
              padding: '0 12px 8px 12px'
            }}
          >
            Clinical Operations
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
                    color: isActive ? '#ffffff' : 'var(--text-sidebar)',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    textAlign: 'left',
                    width: '100%'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'var(--bg-sidebar-hover)';
                      e.currentTarget.style.color = '#ffffff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--text-sidebar)';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`badge ${item.badgeVariant}`}
                      style={{
                        padding: '2px 8px',
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        backgroundColor: isActive ? 'rgba(255, 255, 255, 0.25)' : undefined,
                        color: isActive ? '#ffffff' : undefined
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Doctor Identity & Footer */}
        <div
          style={{
            padding: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: 'rgba(0, 0, 0, 0.2)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-sidebar-hover)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-primary)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <UserCheck size={18} />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: '#ffffff',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden'
                }}
              >
                {clinicSettings.doctorName}
              </div>
              <div
                style={{
                  fontSize: '0.6875rem',
                  color: '#94a3b8',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden'
                }}
              >
                {clinicSettings.doctorDesignation}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
