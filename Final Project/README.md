# 🩺 MediPulse 360 | Clinical EHR & Practice Intelligence System

A next-generation, high-performance Electronic Health Record (EHR), Patient Telemetry Monitoring, and Outpatient Practice Management web application engineered for modern clinical workflows.

Built with **React 18**, **JavaScript (ES6+)**, **Vite**, and **vanilla CSS3 Design Tokens**, MediPulse 360 operates entirely client-side without mandatory backend dependencies, featuring real-time state persistence via browser `localStorage`, responsive telemetry dashboards, and clinical letterhead generation.

---

## 📌 Problem Statement

Small-to-medium healthcare clinics and outpatient polyclinics frequently grapple with paper-based registers, disparate spreadsheets, and slow legacy EHR portals. Clinicians and triage nurses need:
1. **Instant, zero-latency access** to longitudinal patient histories and drug allergies to prevent contraindications.
2. **Real-time physiological telemetry monitoring** with automated risk alerts (detecting hypertensive crises, hypoxia, and acute arrhythmias).
3. **Structured digital prescription generation** with pre-configured dosage frequencies and print-ready hospital slips.
4. **Agile appointment triage scheduling** prioritizing acute clinical emergencies over routine follow-ups.
5. **Integrated outpatient billing & revenue ledger** ensuring transparent billing and patient receipt generation.

**MediPulse 360** directly addresses these challenges with a unified clinical cockpit tailored for doctors, triage staff, and clinic administrators.

---

## 🎯 Objectives

- **Clinical Reliability**: Deliver an ultra-fast, zero-backend, client-side EHR system that functions offline or in disconnected clinical settings.
- **Triage Decision Support**: Automatically compute and classify patient telemetry against standard medical reference guidelines (Normal, Warning, Critical).
- **Patient Safety**: Cross-check documented patient drug allergies during digital prescription formulation.
- **Design System Excellence**: Support both high-contrast Clinical Daylight Mode and Midnight Telemetry Mode (dark mode) for low-glare night rounds.
- **Academic Rigor**: Serve as a high-caliber 3rd-year B.Tech CSE Full Stack Development flagship capstone demonstration.

---

## 🚀 Key Modules & Features

### 1. 📊 Clinical Operations Cockpit (Dashboard)
- **Real-Time KPIs**: Total Registered Patients, Today's Scheduled Consultations, Critical Triage Alerts, and Outpatient Revenue.
- **Weekly Patient Flow Trend**: Interactive SVG area chart mapping daily consultation volumes.
- **Triage Urgency Donut Chart**: Dynamic acuity breakdown (Routine Care, Urgent Care, Emergency Triage).
- **Specialty Workload Bar Chart**: Distribution across Cardiology, Neurology, Pulmonology, Orthopedics, etc.
- **Today's Consultations Feed**: Inline appointment status lifecycle transitions (`Checked In` ➔ `Consult` ➔ `Completed`).
- **Telemetry Alert Banner**: Immediate notification ticker when patients breach critical physiological boundaries.

### 2. 🗂️ Patient Electronic Health Records (EHR)
- **Comprehensive Patient Directory**: Searchable by Name, UHID (`PAT-101`), Phone, Condition, or Allergy.
- **Multi-Factor Filtering & Sorting**: Filter by Blood Group (A+, B+, O+, AB+, etc.) and Clinical Status (`Active`, `Critical`, `Stable`, `Discharged`); sort by Name, Age, or Last Visit.
- **Interactive EHR Dossier Modal**: Comprehensive medical chart detailing demographics, emergency contacts, chronic conditions, recorded allergies, recent vitals history, and past prescriptions.
- **Patient Registration & Modification**: Full CRUD with form validation, sanitization, and cascade deletion protection.

### 3. 🗓️ Outpatient Scheduling & Triage Manager
- **Status Filter Tabs**: Filter views by `All`, `Today`, `Upcoming`, `Completed`, or `Cancelled`.
- **Department & Doctor Assignment**: Multi-specialty routing (Cardiology, Neurology, Pulmonology, Orthopedics, Endocrinology).
- **Acuity Level Flagging**: Color-coded badges for Routine, Urgent, and Emergency cases.
- **Lifecycle Management**: Real-time transitions with automated button states and cancel confirmations.

### 4. 💊 Digital Prescription & Consultation Studio (Rx)
- **Interactive Multi-Drug Builder**: Add medications dynamically with standardized dosage, frequency schedules (`1-0-1`, `1-1-1`, `SOS`), duration, and food timing instructions.
- **Contraindication & Allergy Guard**: Real-time alert banner warning physicians if the selected patient has documented allergies to specific drug classes.
- **Clinical Letterhead Generation**: High-fidelity, print-ready prescription slip styled with hospital header, practitioner registration license, Rx symbol, medication schedule, and doctor signature block.

### 5. 💓 Vitals & Physiological Telemetry Tracker
- **Hemodynamic Parameters Tracked**:
  - Blood Pressure (Systolic & Diastolic in mmHg)
  - Heart Rate / Pulse (bpm)
  - Blood Oxygen Saturation (SpO2 %)
  - Core Body Temperature (°F)
  - Random Blood Glucose (mg/dL)
- **Automated Algorithmic Risk Classification**: Real-time logic detects Hypertensive Crisis (BP ≥ 170/105), Hypoxia (SpO2 < 92%), Bradycardia (<45 bpm), and Tachycardia (>120 bpm).
- **Dynamic Telemetry Entry**: Live preview badge updates risk severity in real-time as values are typed into the modal.

### 6. 💳 Billing, Invoices & Revenue Ledger
- **Financial Statistics**: Processed Revenue, Outstanding Claims/Receivables, and Invoices Count.
- **Itemized Billing Generator**: Add custom procedures, consultations, and lab test charges with applied discounts.
- **Multi-Payment Modes**: Health Insurance, Credit/Debit Card, UPI Digital, and Cash.
- **Celebratory Settle UX**: Seamless settlement trigger with confetti visual confirmation.
- **Printable Official Receipt**: Generate and print standardized patient payment slips.

### 7. ⚙️ Clinic Administration & Disaster Recovery
- **Hospital Profile Configuration**: Customize clinic name, head physician, license registration, address, and billing currency (`$`, `₹`, `€`, `£`).
- **Dual Lighting Modes**: Instant toggle between Clinical Daylight Mode and Midnight Telemetry Mode.
- **JSON Data Backup & Portability**: Export full clinic database as a JSON backup file or restore from previous backups.
- **Demo Dataset Reset**: One-click restore to pre-seeded evaluation dataset for presentations and viva examinations.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Library** | React 18 (Hooks, Context, Portals) | Declarative component UI and state management |
| **Language** | Modern JavaScript (ES6+) | Pure vanilla JS (strictly no TypeScript) |
| **Build & Dev Tool** | Vite 5.x | Ultra-fast Hot Module Replacement (HMR) and optimized Rollup bundling |
| **Styling & Theme** | Modern CSS3 (Custom Properties) | Modular design tokens for Light/Dark themes, flexbox & grid |
| **Icons** | Lucide React | Consistent, lightweight SVG medical and interface iconography |
| **Visual Effects** | Canvas Confetti | Celebratory micro-interaction on invoice settlement |
| **Data Persistence** | HTML5 Web Storage (`localStorage`) | Full client-side persistence and zero-backend requirement |

---

## 📁 Project Architecture

```text
Final Project/
├── index.html                  # HTML5 entry with Google Fonts & Meta tags
├── package.json                # Project dependencies and Vite build scripts
├── vite.config.js              # Vite bundler configuration
├── README.md                   # Complete architectural & operational manual
├── public/
│   └── medipulse-icon.svg      # Vector pulse brand logo
└── src/
    ├── main.jsx                # React DOM root entry
    ├── App.jsx                 # Top-level shell with theme & app context
    ├── styles/
    │   └── index.css           # Design tokens, variables, typography, and responsive rules
    ├── data/
    │   └── initialData.js      # Seed datasets (patients, appointments, vitals, invoices, clinic profile)
    ├── context/
    │   ├── ThemeContext.jsx    # Light / Dark mode management with DOM attribute sync
    │   └── AppContext.jsx      # Global state provider, CRUD handlers, and LocalStorage sync
    ├── components/
    │   ├── common/
    │   │   ├── Navbar.jsx          # Top bar with clock, search, alert badges, and theme toggle
    │   │   ├── Sidebar.jsx         # Collapsible responsive navigation with live badge counts
    │   │   ├── StatCard.jsx        # Reusable KPI metric card with trends & color variants
    │   │   ├── Modal.jsx           # Accessible dialog backdrop with Esc listener
    │   │   ├── ConfirmDialog.jsx   # Safety confirmation dialog for destructive actions
    │   │   ├── ToastContainer.jsx  # Floating system feedback toasts (success/error/warning)
    │   │   └── EmptyState.jsx      # Clean vector placeholder when lists/tables are empty
    │   └── charts/
    │       ├── AreaTrendChart.jsx  # Responsive SVG curved area chart for patient flow
    │       ├── DonutChart.jsx      # Responsive SVG donut chart for triage distribution
    │       └── BarChart.jsx        # Responsive SVG bar chart for department workloads
    └── pages/
        ├── Dashboard.jsx           # Executive clinical cockpit & live triage overview
        ├── Patients.jsx            # EHR directory, filters, sorting, and registration modal
        ├── PatientDetailsModal.jsx # Comprehensive patient medical dossier
        ├── Appointments.jsx        # Outpatient triage schedule & status transitions
        ├── Prescriptions.jsx       # Digital Rx composer and printable hospital prescription slips
        ├── VitalsTracker.jsx       # Hemodynamic telemetry monitoring & live risk evaluator
        ├── Billing.jsx             # Outpatient billing, revenue statistics & receipt printer
        └── Settings.jsx            # Clinic profile, theme switcher & JSON database backup hub
```

---

## 💻 Installation & Execution Instructions

### Prerequisites
- **Node.js**: v18.0.0 or later (Tested on Node v24)
- **npm**: v9.0.0 or later

### Step 1: Navigate to Project Directory
```bash
cd "Final Project"
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Run the Development Server
```bash
npm run dev
```
Open your browser and navigate to:
```
http://localhost:5173/
```

### Step 4: Run Production Build
```bash
npm run build
```
The optimized production bundle will be generated in `dist/`.

To preview the production build locally:
```bash
npm run preview
```

---

## 🧪 Verification & Manual Testing Guide

1. **Dashboard & KPIs**:
   - Verify that all 4 KPI cards calculate their values directly from the stored datasets.
   - Confirm that the interactive SVG area chart displays weekly consultation curves and that the Donut chart renders proportional triage slices.
2. **Light & Dark Mode**:
   - Click the Moon/Sun icon in the top right navbar.
   - Notice the instantaneous transition between crisp daylight and midnight telemetry palette across all surfaces, text colors, and borders.
3. **Patient Registration & Dossier**:
   - Navigate to `Patient Records (EHR)` in the sidebar.
   - Click the **Eye icon** on any patient row to open the full medical dossier modal.
   - Click **Register New Patient**, enter valid details, and submit. The new patient will immediately appear at the top of the table.
4. **Appointment Status Pipeline**:
   - Navigate to `Appointments & Triage`.
   - Click **Check In** on a scheduled appointment ➔ status changes to `Checked In`.
   - Click **Consult** ➔ status advances to `In Consultation`.
   - Click **Finish** ➔ marked as `Completed`.
5. **Digital Prescription & Print Slip**:
   - Navigate to `Digital Rx Studio`.
   - Click **Slip Preview** on any prescription to view the realistic hospital letterhead slip.
   - Click **Print / Export PDF** to trigger the browser's native print preview dialog.
6. **Telemetry & Real-Time Risk Evaluator**:
   - Navigate to `Vitals & Telemetry`.
   - Click **Log Patient Telemetry**. Notice how the live triage badge at the top dynamically shifts between `NORMAL`, `WARNING`, and `CRITICAL` as you modify BP and SpO2 values.
7. **Billing & Confetti Micro-interaction**:
   - Navigate to `Billing & Invoices`.
   - Locate an invoice in `Pending` status and click **Settle**. Observe the celebratory confetti effect and immediate update to total revenue.
8. **Disaster Recovery & Demo Reset**:
   - Navigate to `Clinic Settings & Data`.
   - Click **Export Backup (JSON)** to download the database.
   - Click **Restore Demo Dataset** to restore the factory seed data at any time.

---

## 🔮 Future Roadmap & Enhancements

- **DICOM Imaging Viewer**: Integration of client-side canvas-based DICOM medical imaging viewer for X-rays and MRI scans.
- **HL7 / FHIR Format Export**: Support for standardized Fast Healthcare Interoperability Resources (FHIR) JSON schema.
- **WebRTC Teleconsultation**: Peer-to-peer encrypted video calling directly inside the appointment drawer.
- **Speech-to-Text Clinical Dictation**: Web Speech API integration for hands-free physician note-taking during consultations.

---

## 📄 License & Academic Attribution
Developed as an academic capstone for **3rd-year B.Tech CSE Full Stack Development** (FSD) curriculum.  
Created with pride by **Ujjawal Singhal**.
