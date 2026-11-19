import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';
import {
  FileText,
  Plus,
  Search,
  Printer,
  Trash2,
  Pill,
  AlertTriangle,
  Stethoscope,
  Calendar,
  Building2,
  CheckCircle2
} from 'lucide-react';

export default function Prescriptions() {
  const {
    prescriptions,
    patients,
    clinicSettings,
    addPrescription,
    deletePrescription,
    globalSearch,
    setGlobalSearch
  } = useApp();

  // Modal states
  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);
  const [selectedRxForPrint, setSelectedRxForPrint] = useState(null);

  // Form State
  const initialFormState = {
    patientId: '',
    diagnosis: '',
    notes: '',
    medications: [
      { name: '', dosage: '', frequency: '1-0-1', duration: '7 Days', instructions: 'Take after meals' }
    ]
  };

  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});

  // Filtered Prescriptions
  const filteredPrescriptions = useMemo(() => {
    return prescriptions.filter(rx => {
      const query = (globalSearch || '').toLowerCase();
      return (
        !query ||
        rx.patientName.toLowerCase().includes(query) ||
        rx.patientId.toLowerCase().includes(query) ||
        rx.diagnosis.toLowerCase().includes(query) ||
        rx.id.toLowerCase().includes(query)
      );
    });
  }, [prescriptions, globalSearch]);

  const selectedPatient = patients.find(p => p.id === formData.patientId);

  const handleOpenCompose = () => {
    setFormData({
      ...initialFormState,
      patientId: patients.length > 0 ? patients[0].id : ''
    });
    setFormErrors({});
    setIsComposeModalOpen(true);
  };

  const handleAddMedicationRow = () => {
    setFormData(prev => ({
      ...prev,
      medications: [
        ...prev.medications,
        { name: '', dosage: '', frequency: '1-0-1', duration: '7 Days', instructions: 'Take after meals' }
      ]
    }));
  };

  const handleRemoveMedicationRow = (index) => {
    if (formData.medications.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      medications: prev.medications.filter((_, idx) => idx !== index)
    }));
  };

  const handleMedicationChange = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.medications];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, medications: updated };
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.patientId) errors.patientId = 'Please select a patient.';
    if (!formData.diagnosis.trim()) errors.diagnosis = 'Clinical diagnosis is required.';

    const invalidMed = formData.medications.some(m => !m.name.trim() || !m.dosage.trim());
    if (invalidMed) {
      errors.medications = 'Please provide Medicine Name and Dosage for all listed medications.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSavePrescription = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const patient = patients.find(p => p.id === formData.patientId);
    if (!patient) return;

    addPrescription({
      patientId: patient.id,
      patientName: patient.name,
      doctor: clinicSettings.doctorName,
      diagnosis: formData.diagnosis.trim(),
      medications: formData.medications,
      notes: formData.notes.trim()
    });

    setIsComposeModalOpen(false);
  };

  const handlePrint = () => {
    window.print();
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
            Digital Prescription & Consultation Studio
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Compose structured clinical prescriptions, cross-check drug allergies, and generate printable hospital slips.
          </p>
        </div>

        <button onClick={handleOpenCompose} className="btn btn-primary">
          <Plus size={16} />
          <span>Write Prescription</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="card" style={{ padding: '16px 20px' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-control"
            style={{ paddingLeft: '36px' }}
            placeholder="Search prescriptions by patient or diagnosis..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Prescriptions List */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {filteredPrescriptions.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No prescriptions found"
            description="No digital prescriptions have been issued matching this criteria."
            actionLabel="Write New Prescription"
            onAction={handleOpenCompose}
          />
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Rx ID & Date</th>
                  <th>Patient</th>
                  <th>Diagnosis / Clinical Indication</th>
                  <th>Medications Summary</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPrescriptions.map((rx) => (
                  <tr key={rx.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}>
                        #{rx.id}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {rx.date}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                        {rx.patientName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {rx.patientId}
                      </div>
                    </td>

                    <td>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem' }}>
                        {rx.diagnosis}
                      </span>
                    </td>

                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', maxWidth: '320px' }}>
                        {rx.medications.map((m, i) => (
                          <span key={i} style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                            &bull; <strong>{m.name}</strong> ({m.dosage}) - {m.frequency}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td>
                      <span className="badge badge-success">{rx.status}</span>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          onClick={() => setSelectedRxForPrint(rx)}
                          className="btn btn-outline btn-sm"
                          title="View and Print Hospital Prescription Slip"
                        >
                          <Printer size={14} /> Slip Preview
                        </button>
                        <button
                          onClick={() => deletePrescription(rx.id)}
                          className="btn btn-ghost btn-icon btn-sm"
                          title="Archive prescription"
                        >
                          <Trash2 size={15} color="var(--color-danger)" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Compose Prescription Modal */}
      <Modal
        isOpen={isComposeModalOpen}
        onClose={() => setIsComposeModalOpen(false)}
        title="Compose Digital Prescription"
        subtitle="Specify diagnosis, structured medication timings, and dietary advice."
        size="lg"
        footer={
          <>
            <button onClick={() => setIsComposeModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={handleSavePrescription} className="btn btn-primary">
              <CheckCircle2 size={16} /> Issue Prescription
            </button>
          </>
        }
      >
        <form onSubmit={handleSavePrescription}>
          {/* Patient Selector */}
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
                  {p.name} ({p.id}) - {p.gender}, {p.age}y [Blood: {p.bloodGroup}]
                </option>
              ))}
            </select>
            {formErrors.patientId && <div className="form-error">{formErrors.patientId}</div>}
          </div>

          {/* Patient Allergies Warning Banner if Patient is selected */}
          {selectedPatient && selectedPatient.allergies && selectedPatient.allergies.length > 0 && (
            <div
              style={{
                backgroundColor: 'var(--color-danger-light)',
                border: '1px solid var(--color-danger)',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <AlertTriangle size={18} color="var(--color-danger)" />
              <div style={{ fontSize: '0.8125rem', color: 'var(--color-danger)' }}>
                <strong>CRITICAL ALLERGY ALERT:</strong> {selectedPatient.name} has documented allergies to: <strong>{selectedPatient.allergies.join(', ')}</strong>. Do not prescribe cross-reactive drugs.
              </div>
            </div>
          )}

          {/* Diagnosis */}
          <div className="form-group">
            <label className="form-label form-label-required">Clinical Diagnosis / Chief Indication</label>
            <input
              type="text"
              className={`form-control ${formErrors.diagnosis ? 'is-invalid' : ''}`}
              placeholder="e.g. Stage 2 Essential Hypertension & Hyperlipidemia"
              value={formData.diagnosis}
              onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
            />
            {formErrors.diagnosis && <div className="form-error">{formErrors.diagnosis}</div>}
          </div>

          {/* Dynamic Medications List */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span className="form-label form-label-required" style={{ margin: 0 }}>
                Prescribed Medications (Rx)
              </span>
              <button
                type="button"
                onClick={handleAddMedicationRow}
                className="btn btn-secondary btn-sm"
              >
                <Plus size={14} /> Add Medicine
              </button>
            </div>

            {formErrors.medications && (
              <div className="form-error" style={{ marginBottom: '10px' }}>
                {formErrors.medications}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {formData.medications.map((med, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: 'var(--bg-surface-hover)',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    display: 'grid',
                    gridTemplateColumns: '2fr 1.2fr 1fr 1fr 2fr auto',
                    gap: '10px',
                    alignItems: 'center'
                  }}
                >
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Medicine Name (e.g. Metformin)"
                    value={med.name}
                    onChange={(e) => handleMedicationChange(idx, 'name', e.target.value)}
                  />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Dosage (500mg)"
                    value={med.dosage}
                    onChange={(e) => handleMedicationChange(idx, 'dosage', e.target.value)}
                  />
                  <select
                    className="form-control"
                    value={med.frequency}
                    onChange={(e) => handleMedicationChange(idx, 'frequency', e.target.value)}
                  >
                    <option value="1-0-0">1-0-0 (Morning)</option>
                    <option value="1-0-1">1-0-1 (Morn/Night)</option>
                    <option value="1-1-1">1-1-1 (TID)</option>
                    <option value="0-0-1">0-0-1 (Night)</option>
                    <option value="SOS">SOS (As needed)</option>
                  </select>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Duration"
                    value={med.duration}
                    onChange={(e) => handleMedicationChange(idx, 'duration', e.target.value)}
                  />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Instructions (After meals)"
                    value={med.instructions}
                    onChange={(e) => handleMedicationChange(idx, 'instructions', e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveMedicationRow(idx)}
                    className="btn btn-ghost btn-icon btn-sm"
                    disabled={formData.medications.length <= 1}
                    title="Remove item"
                  >
                    <Trash2 size={16} color="var(--color-danger)" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Advice & Lifestyle Notes */}
          <div className="form-group">
            <label className="form-label">Clinical Advice & Dietary Guidelines</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="e.g. Low sodium intake, plenty of water, schedule fasting blood test in 14 days..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
        </form>
      </Modal>

      {/* Printable Hospital Prescription Slip Modal */}
      {selectedRxForPrint && (
        <Modal
          isOpen={Boolean(selectedRxForPrint)}
          onClose={() => setSelectedRxForPrint(null)}
          title="Clinical Prescription Slip"
          size="lg"
          footer={
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <button onClick={() => setSelectedRxForPrint(null)} className="btn btn-secondary">
                Close
              </button>
              <button onClick={handlePrint} className="btn btn-primary">
                <Printer size={16} /> Print / Export PDF
              </button>
            </div>
          }
        >
          <div
            className="print-prescription-sheet"
            style={{
              backgroundColor: '#ffffff',
              color: '#0f172a',
              padding: '32px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
              fontFamily: 'var(--font-sans)'
            }}
          >
            {/* Hospital Letterhead Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderBottom: '2px solid #0284c7',
                paddingBottom: '16px',
                marginBottom: '20px'
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0284c7', letterSpacing: '-0.01em' }}>
                  {clinicSettings.clinicName}
                </h3>
                <div style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '2px' }}>
                  {clinicSettings.address}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Emergency Helpline: {clinicSettings.phone} &bull; Email: {clinicSettings.email}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>
                  {clinicSettings.doctorName}
                </div>
                <div style={{ fontSize: '0.8125rem', color: '#475569' }}>
                  {clinicSettings.doctorDesignation}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'monospace' }}>
                  Reg: {clinicSettings.registrationNumber}
                </div>
              </div>
            </div>

            {/* Patient Meta Details */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                backgroundColor: '#f8fafc',
                padding: '12px 16px',
                borderRadius: '6px',
                marginBottom: '20px',
                fontSize: '0.8125rem'
              }}
            >
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.6875rem', textTransform: 'uppercase' }}>Patient Name</span>
                <strong>{selectedRxForPrint.patientName}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.6875rem', textTransform: 'uppercase' }}>UHID</span>
                <strong style={{ fontFamily: 'monospace' }}>{selectedRxForPrint.patientId}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.6875rem', textTransform: 'uppercase' }}>Rx Slip #</span>
                <strong style={{ fontFamily: 'monospace' }}>#{selectedRxForPrint.id}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.6875rem', textTransform: 'uppercase' }}>Date</span>
                <strong>{selectedRxForPrint.date}</strong>
              </div>
            </div>

            {/* Clinical Diagnosis */}
            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Primary Diagnosis
              </span>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                {selectedRxForPrint.diagnosis}
              </div>
            </div>

            {/* Medical Rx Symbol */}
            <div style={{ fontSize: '1.75rem', fontWeight: 800, fontStyle: 'italic', color: '#0284c7', marginBottom: '8px' }}>
              Rx
            </div>

            {/* Medications Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #cbd5e1', textAlign: 'left', backgroundColor: '#f1f5f9' }}>
                  <th style={{ padding: '8px 12px' }}>#</th>
                  <th style={{ padding: '8px 12px' }}>Medicine Name</th>
                  <th style={{ padding: '8px 12px' }}>Dosage</th>
                  <th style={{ padding: '8px 12px' }}>Frequency</th>
                  <th style={{ padding: '8px 12px' }}>Duration</th>
                  <th style={{ padding: '8px 12px' }}>Instructions</th>
                </tr>
              </thead>
              <tbody>
                {selectedRxForPrint.medications.map((med, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 600 }}>{i + 1}</td>
                    <td style={{ padding: '10px 12px', fontWeight: 700, color: '#0f172a' }}>{med.name}</td>
                    <td style={{ padding: '10px 12px' }}>{med.dosage}</td>
                    <td style={{ padding: '10px 12px', fontWeight: 600 }}>{med.frequency}</td>
                    <td style={{ padding: '10px 12px' }}>{med.duration}</td>
                    <td style={{ padding: '10px 12px', color: '#475569' }}>{med.instructions}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Notes / Advice */}
            {selectedRxForPrint.notes && (
              <div style={{ marginBottom: '40px', backgroundColor: '#f8fafc', padding: '12px 16px', borderRadius: '6px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  Dietary & Clinical Advice
                </span>
                <p style={{ fontSize: '0.8125rem', color: '#334155', marginTop: '4px', lineHeight: 1.5 }}>
                  {selectedRxForPrint.notes}
                </p>
              </div>
            )}

            {/* Signature Block */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
              <div style={{ textAlign: 'center', width: '220px' }}>
                <div style={{ borderBottom: '1px solid #94a3b8', paddingBottom: '30px' }}></div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', marginTop: '8px', color: '#0f172a' }}>
                  {clinicSettings.doctorName}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Authorized Medical Practitioner Signature
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
