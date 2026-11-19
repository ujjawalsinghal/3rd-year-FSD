import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';
import confetti from 'canvas-confetti';
import {
  CreditCard,
  Plus,
  Search,
  Printer,
  CheckCircle2,
  Clock,
  DollarSign,
  Receipt,
  Trash2,
  Building2,
  FileSpreadsheet
} from 'lucide-react';

export default function Billing() {
  const {
    invoices,
    patients,
    clinicSettings,
    addInvoice,
    updateInvoiceStatus,
    globalSearch,
    setGlobalSearch
  } = useApp();

  const [statusFilter, setStatusFilter] = useState('All'); // All | Paid | Pending | Refunded
  const [methodFilter, setMethodFilter] = useState('All');

  // Modal states
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedInvoiceForSlip, setSelectedInvoiceForSlip] = useState(null);

  // Form State
  const initialFormState = {
    patientId: '',
    items: [
      { name: 'Standard Specialist Outpatient Consultation', cost: 120 }
    ],
    discount: 0,
    paymentMethod: 'Card',
    status: 'Paid'
  };

  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});

  // Dynamic calculations
  const totalRevenue = invoices
    .filter(i => i.status === 'Paid')
    .reduce((sum, i) => sum + (i.total || 0), 0);

  const pendingAmount = invoices
    .filter(i => i.status === 'Pending')
    .reduce((sum, i) => sum + (i.total || 0), 0);

  // Filtered Invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const query = (globalSearch || '').toLowerCase();
      const matchesSearch =
        !query ||
        inv.patientName.toLowerCase().includes(query) ||
        inv.invoiceNumber.toLowerCase().includes(query) ||
        inv.patientId.toLowerCase().includes(query);

      const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
      const matchesMethod = methodFilter === 'All' || inv.paymentMethod === methodFilter;

      return matchesSearch && matchesStatus && matchesMethod;
    });
  }, [invoices, globalSearch, statusFilter, methodFilter]);

  const handleOpenNewInvoice = () => {
    setFormData({
      ...initialFormState,
      patientId: patients.length > 0 ? patients[0].id : ''
    });
    setFormErrors({});
    setIsInvoiceModalOpen(true);
  };

  const handleAddServiceItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { name: '', cost: 50 }]
    }));
  };

  const handleRemoveServiceItem = (index) => {
    if (formData.items.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, idx) => idx !== index)
    }));
  };

  const handleServiceChange = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.items];
      updated[index] = { ...updated[index], [field]: field === 'cost' ? Number(value) : value };
      return { ...prev, items: updated };
    });
  };

  const subtotal = formData.items.reduce((sum, item) => sum + (Number(item.cost) || 0), 0);
  const totalCalculated = Math.max(0, subtotal - (Number(formData.discount) || 0));

  const validateForm = () => {
    const errors = {};
    if (!formData.patientId) errors.patientId = 'Please select a patient.';
    const invalidItems = formData.items.some(i => !i.name.trim() || Number(i.cost) <= 0);
    if (invalidItems) errors.items = 'Please provide a valid service description and positive cost.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveInvoice = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const patient = patients.find(p => p.id === formData.patientId);
    if (!patient) return;

    addInvoice({
      patientId: patient.id,
      patientName: patient.name,
      items: formData.items,
      subtotal,
      discount: Number(formData.discount) || 0,
      total: totalCalculated,
      paymentMethod: formData.paymentMethod,
      status: formData.status
    });

    if (formData.status === 'Paid') {
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }

    setIsInvoiceModalOpen(false);
  };

  const handleMarkAsPaid = (inv) => {
    updateInvoiceStatus(inv.id, 'Paid');
    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {}
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
            Billing, Invoices & Clinical Revenue
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Manage outpatient procedure billings, insurance claims, and print detailed payment receipts.
          </p>
        </div>

        <button onClick={handleOpenNewInvoice} className="btn btn-primary">
          <Plus size={16} />
          <span>Generate Invoice</span>
        </button>
      </div>

      {/* Financial Summary KPIs */}
      <div className="grid-cols-3">
        <div className="card" style={{ borderLeft: '4px solid var(--color-success)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-success)', textTransform: 'uppercase' }}>
                Total Processed Revenue
              </span>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                {clinicSettings.currency}{totalRevenue.toLocaleString()}
              </div>
            </div>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-success-light)',
                color: 'var(--color-success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <DollarSign size={22} />
            </div>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', display: 'block' }}>
            Collected via Card, Insurance & UPI
          </span>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--color-warning)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-warning-dark)', textTransform: 'uppercase' }}>
                Outstanding Receivables
              </span>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                {clinicSettings.currency}{pendingAmount.toLocaleString()}
              </div>
            </div>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-warning-light)',
                color: 'var(--color-warning)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Clock size={22} />
            </div>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', display: 'block' }}>
            Awaiting claim clearance or settlement
          </span>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--color-primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                Invoices Processed
              </span>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                {invoices.length}
              </div>
            </div>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Receipt size={22} />
            </div>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', display: 'block' }}>
            Historical billing ledger records
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Status:</span>
              <select
                className="form-control"
                style={{ width: 'auto', padding: '6px 10px', fontSize: '0.8125rem' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Invoices</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Method:</span>
              <select
                className="form-control"
                style={{ width: 'auto', padding: '6px 10px', fontSize: '0.8125rem' }}
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
              >
                <option value="All">All Methods</option>
                <option value="Card">Credit/Debit Card</option>
                <option value="Insurance">Health Insurance</option>
                <option value="UPI">UPI Digital</option>
                <option value="Cash">Cash</option>
              </select>
            </div>
          </div>

          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '32px', fontSize: '0.8125rem' }}
              placeholder="Search invoice # or patient..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {filteredInvoices.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title="No billing records found"
            description="Generate a billing invoice for clinical services rendered."
            actionLabel="Generate Invoice"
            onAction={handleOpenNewInvoice}
          />
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Invoice ID & Date</th>
                  <th>Patient</th>
                  <th>Services Breakdown</th>
                  <th>Method</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                        {inv.invoiceNumber}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {inv.date}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                        {inv.patientName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {inv.patientId}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', maxWidth: '240px' }}>
                        {inv.items.map(item => item.name).join(', ')}
                      </div>
                    </td>

                    <td>
                      <span className="badge badge-neutral">{inv.paymentMethod}</span>
                    </td>

                    <td>
                      <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.9375rem' }}>
                        {clinicSettings.currency}{inv.total}
                      </div>
                      {inv.discount > 0 && (
                        <div style={{ fontSize: '0.6875rem', color: 'var(--color-success)', fontWeight: 600 }}>
                          Discount: {clinicSettings.currency}{inv.discount}
                        </div>
                      )}
                    </td>

                    <td>
                      <span className={`badge ${inv.status === 'Paid' ? 'badge-success' : inv.status === 'Pending' ? 'badge-warning' : 'badge-neutral'}`}>
                        {inv.status}
                      </span>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        {inv.status === 'Pending' && (
                          <button
                            onClick={() => handleMarkAsPaid(inv)}
                            className="btn btn-primary btn-sm"
                            title="Collect & Mark as Paid"
                          >
                            <CheckCircle2 size={13} /> Settle
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedInvoiceForSlip(inv)}
                          className="btn btn-outline btn-sm"
                          title="View and Print Official Billing Receipt"
                        >
                          <Printer size={13} /> Receipt
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

      {/* Generate Invoice Modal */}
      <Modal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        title="Generate Clinical Bill & Invoice"
        subtitle="Itemize consultations, diagnostic imaging, and laboratory fees."
        size="md"
        footer={
          <>
            <button onClick={() => setIsInvoiceModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={handleSaveInvoice} className="btn btn-primary">
              Generate & Save Invoice
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveInvoice}>
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
                  {p.name} ({p.id})
                </option>
              ))}
            </select>
            {formErrors.patientId && <div className="form-error">{formErrors.patientId}</div>}
          </div>

          {/* Itemized Services */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span className="form-label form-label-required" style={{ margin: 0 }}>
                Services & Procedures
              </span>
              <button
                type="button"
                onClick={handleAddServiceItem}
                className="btn btn-secondary btn-sm"
              >
                <Plus size={13} /> Add Line Item
              </button>
            </div>

            {formErrors.items && (
              <div className="form-error" style={{ marginBottom: '8px' }}>
                {formErrors.items}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {formData.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Procedure / Consultation description"
                    style={{ flex: 3 }}
                    value={item.name}
                    onChange={(e) => handleServiceChange(idx, 'name', e.target.value)}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{clinicSettings.currency}</span>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Cost"
                      value={item.cost}
                      onChange={(e) => handleServiceChange(idx, 'cost', e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveServiceItem(idx)}
                    className="btn btn-ghost btn-icon btn-sm"
                    disabled={formData.items.length <= 1}
                  >
                    <Trash2 size={15} color="var(--color-danger)" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label">Discount ({clinicSettings.currency})</label>
              <input
                type="number"
                className="form-control"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Payment Mode</label>
              <select
                className="form-control"
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              >
                <option value="Card">Credit / Debit Card</option>
                <option value="Insurance">Health Insurance</option>
                <option value="UPI">UPI Digital Payment</option>
                <option value="Cash">Cash Payment</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Payment Settlement Status</label>
            <select
              className="form-control"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="Paid">Paid / Settled</option>
              <option value="Pending">Pending / Claim Submitted</option>
            </select>
          </div>

          {/* Total Breakdown Box */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface-hover)',
              padding: '14px 18px',
              borderRadius: 'var(--radius-md)',
              marginTop: '16px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '4px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Gross Subtotal:</span>
              <span>{clinicSettings.currency}{subtotal}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Applied Discount:</span>
              <span style={{ color: 'var(--color-danger)' }}>-{clinicSettings.currency}{Number(formData.discount) || 0}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 800, borderTop: '1px solid var(--border-light)', paddingTop: '6px' }}>
              <span>Total Payable:</span>
              <span style={{ color: 'var(--color-primary)' }}>{clinicSettings.currency}{totalCalculated}</span>
            </div>
          </div>
        </form>
      </Modal>

      {/* Printable Invoice Receipt Slip Modal */}
      {selectedInvoiceForSlip && (
        <Modal
          isOpen={Boolean(selectedInvoiceForSlip)}
          onClose={() => setSelectedInvoiceForSlip(null)}
          title="Clinical Billing Receipt"
          size="md"
          footer={
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <button onClick={() => setSelectedInvoiceForSlip(null)} className="btn btn-secondary">
                Close
              </button>
              <button onClick={handlePrint} className="btn btn-primary">
                <Printer size={16} /> Print Receipt
              </button>
            </div>
          }
        >
          <div
            className="print-prescription-sheet"
            style={{
              backgroundColor: '#ffffff',
              color: '#0f172a',
              padding: '28px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)'
            }}
          >
            <div style={{ textAlign: 'center', borderBottom: '2px solid #e2e8f0', paddingBottom: '16px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0284c7' }}>
                {clinicSettings.clinicName}
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                {clinicSettings.address} &bull; {clinicSettings.phone}
              </p>
              <div style={{ fontSize: '0.6875rem', color: '#94a3b8', fontFamily: 'monospace', marginTop: '2px' }}>
                Registration ID: {clinicSettings.registrationNumber}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '16px' }}>
              <div>
                <span style={{ color: '#64748b', display: 'block' }}>Billed To:</span>
                <strong style={{ fontSize: '0.9375rem' }}>{selectedInvoiceForSlip.patientName}</strong>
                <div style={{ color: '#64748b', fontFamily: 'monospace' }}>{selectedInvoiceForSlip.patientId}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ color: '#64748b', display: 'block' }}>Receipt Details:</span>
                <strong>{selectedInvoiceForSlip.invoiceNumber}</strong>
                <div style={{ color: '#64748b' }}>{selectedInvoiceForSlip.date}</div>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px', fontSize: '0.8125rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #cbd5e1', backgroundColor: '#f8fafc', textAlign: 'left' }}>
                  <th style={{ padding: '8px' }}>Service / Procedure</th>
                  <th style={{ padding: '8px', textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {selectedInvoiceForSlip.items.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '8px' }}>{item.name}</td>
                    <td style={{ padding: '8px', textAlign: 'right', fontWeight: 600 }}>
                      {clinicSettings.currency}{item.cost}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ borderTop: '2px solid #0f172a', paddingTop: '10px', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>Subtotal:</span>
                <span>{clinicSettings.currency}{selectedInvoiceForSlip.subtotal || selectedInvoiceForSlip.total}</span>
              </div>
              {selectedInvoiceForSlip.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', color: '#16a34a' }}>
                  <span>Discount:</span>
                  <span>-{clinicSettings.currency}{selectedInvoiceForSlip.discount}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.125rem', marginTop: '6px' }}>
                <span>Net Amount Paid:</span>
                <span style={{ color: '#0284c7' }}>{clinicSettings.currency}{selectedInvoiceForSlip.total}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginTop: '6px' }}>
                <span>Payment Method: {selectedInvoiceForSlip.paymentMethod}</span>
                <span style={{ fontWeight: 700, color: '#16a34a' }}>STATUS: {selectedInvoiceForSlip.status.toUpperCase()}</span>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '30px', fontSize: '0.75rem', color: '#94a3b8' }}>
              Thank you for trusting {clinicSettings.clinicName}. Wishing you speedy recovery!
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
