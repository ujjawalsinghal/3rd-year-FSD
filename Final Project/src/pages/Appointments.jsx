import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import EmptyState from '../components/common/EmptyState';
import {
  Calendar,
  Clock,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Stethoscope,
  XCircle,
  Video,
  User,
  Building2,
  Trash2
} from 'lucide-react';

export default function Appointments() {
  const {
    appointments,
    patients,
    addAppointment,
    updateAppointmentStatus,
    deleteAppointment,
    globalSearch,
    setGlobalSearch
  } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];

  // Filters
  const [tabFilter, setTabFilter] = useState('All'); // All | Today | Upcoming | Completed | Cancelled
  const [departmentFilter, setDepartmentFilter] = useState('All');

  // Modal states
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);

  // Form state
  const initialFormState = {
    patientId: '',
    doctor: 'Dr. Sarah Jenkins',
    department: 'Cardiology',
    date: todayStr,
    time: '10:00 AM',
    type: 'In-Person',
    triageLevel: 'Normal',
    reason: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});

  // Filtered Appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((a) => {
      const query = (globalSearch || '').toLowerCase();
      const matchesSearch =
        !query ||
        a.patientName.toLowerCase().includes(query) ||
        a.patientId.toLowerCase().includes(query) ||
        a.doctor.toLowerCase().includes(query) ||
        a.department.toLowerCase().includes(query);

      const matchesDept = departmentFilter === 'All' || a.department === departmentFilter;

      let matchesTab = true;
      if (tabFilter === 'Today') {
        matchesTab = a.date === todayStr;
      } else if (tabFilter === 'Upcoming') {
        matchesTab = a.date >= todayStr && a.status !== 'Completed' && a.status !== 'Cancelled';
      } else if (tabFilter === 'Completed') {
        matchesTab = a.status === 'Completed';
      } else if (tabFilter === 'Cancelled') {
        matchesTab = a.status === 'Cancelled';
      }

      return matchesSearch && matchesDept && matchesTab;
    });
  }, [appointments, globalSearch, departmentFilter, tabFilter, todayStr]);

  const validateForm = () => {
    const errors = {};
    if (!formData.patientId) errors.patientId = 'Please select a registered patient.';
    if (!formData.date) errors.date = 'Appointment date is required.';
    if (!formData.time) errors.time = 'Appointment time is required.';
    if (!formData.reason.trim()) errors.reason = 'Clinical reason for visit is required.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenBookModal = () => {
    setFormData({
      ...initialFormState,
      patientId: patients.length > 0 ? patients[0].id : ''
    });
    setFormErrors({});
    setIsBookModalOpen(true);
  };

  const handleSaveAppointment = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const selectedPatient = patients.find(p => p.id === formData.patientId);
    if (!selectedPatient) return;

    addAppointment({
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      doctor: formData.doctor,
      department: formData.department,
      date: formData.date,
      time: formData.time,
      type: formData.type,
      triageLevel: formData.triageLevel,
      reason: formData.reason.trim()
    });

    setIsBookModalOpen(false);
  };

  const getTriageBadge = (level) => {
    switch (level) {
      case 'Emergency':
        return <span className="badge badge-danger">Emergency</span>;
      case 'Urgent':
        return <span className="badge badge-warning">Urgent Care</span>;
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
            Outpatient Scheduling & Triage Manager
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Coordinate doctor consults, prioritize acute triage cases, and track live room status.
          </p>
        </div>

        <button onClick={handleOpenBookModal} className="btn btn-primary">
          <Plus size={16} />
          <span>Book Appointment</span>
        </button>
      </div>

      {/* Tabs and Controls */}
      <div className="card" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--bg-surface-hover)', padding: '4px', borderRadius: 'var(--radius-md)' }}>
            {['All', 'Today', 'Upcoming', 'Completed', 'Cancelled'].map((tab) => (
              <button
                key={tab}
                onClick={() => setTabFilter(tab)}
                style={{
                  padding: '6px 14px',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  backgroundColor: tabFilter === tab ? 'var(--bg-surface)' : 'transparent',
                  color: tabFilter === tab ? 'var(--color-primary)' : 'var(--text-secondary)',
                  boxShadow: tabFilter === tab ? 'var(--shadow-xs)' : 'none',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Department Filter & Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Dept:</span>
              <select
                className="form-control"
                style={{ width: 'auto', padding: '6px 10px', fontSize: '0.8125rem' }}
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                <option value="All">All Departments</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Neurology">Neurology</option>
                <option value="Pulmonology">Pulmonology</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="General Medicine">General Medicine</option>
                <option value="Endocrinology">Endocrinology</option>
              </select>
            </div>

            <div style={{ position: 'relative', width: '220px' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '32px', fontSize: '0.8125rem' }}
                placeholder="Search patient / doctor..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {filteredAppointments.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No appointments matching filter"
            description="There are no scheduled consultations under this tab."
            actionLabel="Schedule Appointment"
            onAction={handleOpenBookModal}
          />
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Schedule</th>
                  <th>Patient</th>
                  <th>Attending Physician</th>
                  <th>Triage Urgency</th>
                  <th>Reason for Visit</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((apt) => (
                  <tr key={apt.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                        {apt.date}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                        <Clock size={12} />
                        {apt.time} &bull; {apt.type}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                        {apt.patientName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {apt.patientId}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {apt.doctor}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {apt.department}
                      </div>
                    </td>

                    <td>{getTriageBadge(apt.triageLevel)}</td>

                    <td>
                      <span
                        style={{
                          fontSize: '0.8125rem',
                          color: 'var(--text-secondary)',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          maxWidth: '220px'
                        }}
                      >
                        {apt.reason}
                      </span>
                    </td>

                    <td>{getStatusBadge(apt.status)}</td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        {apt.status === 'Scheduled' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'Checked In')}
                            className="btn btn-outline btn-sm"
                            title="Check in patient at front desk"
                          >
                            Check In
                          </button>
                        )}

                        {apt.status === 'Checked In' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'In Consultation')}
                            className="btn btn-primary btn-sm"
                            title="Start consultation"
                          >
                            <Stethoscope size={13} /> Consult
                          </button>
                        )}

                        {apt.status === 'In Consultation' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'Completed')}
                            className="btn btn-secondary btn-sm"
                            style={{ color: 'var(--color-success)' }}
                            title="Mark consultation completed"
                          >
                            <CheckCircle2 size={13} /> Finish
                          </button>
                        )}

                        {apt.status !== 'Completed' && apt.status !== 'Cancelled' && (
                          <button
                            onClick={() => setAppointmentToCancel(apt)}
                            className="btn btn-ghost btn-icon btn-sm"
                            title="Cancel appointment"
                          >
                            <XCircle size={15} color="var(--color-danger)" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Book Appointment Modal */}
      <Modal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        title="Schedule Clinical Appointment"
        subtitle="Assign patient slot, clinical department, and triage urgency."
        size="md"
        footer={
          <>
            <button onClick={() => setIsBookModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={handleSaveAppointment} className="btn btn-primary">
              Confirm Booking
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveAppointment}>
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

          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label">Clinical Specialty</label>
              <select
                className="form-control"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              >
                <option value="Cardiology">Cardiology</option>
                <option value="Neurology">Neurology</option>
                <option value="Pulmonology">Pulmonology</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="General Medicine">General Medicine</option>
                <option value="Endocrinology">Endocrinology</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Attending Doctor</label>
              <select
                className="form-control"
                value={formData.doctor}
                onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
              >
                <option value="Dr. Sarah Jenkins">Dr. Sarah Jenkins (Cardio/Internal)</option>
                <option value="Dr. Gregory House">Dr. Gregory House (Neurology)</option>
                <option value="Dr. Lisa Cuddy">Dr. Lisa Cuddy (Pulmonology)</option>
                <option value="Dr. Robert Chase">Dr. Robert Chase (Orthopedics)</option>
                <option value="Dr. James Wilson">Dr. James Wilson (Oncology/Gastro)</option>
              </select>
            </div>
          </div>

          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label form-label-required">Appointment Date</label>
              <input
                type="date"
                className={`form-control ${formErrors.date ? 'is-invalid' : ''}`}
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
              {formErrors.date && <div className="form-error">{formErrors.date}</div>}
            </div>

            <div className="form-group">
              <label className="form-label form-label-required">Time Slot</label>
              <select
                className="form-control"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              >
                <option value="09:00 AM">09:00 AM</option>
                <option value="09:30 AM">09:30 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="10:30 AM">10:30 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="11:30 AM">11:30 AM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="02:30 PM">02:30 PM</option>
                <option value="03:00 PM">03:00 PM</option>
                <option value="03:30 PM">03:30 PM</option>
                <option value="04:00 PM">04:00 PM</option>
              </select>
            </div>
          </div>

          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label">Consultation Medium</label>
              <select
                className="form-control"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="In-Person">In-Person Outpatient</option>
                <option value="Telehealth">Telehealth Video Consult</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Triage Priority Level</label>
              <select
                className="form-control"
                value={formData.triageLevel}
                onChange={(e) => setFormData({ ...formData, triageLevel: e.target.value })}
              >
                <option value="Normal">Normal (Routine Follow-up)</option>
                <option value="Urgent">Urgent (Priority Care)</option>
                <option value="Emergency">Emergency (Immediate Intervention)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label form-label-required">Reason for Visit / Symptoms</label>
            <textarea
              className={`form-control ${formErrors.reason ? 'is-invalid' : ''}`}
              rows="3"
              placeholder="Primary symptoms, chief complaints, or purpose of visit..."
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            />
            {formErrors.reason && <div className="form-error">{formErrors.reason}</div>}
          </div>
        </form>
      </Modal>

      {/* Cancel Appointment Dialog */}
      <ConfirmDialog
        isOpen={Boolean(appointmentToCancel)}
        onClose={() => setAppointmentToCancel(null)}
        onConfirm={() => {
          if (appointmentToCancel) {
            updateAppointmentStatus(appointmentToCancel.id, 'Cancelled');
          }
        }}
        title="Cancel Appointment?"
        message={`Are you sure you want to cancel the appointment for ${appointmentToCancel?.patientName} on ${appointmentToCancel?.date} at ${appointmentToCancel?.time}?`}
        confirmLabel="Yes, Cancel Booking"
      />
    </div>
  );
}
