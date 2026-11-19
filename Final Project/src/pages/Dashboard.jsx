import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import StatCard from '../components/common/StatCard';
import AreaTrendChart from '../components/charts/AreaTrendChart';
import DonutChart from '../components/charts/DonutChart';
import BarChart from '../components/charts/BarChart';
import EmptyState from '../components/common/EmptyState';
import {
  Users,
  Calendar,
  AlertTriangle,
  DollarSign,
  PlusCircle,
  Activity,
  FileText,
  Clock,
  ArrowRight,
  CheckCircle2,
  Stethoscope
} from 'lucide-react';

export default function Dashboard() {
  const {
    patients,
    appointments,
    vitals,
    invoices,
    clinicSettings,
    setActiveTab,
    updateAppointmentStatus
  } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];

  // Dynamic Metrics
  const totalPatients = patients.length;
  const todayAppointments = appointments.filter(a => a.date === todayStr);
  const criticalVitals = vitals.filter(v => v.riskLevel === 'Critical');
  const warningVitals = vitals.filter(v => v.riskLevel === 'Warning');
  
  const totalRevenue = invoices
    .filter(inv => inv.status === 'Paid')
    .reduce((sum, inv) => sum + (inv.total || 0), 0);

  // Triage Distribution Data for Donut Chart
  const emergencyCount = appointments.filter(a => a.triageLevel === 'Emergency').length;
  const urgentCount = appointments.filter(a => a.triageLevel === 'Urgent').length;
  const normalCount = appointments.filter(a => a.triageLevel === 'Normal' || !a.triageLevel).length;

  const triageChartData = [
    { label: 'Normal Routine', value: normalCount || 1, color: 'var(--color-success)' },
    { label: 'Urgent Care', value: urgentCount, color: 'var(--color-warning)' },
    { label: 'Emergency Triage', value: emergencyCount, color: 'var(--color-danger)' }
  ];

  // Department Distribution for Bar Chart
  const departmentCounts = appointments.reduce((acc, a) => {
    const dept = a.department || 'General';
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});

  const deptChartData = Object.keys(departmentCounts).map((dept) => ({
    label: dept.slice(0, 7),
    value: departmentCounts[dept],
    color: 'var(--color-primary)'
  }));

  const getTriageBadge = (level) => {
    switch (level) {
      case 'Emergency':
        return <span className="badge badge-danger">Emergency</span>;
      case 'Urgent':
        return <span className="badge badge-warning">Urgent</span>;
      default:
        return <span className="badge badge-success">Routine</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'In Consultation':
        return <span className="badge badge-purple">In Consultation</span>;
      case 'Checked In':
        return <span className="badge badge-primary">Checked In</span>;
      case 'Completed':
        return <span className="badge badge-neutral">Completed</span>;
      case 'Cancelled':
        return <span className="badge badge-danger">Cancelled</span>;
      default:
        return <span className="badge badge-neutral">Scheduled</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Clinical Operations Cockpit
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Live triage status, scheduled consultations, and telemetry alerts for today.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('patients')}
            className="btn btn-secondary btn-sm"
          >
            <Users size={15} />
            <span>New Patient</span>
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className="btn btn-secondary btn-sm"
          >
            <Calendar size={15} />
            <span>Book Appointment</span>
          </button>
          <button
            onClick={() => setActiveTab('vitals')}
            className="btn btn-primary btn-sm"
          >
            <Activity size={15} />
            <span>Log Telemetry</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid-cols-4">
        <StatCard
          title="ACTIVE PATIENTS"
          value={totalPatients}
          subtitle="Registered in clinical EHR"
          trend="+8% this month"
          trendPositive={true}
          icon={Users}
          colorVariant="primary"
        />
        <StatCard
          title="TODAY'S SCHEDULE"
          value={todayAppointments.length}
          subtitle={`${todayAppointments.filter(a => a.status === 'Completed').length} completed`}
          trend="85% occupancy"
          trendPositive={true}
          icon={Calendar}
          colorVariant="purple"
        />
        <StatCard
          title="TRIAGE CRITICAL"
          value={criticalVitals.length}
          subtitle={`${warningVitals.length} telemetry warnings`}
          trend={criticalVitals.length > 0 ? "Immediate Attention" : "All Stable"}
          trendPositive={criticalVitals.length === 0}
          icon={AlertTriangle}
          colorVariant={criticalVitals.length > 0 ? "danger" : "success"}
        />
        <StatCard
          title="CLINICAL REVENUE"
          value={`${clinicSettings.currency}${totalRevenue.toLocaleString()}`}
          subtitle="Processed outpatient billings"
          trend="+14% vs last week"
          trendPositive={true}
          icon={DollarSign}
          colorVariant="success"
        />
      </div>

      {/* Visual Analytics Row */}
      <div className="grid-cols-3">
        {/* Weekly Trend Chart (2 columns span) */}
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <div className="card-header">
            <div>
              <h3 className="card-title">Outpatient Patient Flow</h3>
              <p className="card-subtitle">Weekly consultation volume distribution</p>
            </div>
            <span className="badge badge-primary">Live Sync</span>
          </div>
          <AreaTrendChart height={220} />
        </div>

        {/* Triage Priority Distribution */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Triage Urgency</h3>
              <p className="card-subtitle">Acuity distribution across clinic</p>
            </div>
          </div>
          <div style={{ padding: '8px 0' }}>
            <DonutChart data={triageChartData} size={160} />
          </div>
        </div>
      </div>

      {/* Critical Telemetry Alerts Banner */}
      {criticalVitals.length > 0 && (
        <div
          style={{
            backgroundColor: 'var(--color-danger-light)',
            border: '1px solid var(--color-danger)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-danger)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <AlertTriangle size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-danger)' }}>
                {criticalVitals.length} Patient(s) Triggered Critical Telemetry Alerts
              </h4>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Abnormal hemodynamic parameters detected (BP &gt; 170/105, SpO2 &lt; 92% or extreme tachycardia).
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('vitals')}
            className="btn btn-danger btn-sm"
          >
            Review Critical Vitals <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Main Operational Tables Row */}
      <div className="grid-cols-3">
        {/* Today's Priority Schedule (2 cols) */}
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <Calendar size={18} color="var(--color-primary)" />
                Today's Consultations ({todayAppointments.length})
              </h3>
              <p className="card-subtitle">Scheduled appointments and real-time status transitions</p>
            </div>
            <button
              onClick={() => setActiveTab('appointments')}
              className="btn btn-ghost btn-sm"
            >
              View Full Schedule <ArrowRight size={14} />
            </button>
          </div>

          {todayAppointments.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No appointments scheduled for today"
              description="Click below to schedule a new patient consultation."
              actionLabel="Book Appointment"
              onAction={() => setActiveTab('appointments')}
            />
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Patient</th>
                    <th>Department</th>
                    <th>Triage</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {todayAppointments.map((apt) => (
                    <tr key={apt.id}>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Clock size={13} color="var(--text-muted)" />
                          <span>{apt.time}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {apt.patientName}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {apt.patientId} &bull; {apt.type}
                        </div>
                      </td>
                      <td>{apt.department}</td>
                      <td>{getTriageBadge(apt.triageLevel)}</td>
                      <td>{getStatusBadge(apt.status)}</td>
                      <td style={{ textAlign: 'right' }}>
                        {apt.status === 'Scheduled' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'Checked In')}
                            className="btn btn-outline btn-sm"
                          >
                            Check In
                          </button>
                        )}
                        {apt.status === 'Checked In' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'In Consultation')}
                            className="btn btn-primary btn-sm"
                          >
                            <Stethoscope size={13} /> Consult
                          </button>
                        )}
                        {apt.status === 'In Consultation' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'Completed')}
                            className="btn btn-secondary btn-sm"
                            style={{ color: 'var(--color-success)' }}
                          >
                            <CheckCircle2 size={13} /> Complete
                          </button>
                        )}
                        {apt.status === 'Completed' && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                            Finished
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Department Workload Summary (1 col) */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Department Load</h3>
              <p className="card-subtitle">Appointments by specialty</p>
            </div>
          </div>
          <BarChart data={deptChartData.length > 0 ? deptChartData : undefined} height={180} />
          <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Clinic Utilization</span>
              <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>78% Capacity</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Average Wait Time</span>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>14 Minutes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
