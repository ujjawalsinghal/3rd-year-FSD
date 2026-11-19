import { useEffect, useMemo, useState } from 'react'
import { loadData, saveData, seedAssignments, seedEvents, seedNotes, timetable } from './data'

const navItems = [
  { id: 'overview', label: 'Overview', icon: '⌂', group: 'Workspace' },
  { id: 'assignments', label: 'Assignments', icon: '▤', group: 'Workspace' },
  { id: 'events', label: 'Campus events', icon: '▦', group: 'Workspace' },
  { id: 'timetable', label: 'Timetable', icon: '▥', group: 'Workspace' },
  { id: 'notes', label: 'My notes', icon: '▧', group: 'Personal' },
]

const today = new Date('2026-11-19T12:00:00')
const dateLabel = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(today)
const prettyDate = (value) => new Date(value + 'T00:00:00').toLocaleDateString('en', { month: 'short', day: 'numeric' })
const daysLeft = (value) => Math.ceil((new Date(value + 'T00:00:00') - today) / 86400000)

function Icon({ children, className = '' }) {
  return <span className={'icon ' + className} aria-hidden="true">{children}</span>
}

function Modal({ title, onClose, children }) {
  return <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
    <section className="modal" role="dialog" aria-modal="true" aria-label={title}>
      <div className="modal-head"><h3>{title}</h3><button className="icon-btn" onClick={onClose} aria-label="Close">×</button></div>
      {children}
    </section>
  </div>
}

function App() {
  const [page, setPage] = useState('overview')
  const [assignments, setAssignments] = useState(() => loadData('cc_assignments', seedAssignments))
  const [events, setEvents] = useState(() => loadData('cc_events', seedEvents))
  const [notes, setNotes] = useState(() => loadData('cc_notes', seedNotes))
  const [savedEvents, setSavedEvents] = useState(() => loadData('cc_saved_events', []))
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const [modal, setModal] = useState('')
  const [activeDay, setActiveDay] = useState('Monday')
  const [toast, setToast] = useState('')
  const [profileOpen, setProfileOpen] = useState(false)
  const [form, setForm] = useState({ title: '', course: '', due: '2026-11-28', priority: 'Medium', body: '' })

  useEffect(() => saveData('cc_assignments', assignments), [assignments])
  useEffect(() => saveData('cc_events', events), [events])
  useEffect(() => saveData('cc_notes', notes), [notes])
  useEffect(() => saveData('cc_saved_events', savedEvents), [savedEvents])

  const pending = assignments.filter((item) => !item.done)
  const completed = assignments.filter((item) => item.done)
  const completion = assignments.length ? Math.round(completed.length / assignments.length * 100) : 0
  const filteredAssignments = useMemo(() => assignments.filter((item) => {
    const matches = (item.title + ' ' + item.course).toLowerCase().includes(query.toLowerCase())
    const status = filter === 'All' || (filter === 'Pending' && !item.done) || (filter === 'Completed' && item.done)
    return matches && status
  }), [assignments, query, filter])

  const notify = (message) => {
    setToast(message)
    window.clearTimeout(window.__ccToast)
    window.__ccToast = window.setTimeout(() => setToast(''), 2400)
  }

  const openAssignment = () => {
    setForm({ title: '', course: '', due: '2026-11-28', priority: 'Medium', body: '' })
    setModal('assignment')
  }

  const addAssignment = (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.course.trim()) return
    setAssignments((old) => [{ id: Date.now(), title: form.title.trim(), course: form.course.trim(), due: form.due, priority: form.priority, done: false }, ...old])
    setModal('')
    notify('Assignment added successfully')
  }

  const addNote = (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.body.trim()) return
    setNotes((old) => [{ id: Date.now(), title: form.title.trim(), body: form.body.trim(), color: ['lavender', 'mint', 'peach'][old.length % 3], pinned: false, updated: 'Just now' }, ...old])
    setModal('')
    notify('Note saved')
  }

  const resetDemo = () => {
    setAssignments(seedAssignments)
    setEvents(seedEvents)
    setNotes(seedNotes)
    setSavedEvents([])
    setProfileOpen(false)
    notify('Demo data restored')
  }

  const title = navItems.find((item) => item.id === page)?.label || 'Overview'

  return <div className="app-shell">
    <aside className="sidebar">
      <a className="brand" href="#overview" onClick={() => setPage('overview')}>
        <span className="brand-mark">c.</span><span>campus<span className="brand-light">connect</span><small>STUDENT PORTAL</small></span>
      </a>
      <div className="side-label">MENU</div>
      <div className="nav-list">{navItems.map((item) => <button key={item.id} className={'nav-link ' + (page === item.id ? 'active' : '')} onClick={() => { setPage(item.id); setQuery('') }}>
        <Icon>{item.icon}</Icon><span>{item.label}</span>{item.id === 'assignments' && <em>{pending.length}</em>}
      </button>)}</div>
      <div className="sidebar-bottom">
        <div className="help-card"><div className="help-icon">✦</div><strong>Make this semester count.</strong><p>Small steps every day lead to big results.</p><button onClick={() => setPage('assignments')}>View my tasks <span>→</span></button></div>
        <div className="side-profile"><div className="avatar">US</div><div><strong>Ujjawal Singhal</strong><small>Computer Science · Year 3</small></div><button className="dots" onClick={() => setProfileOpen(!profileOpen)}>···</button>
          {profileOpen && <div className="profile-menu"><button onClick={resetDemo}>↻ Reset demo data</button><button onClick={() => setProfileOpen(false)}>Close menu</button></div>}
        </div>
      </div>
    </aside>

    <main className="main-area">
      <header className="topbar">
        <div className="breadcrumb"><span>Workspace</span><b>/</b><strong>{title}</strong></div>
        <div className="top-actions"><div className="semester-pill"><span></span> Semester 5 · 2026</div><button className="top-avatar" onClick={() => setProfileOpen(!profileOpen)}>US</button></div>
      </header>
      <div className="page-wrap">
        <div className="welcome-row">
          <div><div className="eyebrow">{dateLabel.toUpperCase()} · SEMESTER 5</div><h1>{page === 'overview' ? 'Good afternoon, Ujjawal' : title}<span className="wave">{page === 'overview' ? ' ✦' : ''}</span></h1><p>{page === 'overview' ? 'Here’s what’s happening on your campus today.' : page === 'assignments' ? 'Stay on top of deadlines and keep your coursework moving.' : page === 'events' ? 'Discover what’s happening around your campus.' : page === 'timetable' ? 'Your weekly class schedule, all in one place.' : 'A little space for all your important thoughts.'}</p></div>
          {page === 'overview' && <button className="primary-btn" onClick={openAssignment}><span>＋</span> Add assignment</button>}
          {page === 'assignments' && <button className="primary-btn" onClick={openAssignment}><span>＋</span> New assignment</button>}
          {page === 'notes' && <button className="primary-btn" onClick={() => { setForm({ title: '', body: '' }); setModal('note') }}><span>＋</span> New note</button>}
        </div>

        {page === 'overview' && <Dashboard assignments={assignments} pending={pending} completed={completed} completion={completion} events={events} setPage={setPage} openAssignment={openAssignment} toggleDone={(id) => setAssignments((old) => old.map((a) => a.id === id ? { ...a, done: !a.done } : a))} />}
        {page === 'assignments' && <section className="panel">
          <div className="panel-head"><div><h2>All assignments</h2><p>{pending.length} tasks need your attention</p></div><div className="toolbar"><div className="search-box"><Icon>⌕</Icon><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search assignments..." /></div><select value={filter} onChange={(e) => setFilter(e.target.value)}><option>All</option><option>Pending</option><option>Completed</option></select></div></div>
          <AssignmentTable items={filteredAssignments} toggleDone={(id) => setAssignments((old) => old.map((a) => a.id === id ? { ...a, done: !a.done } : a))} remove={(id) => setAssignments((old) => old.filter((a) => a.id !== id))} />
        </section>}
        {page === 'events' && <EventsPage events={events} saved={savedEvents} toggleSave={(id) => setSavedEvents((old) => old.includes(id) ? old.filter((x) => x !== id) : [...old, id])} />}
        {page === 'timetable' && <Timetable activeDay={activeDay} setActiveDay={setActiveDay} />}
        {page === 'notes' && <NotesPage notes={notes} setNotes={setNotes} query={query} setQuery={setQuery} />}
        <footer className="footer"><span>© 2026 CampusConnect</span><span>Made for students, with <b>♥</b></span></footer>
      </div>
    </main>
    {modal === 'assignment' && <Modal title="Add a new assignment" onClose={() => setModal('')}><form className="form-stack" onSubmit={addAssignment}><label>Assignment title<input required autoFocus value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Data structures lab file" /></label><div className="form-grid"><label>Course / subject<input required value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} placeholder="e.g. DAA" /></label><label>Due date<input required type="date" value={form.due} onChange={(e) => setForm({ ...form, due: e.target.value })} /></label></div><label>Priority<select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}><option>Low</option><option>Medium</option><option>High</option></select></label><div className="modal-actions"><button type="button" className="secondary-btn" onClick={() => setModal('')}>Cancel</button><button className="primary-btn">Save assignment</button></div></form></Modal>}
    {modal === 'note' && <Modal title="Create a note" onClose={() => setModal('')}><form className="form-stack" onSubmit={addNote}><label>Note title<input required autoFocus value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Give your note a title" /></label><label>Your note<textarea required rows="5" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} placeholder="Write something worth remembering..." /></label><div className="modal-actions"><button type="button" className="secondary-btn" onClick={() => setModal('')}>Cancel</button><button className="primary-btn">Save note</button></div></form></Modal>}
    {toast && <div className="toast"><span>✓</span>{toast}</div>}
  </div>
}

function Dashboard({ assignments, pending, completed, completion, events, setPage, openAssignment, toggleDone }) {
  const upcoming = [...pending].sort((a, b) => a.due.localeCompare(b.due)).slice(0, 4)
  return <>
    <div className="stats-grid">
      <StatCard icon="▤" tone="purple" label="Total assignments" value={assignments.length} note="Across all subjects" />
      <StatCard icon="◷" tone="orange" label="Pending tasks" value={pending.length} note="Keep the momentum" />
      <StatCard icon="✓" tone="green" label="Completed" value={completed.length} note="You're making progress" />
      <StatCard icon="↗" tone="blue" label="Completion rate" value={completion + '%'} note="Semester productivity" />
    </div>
    <div className="dashboard-grid">
      <section className="panel task-panel"><div className="panel-head"><div><h2>Upcoming assignments</h2><p>Your next deadlines at a glance</p></div><button className="text-btn" onClick={() => setPage('assignments')}>View all <span>→</span></button></div>
        {upcoming.length ? <div className="task-list">{upcoming.map((item) => <div className="task-row" key={item.id}><button className={'check-circle ' + (item.done ? 'checked' : '')} onClick={() => toggleDone(item.id)}>{item.done ? '✓' : ''}</button><div className="task-info"><strong>{item.title}</strong><small>{item.course} <span>·</span> Due {prettyDate(item.due)}</small></div><div className="task-end"><span className={'priority ' + item.priority.toLowerCase()}>{item.priority}</span><small className={daysLeft(item.due) <= 2 ? 'urgent' : ''}>{daysLeft(item.due) < 0 ? 'Overdue' : daysLeft(item.due) === 0 ? 'Today' : daysLeft(item.due) + ' days left'}</small></div></div>)}</div> : <Empty text="You're all caught up. Nice work!" />}
        <button className="add-inline" onClick={openAssignment}>＋ Add another assignment</button>
      </section>
      <section className="panel progress-panel"><div className="panel-head"><div><h2>Semester progress</h2><p>A snapshot of your productivity</p></div><span className="round-icon">✦</span></div><div className="progress-number">{completion}<small>%</small></div><p className="muted">Assignments completed</p><div className="progress-track"><span style={{ width: completion + '%' }} /></div><div className="progress-legend"><span><i className="dot purple-dot" /> Completed <b>{completed.length}</b></span><span><i className="dot grey-dot" /> Remaining <b>{pending.length}</b></span></div><div className="motivation"><span>✧</span><p><strong>Keep showing up!</strong><br />Consistency beats intensity. One task at a time.</p></div></section>
    </div>
    <div className="lower-grid">
      <section className="panel"><div className="panel-head"><div><h2>Campus happenings</h2><p>Don't miss what's coming up</p></div><button className="text-btn" onClick={() => setPage('events')}>All events →</button></div><div className="event-mini-list">{events.slice(0, 2).map((event) => <div className="event-mini" key={event.id}><div className="date-tile"><b>{new Date(event.date + 'T00:00:00').getDate()}</b><small>{new Date(event.date + 'T00:00:00').toLocaleDateString('en', { month: 'short' }).toUpperCase()}</small></div><div><strong>{event.title}</strong><small>{event.time} · {event.place}</small></div><span className="event-type">{event.type}</span></div>)}</div></section>
      <section className="panel week-panel"><div className="panel-head"><div><h2>Your week</h2><p>A little progress every day</p></div><span className="week-badge">THIS WEEK</span></div><div className="week-bars">{[35, 62, 48, 82, 56, 28, 18].map((n, i) => <div className="bar-col" key={i}><div className="bar-bg"><span style={{ height: n + '%' }} /></div><small>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</small></div>)}</div><div className="week-caption"><span>Activity overview</span><strong>Stay consistent</strong></div></section>
    </div>
  </>
}

function StatCard({ icon, tone, label, value, note }) {
  return <div className="stat-card"><div className={'stat-icon ' + tone}>{icon}</div><span className="stat-label">{label}</span><strong className="stat-value">{value}</strong><small>{note}</small></div>
}

function AssignmentTable({ items, toggleDone, remove }) {
  if (!items.length) return <Empty text="No assignments found. Try another search or add a new task." />
  return <div className="table-wrap"><table><thead><tr><th>ASSIGNMENT</th><th>COURSE</th><th>DUE DATE</th><th>PRIORITY</th><th>STATUS</th><th /></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td><div className="table-title"><button className={'check-circle small ' + (item.done ? 'checked' : '')} onClick={() => toggleDone(item.id)}>{item.done ? '✓' : ''}</button><span className={item.done ? 'done-text' : ''}>{item.title}</span></div></td><td><span className="course-chip">{item.course}</span></td><td>{prettyDate(item.due)}</td><td><span className={'priority ' + item.priority.toLowerCase()}>{item.priority}</span></td><td><span className={'status ' + (item.done ? 'complete' : 'inprogress')}>{item.done ? 'Completed' : 'In progress'}</span></td><td><button className="delete-btn" title="Delete assignment" onClick={() => remove(item.id)}>×</button></td></tr>)}</tbody></table></div>
}

function EventsPage({ events, saved, toggleSave }) {
  return <div className="events-grid">{events.map((event, index) => <article className="event-card" key={event.id}><div className={'event-art art-' + index}><span>{event.type === 'Workshop' ? '✳' : event.type === 'Fest' ? '✦' : '⌁'}</span><small>{event.type.toUpperCase()}</small></div><div className="event-card-body"><div className="event-date">{prettyDate(event.date)} · {event.time}</div><h3>{event.title}</h3><p>{event.description}</p><div className="event-place">⌖ {event.place}</div><button className={saved.includes(event.id) ? 'saved-btn' : 'secondary-btn'} onClick={() => toggleSave(event.id)}>{saved.includes(event.id) ? '✓ Saved to my events' : '＋ Save event'}</button></div></article>)}</div>
}

function Timetable({ activeDay, setActiveDay }) {
  const current = timetable.find((item) => item.day === activeDay)
  return <section className="panel timetable-panel"><div className="panel-head"><div><h2>Weekly schedule</h2><p>Plan your classes and make time for focused work.</p></div><span className="week-badge">SEMESTER 5</span></div><div className="day-tabs">{timetable.map((day) => <button key={day.day} className={activeDay === day.day ? 'selected' : ''} onClick={() => setActiveDay(day.day)}>{day.day.slice(0, 3)}</button>)}</div><div className="schedule-list">{current.slots.map(([time, subject, room, tone]) => <div className="schedule-row" key={time}><time>{time}</time><div className={'schedule-block ' + tone}><span className="schedule-dot" /><div><strong>{subject}</strong><small>{room}</small></div><span className="class-duration">1 hour</span></div></div>)}</div></section>
}

function NotesPage({ notes, setNotes, query, setQuery }) {
  const filtered = notes.filter((note) => (note.title + ' ' + note.body).toLowerCase().includes(query.toLowerCase())).sort((a, b) => Number(b.pinned) - Number(a.pinned))
  return <section className="panel notes-panel"><div className="panel-head"><div><h2>Your notebook</h2><p>Ideas, reminders and quick revision notes.</p></div><div className="search-box"><Icon>⌕</Icon><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search notes..." /></div></div>{filtered.length ? <div className="notes-grid">{filtered.map((note) => <article className={'note-card ' + note.color} key={note.id}><div className="note-top"><span>{note.pinned ? '📌 Pinned' : 'PERSONAL NOTE'}</span><button className="delete-btn" onClick={() => setNotes((old) => old.filter((n) => n.id !== note.id))}>×</button></div><h3>{note.title}</h3><p>{note.body}</p><div className="note-foot"><small>{note.updated}</small><button onClick={() => setNotes((old) => old.map((n) => n.id === note.id ? { ...n, pinned: !n.pinned } : n))}>{note.pinned ? 'Unpin note' : 'Pin note'}</button></div></article>)}</div> : <Empty text="No notes match your search. Create a note to capture an idea." />}</section>
}

function Empty({ text }) {
  return <div className="empty-state"><span>✧</span><p>{text}</p></div>
}

export default App
