import React from 'react';
import Modal from '../components/common/Modal';
import { useApp } from '../context/AppContext';
import {
  User,
  Heart,
  AlertTriangle,
  Pill,
  Calendar,
  Phone,
  Mail,
  MapPin,
  ShieldAlert,
  Activity,
  FileText
} from 'lucide-react';

export default function PatientDetailsModal({ patient, isOpen, onClose }) {
  const { vitals, prescriptions, appointments, setActiveTab } = useApp();

  if (!patient) return null;

  const patientVitals = vitals.filter(v => v.patientId === patient.id);
  const patientPrescriptions = prescriptions.filter(rx => rx.patientId === patient.id);
  const patientAppointments = appointments.filter(a => a.patientId === patient.id);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Electronic Health Record (EHR) Dossier"
      subtitle={`UHID: ${patient.id} • Registered Patient Dossier`}
      size="lg"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Last Clinical Interaction: {patient.lastVisit || 'N/A'}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => {
                onClose();
                setActiveTab('prescriptions');
              }}
              className="btn btn-secondary btn-sm"
            >
              <FileText size={14} /> New Rx
            </button>
            <button
              onClick={() => {
                onClose();
                setActiveTab('vitals');
              }}
              className="btn btn-primary btn-sm"
            >
              <Activity size={14} /> Log Telemetry
            </button>
          </div>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Patient Profile Card */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface-hover)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.25rem'
              }}
            >
              {patient.name.charAt(0)}
            </div>
            <div>
              <h4 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {patient.name}
              </h4>
              <div style={{ display: 'flex', gap: '12px', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                <span>{patient.age} yrs</span> &bull;
                <span>{patient.gender}</span> &bull;
                <span style={{ fontWeight: 700, color: 'var(--color-danger)' }}>Blood: {patient.bloodGroup}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className={`badge ${patient.status === 'Critical' ? 'badge-danger' : patient.status === 'Active' ? 'badge-success' : 'badge-neutral'}`}>
              {patient.status}
            </span>
          </div>
        </div>

        {/* Contact & Demographics Grid */}
        <div className="grid-cols-2" style={{ gap: '12px' }}>
          <div style={{ fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
            <Phone size={15} color="var(--color-primary)" />
            <span>{patient.phone}</span>
          </div>
          <div style={{ fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
            <Mail size={15} color="var(--color-primary)" />
            <span>{patient.email || 'N/A'}</span>
          </div>
          <div style={{ fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
            <MapPin size={15} color="var(--color-primary)" />
            <span>{patient.address || 'N/A'}</span>
          </div>
          <div style={{ fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
            <ShieldAlert size={15} color="var(--color-danger)" />
            <span>Emergency: {patient.emergencyContact || 'N/A'}</span>
          </div>
        </div>

        {/* Clinical Alerts: Chronic Conditions & Known Allergies */}
        <div className="grid-cols-2" style={{ gap: '16px' }}>
          <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '14px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
              Chronic Conditions
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {patient.chronicConditions && patient.chronicConditions.length > 0 ? (
                patient.chronicConditions.map((cond, i) => (
                  <span key={i} className="badge badge-warning">
                    {cond}
                  </span>
                ))
              ) : (
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>None documented</span>
              )}
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '14px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-danger)', display: 'block', marginBottom: '8px' }}>
              Known Drug & Food Allergies
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {patient.allergies && patient.allergies.length > 0 ? (
                patient.allergies.map((allergy, i) => (
                  <span key={i} className="badge badge-danger">
                    {allergy}
                  </span>
                ))
              ) : (
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>No known allergies</span>
              )}
            </div>
          </div>
        </div>

        {/* Clinical Notes */}
        {patient.notes && (
          <div style={{ backgroundColor: 'var(--color-primary-light)', padding: '12px 16px', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--color-primary)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: '4px' }}>
              Attending Physician Notes
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
              {patient.notes}
            </p>
          </div>
        )}

        {/* Recent Recorded Vitals Telemetry */}
        <div>
          <h5 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={16} color="var(--color-primary)" />
            Recent Vitals Telemetry History ({patientVitals.length})
          </h5>
          {patientVitals.length === 0 ? (
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>No vitals recorded yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table" style={{ fontSize: '0.8125rem' }}>
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>BP (mmHg)</th>
                    <th>Pulse (bpm)</th>
                    <th>SpO2</th>
                    <th>Glucose</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {patientVitals.slice(0, 3).map(v => (
                    <tr key={v.id}>
                      <td>{v.timestamp}</td>
                      <td style={{ fontWeight: 600 }}>{v.systolic}/{v.diastolic}</td>
                      <td>{v.heartRate}</td>
                      <td>{v.spO2}%</td>
                      <td>{v.bloodSugar} mg/dL</td>
                      <td>
                        <span className={`badge ${v.riskLevel === 'Critical' ? 'badge-danger' : v.riskLevel === 'Warning' ? 'badge-warning' : 'badge-success'}`}>
                          {v.riskLevel}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Prescriptions History */}
        <div>
          <h5 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Pill size={16} color="var(--color-accent)" />
            Issued Prescriptions ({patientPrescriptions.length})
          </h5>
          {patientPrescriptions.length === 0 ? (
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>No active prescriptions on file.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {patientPrescriptions.map(rx => (
                <div
                  key={rx.id}
                  style={{
                    backgroundColor: 'var(--bg-surface-hover)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '10px 14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--text-primary)' }}>
                      #{rx.id} - {rx.diagnosis}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {rx.medications.map(m => m.name).join(', ')} &bull; {rx.date}
                    </div>
                  </div>
                  <span className="badge badge-success">{rx.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
