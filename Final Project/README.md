# CampusConnect – Student Campus Management Portal

A responsive React-based campus companion for students. Manage assignments, campus events, timetable, notes and a personal dashboard from one place.

## Features

- **Dashboard:** overview cards, upcoming deadlines, weekly activity and quick actions.
- **Assignments:** create, search, filter, complete and delete assignments.
- **Campus events:** browse upcoming events and save events to your list.
- **Timetable:** weekly class schedule with a day selector.
- **Notes:** create, search, pin and delete personal notes.
- **Local persistence:** data is stored in browser LocalStorage; no backend is required.
- **Responsive UI:** desktop sidebar and mobile-friendly navigation.

## Tech stack

- React
- Vite
- JavaScript (ES6+)
- CSS
- Browser LocalStorage

## Run locally

Requirements: Node.js 20.19+ or 22.12+.

```bash
cd "Final Project"
npm install
npm run dev
```

Open the local URL printed by Vite (normally http://localhost:5173).

## Production build

```bash
npm run build
npm run preview
```

## Project structure

```text
Final Project/
├── public/
│   └── campus.svg
├── src/
│   ├── App.jsx
│   ├── data.js
│   ├── main.jsx
│   └── styles.css
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Notes

This is a frontend academic project. Demo data is seeded on first launch. Changes made in the app persist in the current browser. Use **Reset demo data** in the profile menu to restore the sample dataset.

## Author

Ujjawal Singhal
