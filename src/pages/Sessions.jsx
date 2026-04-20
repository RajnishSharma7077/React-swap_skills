import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getAvatarGradient } from '../data/mockData';
import './Sessions.css';

export default function Sessions() {
  const {
    currentUser, sessions, users,
    createSession, updateSession, cancelSession, completeSession,
    loading
  } = useApp();

  if (loading || !currentUser) {
    return (
      <div className="page">
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <div className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 700 }}>Loading Sessions...</div>
        </div>
      </div>
    );
  }

  const [tab, setTab] = useState('upcoming');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editSession, setEditSession] = useState(null);

  const mySessions = sessions.filter(
    (s) => s.teacherId === currentUser.id || s.learnerId === currentUser.id
  );
  const filtered = mySessions.filter((s) => {
    if (tab === 'upcoming') return s.status === 'upcoming';
    if (tab === 'completed') return s.status === 'completed';
    if (tab === 'cancelled') return s.status === 'cancelled';
    return true;
  });

  return (
    <div className="page" id="sessions-page">
      <div className="container">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 className="page-title">
              Your <span className="gradient-text">Sessions</span>
            </h1>
            <p className="page-subtitle">Manage all your swap sessions in one place.</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
            id="create-session-btn"
          >
            + Book Session
          </button>
        </div>

        <div className="tabs">
          {['upcoming', 'completed', 'cancelled', 'all'].map((t) => (
            <button
              key={t}
              className={`tab ${tab === t ? 'active' : ''}`}
              onClick={() => setTab(t)}
              id={`tab-${t}`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
              {' '}({mySessions.filter((s) => t === 'all' ? true : s.status === t).length})
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="glass-card empty-state">
            <div className="empty-icon">📅</div>
            <div className="empty-title">No {tab} sessions</div>
            <div className="empty-desc">
              {tab === 'upcoming'
                ? 'Book a session with a matched learner to get started!'
                : `You don't have any ${tab} sessions yet.`}
            </div>
          </div>
        ) : (
          <div className="session-list">
            {filtered.map((session) => {
              const partner = users.find(
                (u) =>
                  u.id ===
                  (session.teacherId === currentUser.id
                    ? session.learnerId
                    : session.teacherId)
              );
              const isTeaching = session.teacherId === currentUser.id;
              return (
                <div key={session.id} className="glass-card session-card" id={`session-${session.id}`}>
                  <div className="sc-left">
                    <div
                      className="avatar"
                      style={{ background: getAvatarGradient(partner?.id || 0) }}
                    >
                      {partner?.name?.charAt(0) || '?'}
                    </div>
                    <div className="sc-info">
                      <div className="sc-name">{partner?.name || 'Unknown User'}</div>
                      <div className="sc-detail">
                        {isTeaching ? '🎓 Teaching' : '📚 Learning'}{' '}
                        <strong>{session.skillTaught}</strong>
                        <span className="sc-exchange"> ↔ {session.skillExchanged}</span>
                      </div>
                      <div className="sc-time">
                        📅 {new Date(session.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        {' · '}🕐 {session.time}
                        {' · '}⏱ {session.duration} min
                      </div>
                      {session.notes && (
                        <div className="sc-notes">💬 {session.notes}</div>
                      )}
                    </div>
                  </div>
                  <div className="sc-right">
                    <span className={`sc-status status-${session.status}`}>
                      {session.status}
                    </span>
                    {session.status === 'upcoming' && (
                      <div className="sc-actions">
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setEditSession(session)}
                          id={`edit-${session.id}`}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => completeSession(session.id)}
                          id={`complete-${session.id}`}
                        >
                          Complete
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => cancelSession(session.id)}
                          id={`cancel-${session.id}`}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editSession) && (
        <SessionModal
          session={editSession}
          onClose={() => { setShowCreateModal(false); setEditSession(null); }}
          onCreate={createSession}
          onUpdate={updateSession}
          users={users}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}

function SessionModal({ session, onClose, onCreate, onUpdate, users, currentUser }) {
  const isEdit = !!session;
  const otherUsers = users.filter((u) => u.id !== currentUser.id);

  const [form, setForm] = useState({
    partnerId: session
      ? session.teacherId === currentUser.id
        ? session.learnerId
        : session.teacherId
      : otherUsers[0]?.id || '',
    skillTaught: session?.skillTaught || currentUser.skillsOffered[0] || '',
    skillExchanged: session?.skillExchanged || '',
    date: session?.date || '',
    time: session?.time || '10:00',
    duration: session?.duration || 60,
    notes: session?.notes || '',
    isTeaching: session ? session.teacherId === currentUser.id : true,
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      onUpdate(session.id, {
        skillTaught: form.skillTaught,
        skillExchanged: form.skillExchanged,
        date: form.date,
        time: form.time,
        duration: Number(form.duration),
        notes: form.notes,
      });
    } else {
      onCreate({
        teacherId: form.isTeaching ? currentUser.id : Number(form.partnerId),
        learnerId: form.isTeaching ? Number(form.partnerId) : currentUser.id,
        skillTaught: form.skillTaught,
        skillExchanged: form.skillExchanged,
        date: form.date,
        time: form.time,
        duration: Number(form.duration),
        notes: form.notes,
      });
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{isEdit ? 'Edit Session' : 'Book New Session'}</h2>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="session-form" id="session-form">
          {!isEdit && (
            <div className="form-group">
              <label className="form-label">Partner</label>
              <select
                className="form-select"
                value={form.partnerId}
                onChange={(e) => handleChange('partnerId', e.target.value)}
                required
              >
                {otherUsers.map((u) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
          )}
          {!isEdit && (
            <div className="form-group">
              <label className="form-label">Your role</label>
              <select
                className="form-select"
                value={form.isTeaching ? 'teach' : 'learn'}
                onChange={(e) => handleChange('isTeaching', e.target.value === 'teach')}
              >
                <option value="teach">I'm Teaching</option>
                <option value="learn">I'm Learning</option>
              </select>
            </div>
          )}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Skill Being Taught</label>
              <input
                type="text"
                className="form-input"
                value={form.skillTaught}
                onChange={(e) => handleChange('skillTaught', e.target.value)}
                placeholder="e.g. React"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">In Exchange For</label>
              <input
                type="text"
                className="form-input"
                value={form.skillExchanged}
                onChange={(e) => handleChange('skillExchanged', e.target.value)}
                placeholder="e.g. Spanish"
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-input"
                value={form.date}
                onChange={(e) => handleChange('date', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Time</label>
              <input
                type="time"
                className="form-input"
                value={form.time}
                onChange={(e) => handleChange('time', e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Duration (minutes)</label>
            <select
              className="form-select"
              value={form.duration}
              onChange={(e) => handleChange('duration', e.target.value)}
            >
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">60 minutes</option>
              <option value="90">90 minutes</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea
              className="form-textarea"
              value={form.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Topics to cover, preparation needed..."
              rows={3}
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" id="submit-session">
              {isEdit ? 'Save Changes' : 'Book Session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
