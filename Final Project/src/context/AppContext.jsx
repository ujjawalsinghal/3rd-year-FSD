import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialClinicSettings,
  initialPatients,
  initialAppointments,
  initialPrescriptions,
  initialVitals,
  initialInvoices,
  calculateVitalsRisk
} from '../data/initialData';

const AppContext = createContext();

function loadFromStorage(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    }
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
  }
  return fallback;
}

function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
}

export function AppProvider({ children }) {
  // Active View / Page routing
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  // Primary Clinical Datasets
  const [clinicSettings, setClinicSettings] = useState(() =>
    loadFromStorage('medipulse_settings', initialClinicSettings)
  );

  const [patients, setPatients] = useState(() =>
    loadFromStorage('medipulse_patients', initialPatients)
  );

  const [appointments, setAppointments] = useState(() =>
    loadFromStorage('medipulse_appointments', initialAppointments)
  );

  const [prescriptions, setPrescriptions] = useState(() =>
    loadFromStorage('medipulse_prescriptions', initialPrescriptions)
  );

  const [vitals, setVitals] = useState(() =>
    loadFromStorage('medipulse_vitals', initialVitals)
  );

  const [invoices, setInvoices] = useState(() =>
    loadFromStorage('medipulse_invoices', initialInvoices)
  );

  // Notifications / Toasts
  const [toasts, setToasts] = useState([]);

  // Auto-sync state to localStorage
  useEffect(() => { saveToStorage('medipulse_settings', clinicSettings); }, [clinicSettings]);
  useEffect(() => { saveToStorage('medipulse_patients', patients); }, [patients]);
  useEffect(() => { saveToStorage('medipulse_appointments', appointments); }, [appointments]);
  useEffect(() => { saveToStorage('medipulse_prescriptions', prescriptions); }, [prescriptions]);
  useEffect(() => { saveToStorage('medipulse_vitals', vitals); }, [vitals]);
  useEffect(() => { saveToStorage('medipulse_invoices', invoices); }, [invoices]);

  // Toast Dispatcher
  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // --- Patients CRUD ---
  const addPatient = (patientData) => {
    const newId = `PAT-${100 + patients.length + 1}`;
    const newPatient = {
      ...patientData,
      id: newId,
      status: patientData.status || 'Active',
      lastVisit: new Date().toISOString().split('T')[0]
    };
    setPatients(prev => [newPatient, ...prev]);
    showToast(`Patient ${newPatient.name} (${newId}) registered successfully!`);
    return newPatient;
  };

  const updatePatient = (id, updatedFields) => {
    setPatients(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updatedFields } : p))
    );
    showToast(`Patient record updated successfully.`);
  };

  const deletePatient = (id) => {
    const patientToDelete = patients.find(p => p.id === id);
    setPatients(prev => prev.filter(p => p.id !== id));
    // Also remove related appointments and vitals for clean cascade
    setAppointments(prev => prev.filter(a => a.patientId !== id));
    setVitals(prev => prev.filter(v => v.patientId !== id));
    setPrescriptions(prev => prev.filter(rx => rx.patientId !== id));
    showToast(`Patient ${patientToDelete?.name || id} and associated records removed.`, 'warning');
  };

  // --- Appointments Actions ---
  const addAppointment = (appointmentData) => {
    const newId = `APT-${200 + appointments.length + 1}`;
    const newAppointment = {
      ...appointmentData,
      id: newId,
      status: 'Scheduled'
    };
    setAppointments(prev => [newAppointment, ...prev]);
    showToast(`Appointment confirmed for ${newAppointment.patientName} at ${newAppointment.time}.`);
    return newAppointment;
  };

  const updateAppointmentStatus = (id, newStatus) => {
    setAppointments(prev =>
      prev.map(a => (a.id === id ? { ...a, status: newStatus } : a))
    );
    showToast(`Appointment status updated to "${newStatus}".`);
  };

  const deleteAppointment = (id) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
    showToast(`Appointment cancelled.`, 'info');
  };

  // --- Prescriptions Actions ---
  const addPrescription = (prescriptionData) => {
    const newId = `RX-${400 + prescriptions.length + 1}`;
    const newPrescription = {
      ...prescriptionData,
      id: newId,
      date: new Date().toISOString().split('T')[0],
      status: 'Active'
    };
    setPrescriptions(prev => [newPrescription, ...prev]);
    showToast(`Prescription #${newId} generated for ${newPrescription.patientName}.`);
    return newPrescription;
  };

  const deletePrescription = (id) => {
    setPrescriptions(prev => prev.filter(rx => rx.id !== id));
    showToast(`Prescription #${id} archived.`, 'info');
  };

  // --- Vitals Telemetry Actions ---
  const logVitals = (vitalsData) => {
    const newId = `VIT-${300 + vitals.length + 1}`;
    const risk = calculateVitalsRisk(
      vitalsData.systolic,
      vitalsData.diastolic,
      vitalsData.spO2,
      vitalsData.heartRate
    );
    const now = new Date();
    const timestamp = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newRecord = {
      ...vitalsData,
      id: newId,
      timestamp,
      riskLevel: risk
    };

    setVitals(prev => [newRecord, ...prev]);

    // Also update patient's last visit date and risk status
    setPatients(prev =>
      prev.map(p =>
        p.id === vitalsData.patientId
          ? {
              ...p,
              lastVisit: now.toISOString().split('T')[0],
              status: risk === 'Critical' ? 'Critical' : p.status
            }
          : p
      )
    );

    if (risk === 'Critical') {
      showToast(`CRITICAL ALERT: Abnormal vitals logged for ${newRecord.patientName}!`, 'error');
    } else {
      showToast(`Vitals logged for ${newRecord.patientName} (${risk} status).`);
    }

    return newRecord;
  };

  const deleteVitals = (id) => {
    setVitals(prev => prev.filter(v => v.id !== id));
    showToast(`Vitals entry removed.`, 'info');
  };

  // --- Billing Actions ---
  const addInvoice = (invoiceData) => {
    const newId = `INV-${500 + invoices.length + 1}`;
    const invoiceNumber = `MP-2026-${String(900 + invoices.length).padStart(4, '0')}`;
    const newInvoice = {
      ...invoiceData,
      id: newId,
      invoiceNumber,
      date: new Date().toISOString().split('T')[0],
      status: invoiceData.status || 'Pending'
    };
    setInvoices(prev => [newInvoice, ...prev]);
    showToast(`Invoice ${invoiceNumber} created successfully.`);
    return newInvoice;
  };

  const updateInvoiceStatus = (id, newStatus) => {
    setInvoices(prev =>
      prev.map(inv => (inv.id === id ? { ...inv, status: newStatus } : inv))
    );
    showToast(`Invoice status marked as ${newStatus}.`);
  };

  // --- Settings & Data Management ---
  const updateClinicSettings = (newSettings) => {
    setClinicSettings(newSettings);
    showToast(`Clinic settings saved successfully.`);
  };

  const resetToDefaultData = () => {
    setClinicSettings(initialClinicSettings);
    setPatients(initialPatients);
    setAppointments(initialAppointments);
    setPrescriptions(initialPrescriptions);
    setVitals(initialVitals);
    setInvoices(initialInvoices);
    localStorage.clear();
    showToast(`Demo dataset successfully restored to original factory state!`, 'info');
  };

  const exportDataJSON = () => {
    const fullBackup = {
      clinicSettings,
      patients,
      appointments,
      prescriptions,
      vitals,
      invoices,
      exportedAt: new Date().toISOString()
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `medipulse-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast(`Exported clinical database as JSON file.`);
  };

  const importDataJSON = (importedData) => {
    if (!importedData.patients || !importedData.appointments) {
      showToast(`Invalid backup file structure.`, 'error');
      return false;
    }
    if (importedData.clinicSettings) setClinicSettings(importedData.clinicSettings);
    if (importedData.patients) setPatients(importedData.patients);
    if (importedData.appointments) setAppointments(importedData.appointments);
    if (importedData.prescriptions) setPrescriptions(importedData.prescriptions);
    if (importedData.vitals) setVitals(importedData.vitals);
    if (importedData.invoices) setInvoices(importedData.invoices);
    showToast(`Database restored successfully from file backup!`, 'success');
    return true;
  };

  return (
    <AppContext.Provider
      value={{
        // Navigation & UI
        activeTab,
        setActiveTab,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        globalSearch,
        setGlobalSearch,
        toasts,
        showToast,
        removeToast,

        // Data Models
        clinicSettings,
        updateClinicSettings,
        patients,
        addPatient,
        updatePatient,
        deletePatient,
        appointments,
        addAppointment,
        updateAppointmentStatus,
        deleteAppointment,
        prescriptions,
        addPrescription,
        deletePrescription,
        vitals,
        logVitals,
        deleteVitals,
        invoices,
        addInvoice,
        updateInvoiceStatus,

        // Utilities
        resetToDefaultData,
        exportDataJSON,
        importDataJSON
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
