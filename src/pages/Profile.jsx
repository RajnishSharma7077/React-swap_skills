import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getAvatarGradient, ALL_SKILLS } from '../data/mockData';
import './Profile.css';

export default function Profile() {
  const { currentUser, updateProfile, getReviewsForUser, loading } = useApp();

  if (loading || !currentUser) {
    return (
      <div className="page">
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <div className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 700 }}>Loading Profile...</div>
        </div>
      </div>
    );
  }

  const [editing, setEditing] = useState(false);
  const reviews = getReviewsForUser(currentUser.id);
  const { users } = useApp();

  const [form, setForm] = useState({
    name: currentUser.name,
    bio: currentUser.bio,
    location: currentUser.location,
    availability: currentUser.availability,
    skillsOffered: [...currentUser.skillsOffered],
    skillsWanted: [...currentUser.skillsWanted],
  });

  const [newSkillOffer, setNewSkillOffer] = useState('');
  const [newSkillWant, setNewSkillWant] = useState('');

  const handleSave = () => {
    updateProfile(form);
    setEditing(false);
  };

  const addSkill = (type) => {
    const skill = type === 'offer' ? newSkillOffer.trim() : newSkillWant.trim();
    if (!skill) return;
    const key = type === 'offer' ? 'skillsOffered' : 'skillsWanted';
    if (form[key].includes(skill)) return;
    setForm((prev) => ({ ...prev, [key]: [...prev[key], skill] }));
    if (type === 'offer') setNewSkillOffer('');
    else setNewSkillWant('');
  };

  const removeSkill = (type, skill) => {
    const key = type === 'offer' ? 'skillsOffered' : 'skillsWanted';
    setForm((prev) => ({ ...prev, [key]: prev[key].filter((s) => s !== skill) }));
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < Math.round(rating) ? 'filled' : ''}`}>★</span>
    ));
  };

  return (
    <div className="page" id="profile-page">
      <div className="container">
        <div className="profile-layout">
          {/* Left Column - Profile Info */}
          <div className="profile-main">
            <div className="glass-card profile-header-card">
              <div className="ph-top">
                <div
                  className="avatar avatar-xl"
                  style={{ background: getAvatarGradient(currentUser.id) }}
                >
                  {currentUser.name.charAt(0)}
                </div>
                <div className="ph-info">
                  {editing ? (
                    <input
                      type="text"
                      className="form-input ph-name-input"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  ) : (
                    <h1 className="ph-name">{currentUser.name}</h1>
                  )}
                  <div className="ph-location">📍 {editing ? (
                    <input
                      type="text"
                      className="form-input ph-loc-input"
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                    />
                  ) : currentUser.location}</div>
                  <div className="ph-meta">
                    <span>⭐ {currentUser.rating} ({currentUser.reviewCount} reviews)</span>
                    <span>⚡ {currentUser.skillPoints} pts</span>
                    <span>📅 Joined {new Date(currentUser.joinedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
                <button
                  className={`btn ${editing ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={editing ? handleSave : () => setEditing(true)}
                  id="edit-profile-btn"
                >
                  {editing ? '💾 Save' : '✏️ Edit'}
                </button>
              </div>
              <div className="ph-bio">
                {editing ? (
                  <textarea
                    className="form-textarea"
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    rows={3}
                  />
                ) : (
                  <p>{currentUser.bio}</p>
                )}
              </div>
              {editing && (
                <div className="ph-availability">
                  <label className="form-label">Availability</label>
                  <input
                    type="text"
                    className="form-input"
                    value={form.availability}
                    onChange={(e) => setForm({ ...form, availability: e.target.value })}
                  />
                </div>
              )}
              {!editing && (
                <div className="ph-availability-display">
                  🕐 <strong>Available:</strong> {currentUser.availability}
                </div>
              )}
            </div>

            {/* Skills Sections */}
            <div className="glass-card profile-skills-card">
              <h2 className="psc-title">🎓 Skills I Offer</h2>
              <div className="psc-tags">
                {(editing ? form.skillsOffered : currentUser.skillsOffered).map((s) => (
                  <span key={s} className="skill-badge offer">
                    {s}
                    {editing && (
                      <button className="skill-remove" onClick={() => removeSkill('offer', s)}>×</button>
                    )}
                  </span>
                ))}
              </div>
              {editing && (
                <div className="psc-add">
                  <select
                    className="form-select"
                    value={newSkillOffer}
                    onChange={(e) => setNewSkillOffer(e.target.value)}
                  >
                    <option value="">Select a skill...</option>
                    {ALL_SKILLS.filter((s) => !form.skillsOffered.includes(s)).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <button className="btn btn-secondary btn-sm" onClick={() => addSkill('offer')}>Add</button>
                </div>
              )}
            </div>

            <div className="glass-card profile-skills-card">
              <h2 className="psc-title">📚 Skills I Want to Learn</h2>
              <div className="psc-tags">
                {(editing ? form.skillsWanted : currentUser.skillsWanted).map((s) => (
                  <span key={s} className="skill-badge want">
                    {s}
                    {editing && (
                      <button className="skill-remove" onClick={() => removeSkill('want', s)}>×</button>
                    )}
                  </span>
                ))}
              </div>
              {editing && (
                <div className="psc-add">
                  <select
                    className="form-select"
                    value={newSkillWant}
                    onChange={(e) => setNewSkillWant(e.target.value)}
                  >
                    <option value="">Select a skill...</option>
                    {ALL_SKILLS.filter((s) => !form.skillsWanted.includes(s)).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <button className="btn btn-secondary btn-sm" onClick={() => addSkill('want')}>Add</button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Stats & Reviews */}
          <div className="profile-sidebar">
            <div className="glass-card profile-stats-card">
              <h3 className="psbc-title">Performance</h3>
              <div className="profile-stat-items">
                <div className="psi">
                  <span className="psi-value" style={{ color: 'var(--amber-400)' }}>{currentUser.skillPoints}</span>
                  <span className="psi-label">Skill Points</span>
                </div>
                <div className="psi">
                  <span className="psi-value" style={{ color: 'var(--emerald-400)' }}>{currentUser.sessionsCompleted}</span>
                  <span className="psi-label">Sessions</span>
                </div>
                <div className="psi">
                  <span className="psi-value" style={{ color: 'var(--primary-400)' }}>{currentUser.rating}</span>
                  <span className="psi-label">Rating</span>
                </div>
              </div>
            </div>

            <div className="glass-card profile-reviews-card">
              <h3 className="psbc-title">Recent Reviews ({reviews.length})</h3>
              {reviews.length === 0 ? (
                <p className="no-reviews">No reviews yet.</p>
              ) : (
                <div className="review-list">
                  {reviews.slice(0, 5).map((r) => {
                    const reviewer = users.find((u) => u.id === r.fromUserId);
                    return (
                      <div key={r.id} className="review-item">
                        <div className="ri-top">
                          <div
                            className="avatar avatar-sm"
                            style={{ background: getAvatarGradient(reviewer?.id || 0) }}
                          >
                            {reviewer?.name?.charAt(0) || '?'}
                          </div>
                          <div className="ri-info">
                            <span className="ri-name">{reviewer?.name || 'Unknown'}</span>
                            <span className="ri-date">{r.date}</span>
                          </div>
                          <div className="stars">
                            {renderStars(r.rating)}
                          </div>
                        </div>
                        <p className="ri-comment">{r.comment}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
