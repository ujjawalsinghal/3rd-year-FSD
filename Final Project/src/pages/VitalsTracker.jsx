import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { calculateVitalsRisk } from '../data/initialData';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';
import {
  Activity,
  Heart,
  Plus,
  Search,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  TrendingUp,
  Thermometer,
  Droplet,
  Info
} from 'lucide-react';

export default function VitalsTracker() {
  const {
    vitals,
    patients,
    logVitals,
    deleteVitals,
    globalSearch,
    setGlobalSearch
  } = useApp();

  const [riskFilter, setRiskFilter] = useState('All'); // All | Critical | Warning | Normal
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // Form State
  const initialFormState = {
    patientId: '',
    systolic: 120,
    diastolic: 80,
    heartRate: 72,
    spO2: 98,
    temperature: 98.6,
    bloodSugar: 100,
    notes: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});

  // Dynamic live risk assessment based on form values
  const currentRisk = calculateVitalsRisk(
    formData.systolic,
    formData.diastolic,
    formData.spO2,
    formData.heartRate
  );

  // Filtered Vitals
  const filteredVitals = useMemo(() => {
    return vitals.filter(v => {
      const query = (globalSearch || '').toLowerCase();
      const matchesSearch =
        !query ||
        v.patientName.toLowerCase().includes(query) ||
        v.patientId.toLowerCase().includes(query) ||
        (v.notes && v.notes.toLowerCase().includes(query));

      const matchesRisk = riskFilter === 'All' || v.riskLevel === riskFilter;

      return matchesSearch && matchesRisk;
    });
  }, [vitals, globalSearch, riskFilter]);

  const criticalCount = vitals.filter(v => v.riskLevel === 'Critical').length;
  const warningCount = vitals.filter(v => v.riskLevel === 'Warning').length;
  const normalCount = vitals.filter(v => v.riskLevel === 'Normal').length;

  const handleOpenLogModal = () => {
    setFormData({
      ...initialFormState,
      patientId: patients.length > 0 ? patients[0].id : ''
    });
    setFormErrors({});
    setIsLogModalOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.patientId) errors.patientId = 'Please select a patient.';
    if (!formData.systolic || formData.systolic < 50 || formData.systolic > 260) {
      errors.systolic = 'Enter valid systolic BP (50-260).';
    }
    if (!formData.diastolic || formData.diastolic < 30 || formData.diastolic > 160) {
      errors.diastolic = 'Enter valid diastolic BP (30-160).';
    }
    if (!formData.heartRate || formData.heartRate < 30 || formData.heartRate > 220) {
      errors.heartRate = 'Enter valid heart rate (30-220 bpm).';
    }
    if (!formData.spO2 || formData.spO2 < 50 || formData.spO2 > 100) {
      errors.spO2 = 'Enter valid SpO2 percentage (50-100%).';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveVitals = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const patient = patients.find(p => p.id === formData.patientId);
    if (!patient) return;

    logVitals({
      patientId: patient.id,
      patientName: patient.name,
      systolic: Number(formData.systolic),
      diastolic: Number(formData.diastolic),
      heartRate: Number(formData.heartRate),
      spO2: Number(formData.spO2),
      temperature: Number(formData.temperature),
      bloodSugar: Number(formData.bloodSugar),
      notes: formData.notes.trim()
    });

    setIsLogModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
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
            Vitals & Health Telemetry Tracker
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Continuous hemodynamic monitoring, automated risk classification, and acute alerts.
          </p>
        </div>

        <button onClick={handleOpenLogModal} className="btn btn-primary">
          <Plus size={16} />
          <span>Log Patient Telemetry</span>
        </button>
      </div>

      {/* Telemetry Status Summary Cards */}
      <div className="grid-cols-3">
        <div
          onClick={() => setRiskFilter('Critical')}
          className="card card-hover"
          style={{
            cursor: 'pointer',
            borderLeft: '4px solid var(--color-danger)',
            backgroundColor: riskFilter === 'Critical' ? 'var(--color-danger-light)' : 'var(--bg-surface)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-danger)', textTransform: 'uppercase' }}>
                Critical Acute Alerts
              </span>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                {criticalCount}
              </div>
            </div>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-danger-light)',
                color: 'var(--color-danger)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <AlertTriangle size={20} />
            </div>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', display: 'block' }}>
            BP &gt; 170/105, SpO2 &lt; 92%, Pulse &gt; 120
          </span>
        </div>

        <div
          onClick={() => setRiskFilter('Warning')}
          className="card card-hover"
          style={{
            cursor: 'pointer',
            borderLeft: '4px solid var(--color-warning)',
            backgroundColor: riskFilter === 'Warning' ? 'var(--color-warning-light)' : 'var(--bg-surface)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-warning-dark)', textTransform: 'uppercase' }}>
                Telemetry Warnings
              </span>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                {warningCount}
              </div>
            </div>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-warning-light)',
                color: 'var(--color-warning)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Activity size={20} />
            </div>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', display: 'block' }}>
            Stage 1 hypertension or mild tachycardia
          </span>
        </div>

        <div
          onClick={() => setRiskFilter('Normal')}
          className="card card-hover"
          style={{
            cursor: 'pointer',
            borderLeft: '4px solid var(--color-success)',
            backgroundColor: riskFilter === 'Normal' ? 'var(--color-success-light)' : 'var(--bg-surface)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-success)', textTransform: 'uppercase' }}>
                Stable Hemodynamics
              </span>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                {normalCount}
              </div>
            </div>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-success-light)',
                color: 'var(--color-success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <CheckCircle2 size={20} />
            </div>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', display: 'block' }}>
            Parameters in standard clinical range
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Filter:</span>
            {['All', 'Critical', 'Warning', 'Normal'].map(r => (
              <button
                key={r}
                onClick={() => setRiskFilter(r)}
                className={`btn btn-sm ${riskFilter === r ? 'btn-primary' : 'btn-secondary'}`}
              >
                {r}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '32px', fontSize: '0.8125rem' }}
              placeholder="Search by patient name or notes..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Vitals Log Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {filteredVitals.length === 0 ? (
          <EmptyState
            icon={Activity}
            title="No vitals logged matching filter"
            description="Record patient telemetry to maintain accurate longitudinal charts."
            actionLabel="Log Telemetry"
            onAction={handleOpenLogModal}
          />
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Patient</th>
                  <th>Blood Pressure</th>
                  <th>Heart Rate</th>
                  <th>SpO2</th>
                  <th>Temperature</th>
                  <th>Glucose</th>
                  <th>Risk Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVitals.map((v) => (
                  <tr key={v.id}>
                    <td>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                        {v.timestamp}
                      </span>
                    </td>

                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                        {v.patientName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {v.patientId}
                      </div>
                    </td>

                    <td>
                      <span style={{ fontWeight: 700, color: v.systolic >= 160 ? 'var(--color-danger)' : 'var(--text-primary)' }}>
                        {v.systolic}/{v.diastolic}
                      </span>
                      <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginLeft: '4px' }}>mmHg</span>
                    </td>

                    <td>
                      <span style={{ fontWeight: 600 }}>{v.heartRate}</span>
                      <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginLeft: '4px' }}>bpm</span>
                    </td>

                    <td>
                      <span style={{ fontWeight: 700, color: v.spO2 < 94 ? 'var(--color-danger)' : 'var(--text-primary)' }}>
                        {v.spO2}%
                      </span>
                    </td>

                    <td>
                      <span>{v.temperature}&deg;F</span>
                    </td>

                    <td>
                      <span>{v.bloodSugar}</span>
                      <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginLeft: '4px' }}>mg/dL</span>
                    </td>

                    <td>
                      <span className={`badge ${v.riskLevel === 'Critical' ? 'badge-danger' : v.riskLevel === 'Warning' ? 'badge-warning' : 'badge-success'}`}>
                        {v.riskLevel}
                      </span>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => deleteVitals(v.id)}
                        className="btn btn-ghost btn-icon btn-sm"
                        title="Delete telemetry entry"
                      >
                        <Trash2 size={15} color="var(--color-danger)" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Log Telemetry Modal with Real-Time Risk Evaluator */}
      <Modal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        title="Record Patient Vitals & Telemetry"
        subtitle="Automatic physiological evaluation alerts against clinical warning thresholds."
        size="md"
        footer={
          <>
            <button onClick={() => setIsLogModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={handleSaveVitals} className="btn btn-primary">
              Log Telemetry Record
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveVitals}>
          {/* Dynamic Real-Time Status Preview Badge */}
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              marginBottom: '16px',
              backgroundColor: currentRisk === 'Critical'
                ? 'var(--color-danger-light)'
                : currentRisk === 'Warning'
                ? 'var(--color-warning-light)'
                : 'var(--color-success-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={18} color={currentRisk === 'Critical' ? 'var(--color-danger)' : currentRisk === 'Warning' ? 'var(--color-warning-dark)' : 'var(--color-success)'} />
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: currentRisk === 'Critical' ? 'var(--color-danger)' : currentRisk === 'Warning' ? 'var(--color-warning-dark)' : 'var(--color-success-dark)' }}>
                Evaluated Triage Risk: {currentRisk.toUpperCase()}
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Live Telemetry Analysis
            </span>
          </div>

          <div className="form-group">
            <label className="form-label form-label-required">Select Patient</label>
            <select
              className={`form-control ${formErrors.patientId ? 'is-invalid' : ''}`}
              value={formData.patientId}
              onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
            >
              <option value="">-- Choose Patient --</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.id}) - {p.age}y, {p.gender}
                </option>
              ))}
            </select>
            {formErrors.patientId && <div className="form-error">{formErrors.patientId}</div>}
          </div>

          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label form-label-required">Systolic BP (mmHg)</label>
              <input
                type="number"
                className={`form-control ${formErrors.systolic ? 'is-invalid' : ''}`}
                value={formData.systolic}
                onChange={(e) => setFormData({ ...formData, systolic: e.target.value })}
              />
              <span className="form-help">Normal: 90-120 mmHg</span>
            </div>

            <div className="form-group">
              <label className="form-label form-label-required">Diastolic BP (mmHg)</label>
              <input
                type="number"
                className={`form-control ${formErrors.diastolic ? 'is-invalid' : ''}`}
                value={formData.diastolic}
                onChange={(e) => setFormData({ ...formData, diastolic: e.target.value })}
              />
              <span className="form-help">Normal: 60-80 mmHg</span>
            </div>
          </div>

          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label form-label-required">Heart Rate / Pulse (bpm)</label>
              <input
                type="number"
                className={`form-control ${formErrors.heartRate ? 'is-invalid' : ''}`}
                value={formData.heartRate}
                onChange={(e) => setFormData({ ...formData, heartRate: e.target.value })}
              />
              <span className="form-help">Normal: 60-100 bpm</span>
            </div>

            <div className="form-group">
              <label className="form-label form-label-required">Blood Oxygen SpO2 (%)</label>
              <input
                type="number"
                className={`form-control ${formErrors.spO2 ? 'is-invalid' : ''}`}
                value={formData.spO2}
                onChange={(e) => setFormData({ ...formData, spO2: e.target.value })}
              />
              <span className="form-help">Normal: 95-100% (&lt;92% alert)</span>
            </div>
          </div>

          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label">Body Temperature (&deg;F)</label>
              <input
                type="number"
                step="0.1"
                className="form-control"
                value={formData.temperature}
                onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
              />
              <span className="form-help">Normal: 98.6&deg;F</span>
            </div>

            <div className="form-group">
              <label className="form-label">Random Blood Glucose (mg/dL)</label>
              <input
                type="number"
                className="form-control"
                value={formData.bloodSugar}
                onChange={(e) => setFormData({ ...formData, bloodSugar: e.target.value })}
              />
              <span className="form-help">Normal: 70-140 mg/dL</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Clinical Observations & Physical Signs</label>
            <textarea
              className="form-control"
              rows="2"
              placeholder="e.g. Diaphoresis, shortness of breath on exertion, calm resting posture..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
