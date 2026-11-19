import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import PatientDetailsModal from './PatientDetailsModal';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import EmptyState from '../components/common/EmptyState';
import {
  Users,
  Search,
  Filter,
  Plus,
  Eye,
  Edit2,
  Trash2,
  Phone,
  Mail,
  Heart,
  AlertTriangle,
  ArrowUpDown,
  Activity
} from 'lucide-react';

export default function Patients() {
  const {
    patients,
    addPatient,
    updatePatient,
    deletePatient,
    globalSearch,
    setGlobalSearch,
    setActiveTab
  } = useApp();

  // Local Filter & Sort states
  const [bloodFilter, setBloodFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name'); // name | age | lastVisit
  const [sortOrder, setSortOrder] = useState('asc'); // asc | desc

  // Modal states
  const [selectedPatientForDetails, setSelectedPatientForDetails] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [patientToDelete, setPatientToDelete] = useState(null);

  // Form state
  const initialFormState = {
    name: '',
    age: '',
    gender: 'Female',
    bloodGroup: 'O+',
    phone: '',
    email: '',
    address: '',
    emergencyContact: '',
    chronicConditions: '',
    allergies: '',
    notes: '',
    status: 'Active'
  };

  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});

  // Filtered & Sorted Patients list
  const filteredPatients = useMemo(() => {
    return patients
      .filter((p) => {
        const query = (globalSearch || '').toLowerCase();
        const matchesSearch =
          !query ||
          p.name.toLowerCase().includes(query) ||
          p.id.toLowerCase().includes(query) ||
          p.phone.includes(query) ||
          (p.email && p.email.toLowerCase().includes(query)) ||
          (p.chronicConditions && p.chronicConditions.some(c => c.toLowerCase().includes(query)));

        const matchesBlood = bloodFilter === 'All' || p.bloodGroup === bloodFilter;
        const matchesStatus = statusFilter === 'All' || p.status === statusFilter;

        return matchesSearch && matchesBlood && matchesStatus;
      })
      .sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];

        if (sortBy === 'name') {
          return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        } else if (sortBy === 'age') {
          return sortOrder === 'asc' ? valA - valB : valB - valA;
        } else if (sortBy === 'lastVisit') {
          return sortOrder === 'asc'
            ? new Date(valA || 0) - new Date(valB || 0)
            : new Date(valB || 0) - new Date(valA || 0);
        }
        return 0;
      });
  }, [patients, globalSearch, bloodFilter, statusFilter, sortBy, sortOrder]);

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Patient full name is required.';
    if (!formData.age || Number(formData.age) <= 0 || Number(formData.age) > 130) {
      errors.age = 'Enter a valid age (1-130).';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Contact phone number is required.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenAdd = () => {
    setEditingPatient(null);
    setFormData(initialFormState);
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (patient) => {
    setEditingPatient(patient);
    setFormData({
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      bloodGroup: patient.bloodGroup,
      phone: patient.phone,
      email: patient.email || '',
      address: patient.address || '',
      emergencyContact: patient.emergencyContact || '',
      chronicConditions: (patient.chronicConditions || []).join(', '),
      allergies: (patient.allergies || []).join(', '),
      notes: patient.notes || '',
      status: patient.status || 'Active'
    });
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  const handleSavePatient = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const chronicConditionsArray = formData.chronicConditions
      ? formData.chronicConditions.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    const allergiesArray = formData.allergies
      ? formData.allergies.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    const patientPayload = {
      name: formData.name.trim(),
      age: Number(formData.age),
      gender: formData.gender,
      bloodGroup: formData.bloodGroup,
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      address: formData.address.trim(),
      emergencyContact: formData.emergencyContact.trim(),
      chronicConditions: chronicConditionsArray,
      allergies: allergiesArray,
      notes: formData.notes.trim(),
      status: formData.status
    };

    if (editingPatient) {
      updatePatient(editingPatient.id, patientPayload);
    } else {
      addPatient(patientPayload);
    }

    setIsAddModalOpen(false);
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
            Patient Electronic Health Records (EHR)
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Directory of clinical patients, medical histories, telemetry tracking, and dossiers.
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={16} />
          <span>Register New Patient</span>
        </button>
      </div>

      {/* Filter and Control Bar */}
      <div className="card" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          {/* Search Box */}
          <div style={{ flex: 1, minWidth: '220px', maxWidth: '360px', position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '36px' }}
              placeholder="Search by name, UHID, condition..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Blood:</span>
              <select
                className="form-control"
                style={{ width: 'auto', padding: '6px 10px', fontSize: '0.8125rem' }}
                value={bloodFilter}
                onChange={(e) => setBloodFilter(e.target.value)}
              >
                <option value="All">All Groups</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Status:</span>
              <select
                className="form-control"
                style={{ width: 'auto', padding: '6px 10px', fontSize: '0.8125rem' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Critical">Critical</option>
                <option value="Stable">Stable</option>
                <option value="Discharged">Discharged</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Sort:</span>
              <select
                className="form-control"
                style={{ width: 'auto', padding: '6px 10px', fontSize: '0.8125rem' }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Patient Name</option>
                <option value="age">Age</option>
                <option value="lastVisit">Last Visit Date</option>
              </select>
              <button
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="btn btn-secondary btn-icon btn-sm"
                title={`Order: ${sortOrder.toUpperCase()}`}
              >
                <ArrowUpDown size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Patient Directory Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {filteredPatients.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No matching patients found"
            description="Try clearing your search query or registering a new patient record."
            actionLabel="Register New Patient"
            onAction={handleOpenAdd}
          />
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Patient Profile</th>
                  <th>Demographics</th>
                  <th>Blood Group</th>
                  <th>Chronic Conditions</th>
                  <th>Status</th>
                  <th>Last Visit</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--color-primary-light)',
                            color: 'var(--color-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.875rem'
                          }}
                        >
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                            {p.name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                            {p.id} &bull; {p.phone}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>
                        {p.age} yrs &bull; {p.gender}
                      </span>
                    </td>

                    <td>
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: '0.8125rem',
                          color: 'var(--color-danger)',
                          backgroundColor: 'var(--color-danger-light)',
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-sm)'
                        }}
                      >
                        {p.bloodGroup}
                      </span>
                    </td>

                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '200px' }}>
                        {p.chronicConditions && p.chronicConditions.length > 0 ? (
                          p.chronicConditions.slice(0, 2).map((c, idx) => (
                            <span key={idx} className="badge badge-warning" style={{ fontSize: '0.6875rem' }}>
                              {c}
                            </span>
                          ))
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>None</span>
                        )}
                        {p.chronicConditions && p.chronicConditions.length > 2 && (
                          <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                            +{p.chronicConditions.length - 2}
                          </span>
                        )}
                      </div>
                    </td>

                    <td>
                      <span className={`badge ${p.status === 'Critical' ? 'badge-danger' : p.status === 'Active' ? 'badge-success' : 'badge-neutral'}`}>
                        {p.status}
                      </span>
                    </td>

                    <td>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                        {p.lastVisit || 'N/A'}
                      </span>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          onClick={() => setSelectedPatientForDetails(p)}
                          className="btn btn-ghost btn-icon btn-sm"
                          title="View Complete EHR Dossier"
                        >
                          <Eye size={15} color="var(--color-primary)" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="btn btn-ghost btn-icon btn-sm"
                          title="Edit Patient"
                        >
                          <Edit2 size={15} color="var(--text-secondary)" />
                        </button>
                        <button
                          onClick={() => setPatientToDelete(p)}
                          className="btn btn-ghost btn-icon btn-sm"
                          title="Delete Patient Record"
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

      {/* Patient EHR Dossier Modal */}
      {selectedPatientForDetails && (
        <PatientDetailsModal
          patient={selectedPatientForDetails}
          isOpen={Boolean(selectedPatientForDetails)}
          onClose={() => setSelectedPatientForDetails(null)}
        />
      )}

      {/* Add / Edit Patient Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={editingPatient ? `Edit Patient: ${editingPatient.name}` : "Register New Clinical Patient"}
        subtitle="Ensure accurate patient demographics and medical baseline information."
        size="lg"
        footer={
          <>
            <button onClick={() => setIsAddModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={handleSavePatient} className="btn btn-primary">
              {editingPatient ? "Save Changes" : "Register Patient"}
            </button>
          </>
        }
      >
        <form onSubmit={handleSavePatient}>
          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label form-label-required">Full Name</label>
              <input
                type="text"
                className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
                placeholder="e.g. Eleanor Vance"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              {formErrors.name && <div className="form-error">{formErrors.name}</div>}
            </div>

            <div className="form-group">
              <label className="form-label form-label-required">Age</label>
              <input
                type="number"
                className={`form-control ${formErrors.age ? 'is-invalid' : ''}`}
                placeholder="e.g. 48"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              />
              {formErrors.age && <div className="form-error">{formErrors.age}</div>}
            </div>
          </div>

          <div className="grid-cols-3">
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select
                className="form-control"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Blood Group</label>
              <select
                className="form-control"
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-control"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Active">Active</option>
                <option value="Critical">Critical</option>
                <option value="Stable">Stable</option>
                <option value="Discharged">Discharged</option>
              </select>
            </div>
          </div>

          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label form-label-required">Phone Number</label>
              <input
                type="text"
                className={`form-control ${formErrors.phone ? 'is-invalid' : ''}`}
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              {formErrors.phone && <div className="form-error">{formErrors.phone}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="patient@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Residential Address</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. 742 Evergreen Terrace, Springfield"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Emergency Contact Info</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Arthur Vance (Spouse) - +1 (555) 234-9901"
              value={formData.emergencyContact}
              onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
            />
          </div>

          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label">Chronic Conditions (Comma separated)</label>
              <input
                type="text"
                className="form-control"
                placeholder="Hypertension, Type 2 Diabetes"
                value={formData.chronicConditions}
                onChange={(e) => setFormData({ ...formData, chronicConditions: e.target.value })}
              />
              <span className="form-help">Separate multiple conditions with commas.</span>
            </div>

            <div className="form-group">
              <label className="form-label">Known Allergies (Comma separated)</label>
              <input
                type="text"
                className="form-control"
                placeholder="Penicillin, Sulfa Drugs, Aspirin"
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
              />
              <span className="form-help">Highlight critical drug allergies.</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Attending Doctor Clinical Notes</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Initial diagnostic observations, risk factors, or instructions..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
        </form>
      </Modal>

      {/* Delete Patient Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(patientToDelete)}
        onClose={() => setPatientToDelete(null)}
        onConfirm={() => {
          if (patientToDelete) {
            deletePatient(patientToDelete.id);
          }
        }}
        title="Delete Patient Record?"
        message={`Are you sure you want to permanently delete patient ${patientToDelete?.name} (${patientToDelete?.id})? This will also remove associated appointments and vitals history.`}
        confirmLabel="Yes, Delete Record"
      />
    </div>
  );
}
