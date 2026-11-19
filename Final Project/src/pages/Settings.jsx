import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import ConfirmDialog from '../components/common/ConfirmDialog';
import {
  Settings as SettingsIcon,
  Building2,
  User,
  Sun,
  Moon,
  Database,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck
} from 'lucide-react';

export default function Settings() {
  const {
    clinicSettings,
    updateClinicSettings,
    resetToDefaultData,
    exportDataJSON,
    importDataJSON,
    patients,
    appointments,
    prescriptions,
    vitals,
    invoices
  } = useApp();

  const { theme, setTheme } = useTheme();

  const [formData, setFormData] = useState({ ...clinicSettings });
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const fileInputRef = useRef(null);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateClinicSettings(formData);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        importDataJSON(json);
      } catch (err) {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1000px' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Clinic Administration & System Settings
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Configure hospital information, design theme tokens, and manage LocalStorage database operations.
        </p>
      </div>

      {/* Clinic Profile Card */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <Building2 size={18} color="var(--color-primary)" />
              Clinical Practice Identity
            </h3>
            <p className="card-subtitle">Appears on official prescriptions, invoices, and letterheads</p>
          </div>
        </div>

        <form onSubmit={handleSaveSettings}>
          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label form-label-required">Hospital / Center Name</label>
              <input
                type="text"
                className="form-control"
                value={formData.clinicName}
                onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label form-label-required">Registration / License Number</label>
              <input
                type="text"
                className="form-control"
                value={formData.registrationNumber}
                onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
              />
            </div>
          </div>

          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label form-label-required">Chief Medical Practitioner</label>
              <input
                type="text"
                className="form-control"
                value={formData.doctorName}
                onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Professional Designation</label>
              <input
                type="text"
                className="form-control"
                value={formData.doctorDesignation}
                onChange={(e) => setFormData({ ...formData, doctorDesignation: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Clinic Physical Address</label>
            <input
              type="text"
              className="form-control"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="grid-cols-3">
            <div className="form-group">
              <label className="form-label">Helpline / Phone</label>
              <input
                type="text"
                className="form-control"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Official Email</label>
              <input
                type="email"
                className="form-control"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Billing Currency Symbol</label>
              <select
                className="form-control"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              >
                <option value="$">$ (USD)</option>
                <option value="₹">₹ (INR)</option>
                <option value="€">€ (EUR)</option>
                <option value="£">£ (GBP)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
            <button type="submit" className="btn btn-primary">
              <CheckCircle2 size={16} /> Save Clinic Profile
            </button>
          </div>
        </form>
      </div>

      {/* Theme Preferences */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Appearance & Color System</h3>
            <p className="card-subtitle">Select your preferred user interface lighting theme</p>
          </div>
        </div>

        <div className="grid-cols-2" style={{ gap: '16px' }}>
          <div
            onClick={() => setTheme('light')}
            style={{
              padding: '18px',
              borderRadius: 'var(--radius-md)',
              border: `2px solid ${theme === 'light' ? 'var(--color-primary)' : 'var(--border-light)'}`,
              backgroundColor: theme === 'light' ? 'var(--color-primary-light)' : 'var(--bg-surface-hover)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              transition: 'all var(--transition-fast)'
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                color: '#f59e0b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <Sun size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Clinical Daylight Mode</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Clean high-contrast palette for lit consultation rooms</div>
            </div>
          </div>

          <div
            onClick={() => setTheme('dark')}
            style={{
              padding: '18px',
              borderRadius: 'var(--radius-md)',
              border: `2px solid ${theme === 'dark' ? 'var(--color-primary)' : 'var(--border-light)'}`,
              backgroundColor: theme === 'dark' ? 'var(--color-primary-light)' : 'var(--bg-surface-hover)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              transition: 'all var(--transition-fast)'
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#1e293b',
                color: '#38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <Moon size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Midnight Telemetry Mode</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Dark low-glare interface optimized for night shifts & telemetry screens</div>
            </div>
          </div>
        </div>
      </div>

      {/* Database & Disaster Recovery Operations */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <Database size={18} color="var(--color-accent)" />
              Clinical Storage & Backup Hub
            </h3>
            <p className="card-subtitle">Client-side persistence engine synchronized with browser LocalStorage</p>
          </div>
          <span className="badge badge-success">
            <ShieldCheck size={12} /> Local Storage Active
          </span>
        </div>

        {/* Database Stats summary */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            backgroundColor: 'var(--bg-surface-hover)',
            padding: '14px 18px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px',
            textAlign: 'center'
          }}
        >
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>{patients.length}</div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Patients</div>
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>{appointments.length}</div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Appointments</div>
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>{prescriptions.length}</div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Prescriptions</div>
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>{vitals.length}</div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Vitals Logs</div>
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>{invoices.length}</div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Invoices</div>
          </div>
        </div>

        {/* Data Actions */}
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          <button onClick={exportDataJSON} className="btn btn-secondary">
            <Download size={15} /> Export Backup (JSON)
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn btn-secondary"
          >
            <Upload size={15} /> Restore From Backup (JSON)
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".json"
            style={{ display: 'none' }}
          />

          <button
            onClick={() => setIsResetDialogOpen(true)}
            className="btn btn-outline"
            style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}
          >
            <RefreshCw size={15} /> Restore Demo Dataset
          </button>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isResetDialogOpen}
        onClose={() => setIsResetDialogOpen(false)}
        onConfirm={resetToDefaultData}
        title="Restore Default College Demo Dataset?"
        message="This will reset all current patients, appointments, prescriptions, vitals, and billing records back to the original college evaluation dataset."
        confirmLabel="Yes, Reset All Data"
      />
    </div>
  );
}
