// ===================================================================
// MediPulse 360 - Initial Clinical Seed Dataset
// Comprehensive real-world medical data for college demonstration
// ===================================================================

export const initialClinicSettings = {
  clinicName: "MediPulse 360 Multispecialty Center",
  doctorName: "Dr. Sarah Jenkins, MD, FACP",
  doctorDesignation: "Chief Medical Officer & Senior Internist",
  registrationNumber: "MCI-DL-2018-84920",
  address: "Building 4, Metro Health Corridor, Tech Park East",
  phone: "+1 (800) 555-0199",
  email: "care@medipulse360.org",
  currency: "$",
  defaultTriageThreshold: "Standard"
};

export const initialPatients = [
  {
    id: "PAT-101",
    name: "Eleanor Vance",
    age: 48,
    gender: "Female",
    bloodGroup: "O+",
    phone: "+1 (555) 234-5678",
    email: "eleanor.vance@example.com",
    address: "742 Evergreen Terrace, Springfield",
    emergencyContact: "Arthur Vance (Spouse) - +1 (555) 234-9901",
    chronicConditions: ["Hypertension", "Type 2 Diabetes"],
    allergies: ["Penicillin", "Sulfa Drugs"],
    status: "Active",
    lastVisit: "2026-11-18",
    notes: "Requires regular monitoring of blood glucose and renal panel. Patient compliant with medication."
  },
  {
    id: "PAT-102",
    name: "Marcus Aurelius Thorne",
    age: 62,
    gender: "Male",
    bloodGroup: "A+",
    phone: "+1 (555) 345-6789",
    email: "marcus.thorne@example.com",
    address: "12 Imperial Way, New York",
    emergencyContact: "Julia Thorne (Daughter) - +1 (555) 345-1122",
    chronicConditions: ["Coronary Artery Disease", "Hyperlipidemia"],
    allergies: ["Aspirin", "NSAIDs"],
    status: "Critical",
    lastVisit: "2026-11-19",
    notes: "Post-angioplasty checkup pending. Urgent attention needed for high systolic blood pressure."
  },
  {
    id: "PAT-103",
    name: "Sophia Rodriguez",
    age: 29,
    gender: "Female",
    bloodGroup: "B-",
    phone: "+1 (555) 456-7890",
    email: "sophia.rodriguez@example.com",
    address: "88 Sunburst Blvd, Miami",
    emergencyContact: "Carlos Rodriguez (Brother) - +1 (555) 456-3344",
    chronicConditions: ["Asthma"],
    allergies: ["Dust Mites", "Shellfish"],
    status: "Active",
    lastVisit: "2026-11-15",
    notes: "Seasonal asthma exacerbations during winter. Prescribed maintenance inhaler."
  },
  {
    id: "PAT-104",
    name: "Dr. Julian Hayes",
    age: 54,
    gender: "Male",
    bloodGroup: "AB+",
    phone: "+1 (555) 567-8901",
    email: "julian.hayes@example.com",
    address: "310 University Crescent, Boston",
    emergencyContact: "Laura Hayes (Wife) - +1 (555) 567-4455",
    chronicConditions: ["Osteoarthritis"],
    allergies: ["None Reported"],
    status: "Stable",
    lastVisit: "2026-11-12",
    notes: "Right knee arthropathy. Responsive to physical therapy and chondroitin."
  },
  {
    id: "PAT-105",
    name: "Aria Montgomery",
    age: 34,
    gender: "Female",
    bloodGroup: "A-",
    phone: "+1 (555) 678-9012",
    email: "aria.mont@example.com",
    address: "19 Rosewood Lane, Philadelphia",
    emergencyContact: "Ella Montgomery (Mother) - +1 (555) 678-5566",
    chronicConditions: ["Migraine with Aura"],
    allergies: ["Ibuprofen"],
    status: "Active",
    lastVisit: "2026-11-17",
    notes: "Frequent vascular headaches triggered by stress. Responsive to Sumatriptan."
  },
  {
    id: "PAT-106",
    name: "Devon Clark",
    age: 41,
    gender: "Male",
    bloodGroup: "O-",
    phone: "+1 (555) 789-0123",
    email: "devon.clark@example.com",
    address: "404 North Ridge, Denver",
    emergencyContact: "Sarah Clark (Sister) - +1 (555) 789-6677",
    chronicConditions: ["Gastroesophageal Reflux Disease (GERD)"],
    allergies: ["Codeine"],
    status: "Stable",
    lastVisit: "2026-11-10",
    notes: "Endoscopy scheduled next quarter. Advised dietary modifications."
  },
  {
    id: "PAT-107",
    name: "Hanna Marin",
    age: 27,
    gender: "Female",
    bloodGroup: "B+",
    phone: "+1 (555) 890-1234",
    email: "hanna.marin@example.com",
    address: "15 Park Central, Chicago",
    emergencyContact: "Ashley Marin (Mother) - +1 (555) 890-7788",
    chronicConditions: ["Hypothyroidism"],
    allergies: ["Latex"],
    status: "Active",
    lastVisit: "2026-11-14",
    notes: "Thyroid profile stabilized on Levothyroxine 50 mcg."
  },
  {
    id: "PAT-108",
    name: "Victor Stone",
    age: 38,
    gender: "Male",
    bloodGroup: "O+",
    phone: "+1 (555) 901-2345",
    email: "victor.stone@example.com",
    address: "500 Cyber Way, Austin",
    emergencyContact: "Silas Stone (Father) - +1 (555) 901-8899",
    chronicConditions: ["Lumbar Spondylosis"],
    allergies: ["Amoxicillin"],
    status: "Discharged",
    lastVisit: "2026-11-05",
    notes: "Rehabilitation completed after back injury. Follow-up SOS."
  }
];

export const initialAppointments = [
  {
    id: "APT-201",
    patientId: "PAT-102",
    patientName: "Marcus Aurelius Thorne",
    doctor: "Dr. Sarah Jenkins",
    department: "Cardiology",
    date: "2026-11-19",
    time: "09:30 AM",
    type: "In-Person",
    triageLevel: "Emergency", // Emergency | Urgent | Normal
    status: "In Consultation", // Scheduled | Checked In | In Consultation | Completed | Cancelled
    reason: "Elevated BP (175/105) and chest tightness post-exercise"
  },
  {
    id: "APT-202",
    patientId: "PAT-101",
    patientName: "Eleanor Vance",
    doctor: "Dr. Sarah Jenkins",
    department: "General Medicine",
    date: "2026-11-19",
    time: "10:15 AM",
    type: "In-Person",
    triageLevel: "Urgent",
    status: "Checked In",
    reason: "Routine quarterly diabetic review and HbA1c lab evaluation"
  },
  {
    id: "APT-203",
    patientId: "PAT-105",
    patientName: "Aria Montgomery",
    doctor: "Dr. Gregory House",
    department: "Neurology",
    date: "2026-11-19",
    time: "11:00 AM",
    type: "Telehealth",
    triageLevel: "Normal",
    status: "Scheduled",
    reason: "Aura migraine frequency tracking and prescription refill"
  },
  {
    id: "APT-204",
    patientId: "PAT-103",
    patientName: "Sophia Rodriguez",
    doctor: "Dr. Lisa Cuddy",
    department: "Pulmonology",
    date: "2026-11-19",
    time: "02:00 PM",
    type: "In-Person",
    triageLevel: "Urgent",
    status: "Scheduled",
    reason: "Wheezing during humid weather; spirometry review"
  },
  {
    id: "APT-205",
    patientId: "PAT-104",
    patientName: "Dr. Julian Hayes",
    doctor: "Dr. Robert Chase",
    department: "Orthopedics",
    date: "2026-11-19",
    time: "03:30 PM",
    type: "In-Person",
    triageLevel: "Normal",
    status: "Scheduled",
    reason: "Knee joint steroid injection assessment"
  },
  {
    id: "APT-206",
    patientId: "PAT-107",
    patientName: "Hanna Marin",
    doctor: "Dr. Sarah Jenkins",
    department: "Endocrinology",
    date: "2026-11-20",
    time: "09:00 AM",
    type: "In-Person",
    triageLevel: "Normal",
    status: "Scheduled",
    reason: "TSH level titration and thyroid ultrasound follow-up"
  },
  {
    id: "APT-207",
    patientId: "PAT-106",
    patientName: "Devon Clark",
    doctor: "Dr. James Wilson",
    department: "Gastroenterology",
    date: "2026-11-20",
    time: "11:30 AM",
    type: "Telehealth",
    triageLevel: "Normal",
    status: "Scheduled",
    reason: "Acid reflux symptom log check & PPI adjustment"
  },
  {
    id: "APT-208",
    patientId: "PAT-108",
    patientName: "Victor Stone",
    doctor: "Dr. Robert Chase",
    department: "Orthopedics",
    date: "2026-11-18",
    time: "04:00 PM",
    type: "In-Person",
    triageLevel: "Normal",
    status: "Completed",
    reason: "Final physical mobility discharge clearance"
  }
];

export const initialPrescriptions = [
  {
    id: "RX-401",
    patientId: "PAT-101",
    patientName: "Eleanor Vance",
    doctor: "Dr. Sarah Jenkins",
    date: "2026-11-18",
    diagnosis: "Essential Hypertension & Non-Insulin Dependent Diabetes Mellitus",
    medications: [
      { name: "Metformin ER", dosage: "500 mg", frequency: "1-0-1", duration: "30 Days", instructions: "Take with or right after meals" },
      { name: "Telmisartan", dosage: "40 mg", frequency: "1-0-0", duration: "30 Days", instructions: "Take early morning on empty stomach" },
      { name: "Atorvastatin", dosage: "10 mg", frequency: "0-0-1", duration: "30 Days", instructions: "Take at bedtime" }
    ],
    notes: "Maintain low sodium diet (<2g/day). Schedule fasting glucose blood draw next month.",
    status: "Active"
  },
  {
    id: "RX-402",
    patientId: "PAT-102",
    patientName: "Marcus Aurelius Thorne",
    doctor: "Dr. Sarah Jenkins",
    date: "2026-11-19",
    diagnosis: "Stage 2 Hypertension with Angina Pectoris",
    medications: [
      { name: "Amlodipine", dosage: "5 mg", frequency: "1-0-0", duration: "15 Days", instructions: "Monitor ankle swelling" },
      { name: "Metoprolol Succinate", dosage: "25 mg", frequency: "1-0-1", duration: "30 Days", instructions: "Do not stop abruptly" },
      { name: "Nitroglycerin SL", dosage: "0.4 mg", frequency: "SOS", duration: "As Needed", instructions: "Place under tongue if acute chest pain occurs" }
    ],
    notes: "Patient advised complete bed rest today. Cardiac telemetry admission recommended if symptoms persist.",
    status: "Active"
  },
  {
    id: "RX-403",
    patientId: "PAT-103",
    patientName: "Sophia Rodriguez",
    doctor: "Dr. Lisa Cuddy",
    date: "2026-11-15",
    diagnosis: "Moderate Persistent Bronchial Asthma",
    medications: [
      { name: "Budesonide / Formoterol Inhaler", dosage: "200/6 mcg", frequency: "2 Puffs BD", duration: "60 Days", instructions: "Rinse mouth thoroughly with water after inhalation" },
      { name: "Montelukast", dosage: "10 mg", frequency: "0-0-1", duration: "30 Days", instructions: "Take in the evening" }
    ],
    notes: "Carry rescue inhaler at all times. Avoid sudden exposure to cold air.",
    status: "Active"
  },
  {
    id: "RX-404",
    patientId: "PAT-105",
    patientName: "Aria Montgomery",
    doctor: "Dr. Gregory House",
    date: "2026-11-17",
    diagnosis: "Neurological Migraine with Visual Aura",
    medications: [
      { name: "Sumatriptan", dosage: "50 mg", frequency: "SOS", duration: "6 Doses", instructions: "Take at first onset of aura or headache" },
      { name: "Propranolol", dosage: "40 mg", frequency: "1-0-1", duration: "30 Days", instructions: "Prophylactic therapy for frequency reduction" }
    ],
    notes: "Keep migraine diary recording triggers, sleep patterns, and headache duration.",
    status: "Active"
  }
];

export const initialVitals = [
  {
    id: "VIT-301",
    patientId: "PAT-102",
    patientName: "Marcus Aurelius Thorne",
    timestamp: "2026-11-19 09:35",
    systolic: 175,
    diastolic: 105,
    heartRate: 98,
    spO2: 95,
    temperature: 98.6,
    bloodSugar: 142,
    riskLevel: "Critical", // Critical | Warning | Normal
    notes: "Patient reports retrosternal tightness. BP critically high."
  },
  {
    id: "VIT-302",
    patientId: "PAT-101",
    patientName: "Eleanor Vance",
    timestamp: "2026-11-19 10:20",
    systolic: 132,
    diastolic: 84,
    heartRate: 74,
    spO2: 98,
    temperature: 98.4,
    bloodSugar: 126,
    riskLevel: "Warning",
    notes: "Slight pre-hypertension and elevated fasting sugar."
  },
  {
    id: "VIT-303",
    patientId: "PAT-103",
    patientName: "Sophia Rodriguez",
    timestamp: "2026-11-18 14:10",
    systolic: 118,
    diastolic: 76,
    heartRate: 82,
    spO2: 94,
    temperature: 99.1,
    bloodSugar: 98,
    riskLevel: "Warning",
    notes: "Mild hypoxia due to active bronchospasm episode."
  },
  {
    id: "VIT-304",
    patientId: "PAT-104",
    patientName: "Dr. Julian Hayes",
    timestamp: "2026-11-17 11:00",
    systolic: 120,
    diastolic: 80,
    heartRate: 68,
    spO2: 99,
    temperature: 98.2,
    bloodSugar: 104,
    riskLevel: "Normal",
    notes: "All hemodynamic parameters within normal reference range."
  },
  {
    id: "VIT-305",
    patientId: "PAT-105",
    patientName: "Aria Montgomery",
    timestamp: "2026-11-17 16:30",
    systolic: 112,
    diastolic: 72,
    heartRate: 76,
    spO2: 99,
    temperature: 98.6,
    bloodSugar: 92,
    riskLevel: "Normal",
    notes: "Stable vitals recorded during neurological workup."
  },
  {
    id: "VIT-306",
    patientId: "PAT-107",
    patientName: "Hanna Marin",
    timestamp: "2026-11-14 10:00",
    systolic: 116,
    diastolic: 74,
    heartRate: 62,
    spO2: 99,
    temperature: 97.9,
    bloodSugar: 89,
    riskLevel: "Normal",
    notes: "Bradycardia consistent with controlled thyroid state."
  }
];

export const initialInvoices = [
  {
    id: "INV-501",
    invoiceNumber: "MP-2026-0891",
    patientId: "PAT-101",
    patientName: "Eleanor Vance",
    date: "2026-11-18",
    items: [
      { name: "Executive Internal Medicine Consultation", cost: 120 },
      { name: "Comprehensive Metabolic Panel (CMP)", cost: 85 },
      { name: "HbA1c Glycated Hemoglobin Test", cost: 45 }
    ],
    subtotal: 250,
    discount: 25,
    total: 225,
    paymentMethod: "Insurance",
    status: "Paid" // Paid | Pending | Refunded
  },
  {
    id: "INV-502",
    invoiceNumber: "MP-2026-0892",
    patientId: "PAT-102",
    patientName: "Marcus Aurelius Thorne",
    date: "2026-11-19",
    items: [
      { name: "Emergency Cardiology Consultation", cost: 200 },
      { name: "12-Lead Electrocardiogram (ECG)", cost: 95 },
      { name: "Serum Troponin I & Cardiac Enzymes", cost: 150 },
      { name: "Stat Telemetry Monitoring (2 Hours)", cost: 180 }
    ],
    subtotal: 625,
    discount: 0,
    total: 625,
    paymentMethod: "Card",
    status: "Pending"
  },
  {
    id: "INV-503",
    invoiceNumber: "MP-2026-0893",
    patientId: "PAT-103",
    patientName: "Sophia Rodriguez",
    date: "2026-11-15",
    items: [
      { name: "Pulmonology Consultation", cost: 130 },
      { name: "Pre/Post Bronchodilator Spirometry", cost: 110 }
    ],
    subtotal: 240,
    discount: 20,
    total: 220,
    paymentMethod: "UPI",
    status: "Paid"
  },
  {
    id: "INV-504",
    invoiceNumber: "MP-2026-0894",
    patientId: "PAT-104",
    patientName: "Dr. Julian Hayes",
    date: "2026-11-12",
    items: [
      { name: "Orthopedic Evaluation & Joint Assessment", cost: 140 },
      { name: "Bilateral Knee Digital Radiography (X-Ray)", cost: 85 }
    ],
    subtotal: 225,
    discount: 15,
    total: 210,
    paymentMethod: "Card",
    status: "Paid"
  },
  {
    id: "INV-505",
    invoiceNumber: "MP-2026-0895",
    patientId: "PAT-105",
    patientName: "Aria Montgomery",
    date: "2026-11-17",
    items: [
      { name: "Telehealth Neurology Follow-up", cost: 95 }
    ],
    subtotal: 95,
    discount: 0,
    total: 95,
    paymentMethod: "UPI",
    status: "Paid"
  }
];

// Helper to calculate vitals risk level dynamically
export function calculateVitalsRisk(systolic, diastolic, spO2, heartRate) {
  const sys = Number(systolic);
  const dia = Number(diastolic);
  const o2 = Number(spO2);
  const hr = Number(heartRate);

  if (sys >= 170 || dia >= 105 || o2 < 92 || hr > 120 || hr < 45) {
    return "Critical";
  }
  if (sys >= 135 || dia >= 88 || o2 <= 95 || hr > 100 || hr < 55) {
    return "Warning";
  }
  return "Normal";
}
