export const seedAssignments = [
  { id: 1, title: 'Database normalization report', course: 'DBMS', due: '2026-11-22', priority: 'High', done: false },
  { id: 2, title: 'Binary search tree implementation', course: 'DAA', due: '2026-11-24', priority: 'Medium', done: false },
  { id: 3, title: 'React component practical', course: 'FSD', due: '2026-11-26', priority: 'High', done: false },
  { id: 4, title: 'Neural network case study', course: 'MLT', due: '2026-11-19', priority: 'Low', done: true },
]

export const seedEvents = [
  { id: 1, title: 'TechNova 2026', type: 'Fest', date: '2026-11-25', time: '10:00 AM', place: 'Main Auditorium', description: 'A day of demos, coding challenges and student innovation.' },
  { id: 2, title: 'Frontend Development Workshop', type: 'Workshop', date: '2026-11-21', time: '02:00 PM', place: 'Computer Lab 3', description: 'Build accessible interfaces with modern React patterns.' },
  { id: 3, title: 'Inter-college Hackathon', type: 'Competition', date: '2026-11-29', time: '09:00 AM', place: 'Innovation Hub', description: 'Team up and prototype a solution to a real-world problem.' },
]

export const seedNotes = [
  { id: 1, title: 'DBMS revision', body: 'Revise 1NF, 2NF, 3NF and BCNF. Practice finding candidate keys.', color: 'lavender', pinned: true, updated: 'Today' },
  { id: 2, title: 'Project ideas', body: 'Campus portal, peer notes exchange, event registration dashboard.', color: 'mint', pinned: false, updated: 'Yesterday' },
]

export const timetable = [
  { day: 'Monday', slots: [['09:00', 'DBMS', 'Room 204', 'blue'], ['10:00', 'DAA', 'Room 204', 'violet'], ['11:30', 'MLT Lab', 'Lab 2', 'mint'], ['02:00', 'FSD', 'Room 105', 'orange']] },
  { day: 'Tuesday', slots: [['09:00', 'FSD', 'Room 105', 'orange'], ['10:00', 'OOSD', 'Room 105', 'blue'], ['12:00', 'DAA Tutorial', 'Room 204', 'violet'], ['02:00', 'Library / Study', 'Central Library', 'mint']] },
  { day: 'Wednesday', slots: [['09:00', 'MLT', 'Room 301', 'mint'], ['10:00', 'DBMS', 'Room 204', 'blue'], ['11:30', 'FSD Lab', 'Lab 1', 'orange'], ['02:00', 'OOSD', 'Room 105', 'violet']] },
  { day: 'Thursday', slots: [['09:00', 'DAA', 'Room 204', 'violet'], ['10:00', 'MLT', 'Room 301', 'mint'], ['12:00', 'DBMS Tutorial', 'Room 204', 'blue'], ['02:00', 'FSD', 'Room 105', 'orange']] },
  { day: 'Friday', slots: [['09:00', 'OOSD', 'Room 105', 'violet'], ['10:00', 'FSD', 'Room 105', 'orange'], ['11:30', 'DAA Lab', 'Lab 2', 'blue'], ['02:00', 'Mentor Hour', 'Faculty Block', 'mint']] },
]

const read = (key, fallback) => {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

export const loadData = (key, fallback) => read(key, fallback)
export const saveData = (key, value) => localStorage.setItem(key, JSON.stringify(value))
