import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getAvatarGradient } from '../data/mockData';
import './UserProfile.css';

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getUserById, getReviewsForUser, currentUser, users,
    addReview, createSession, loading
  } = useApp();

  if (loading) {
    return (
      <div className="page">
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <div className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 700 }}>Loading User...</div>
        </div>
      </div>
    );
  }

  const user = getUserById(id);
  const reviews = getReviewsForUser(Number(id));
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);

  if (!user) {
    return (
      <div className="page">
        <div className="container">
          <div className="glass-card empty-state">
            <div className="empty-icon">❌</div>
            <div className="empty-title">User not found</div>
            <Link to="/matches" className="btn btn-primary" style={{ marginTop: 16 }}>
              Back to Matches
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < Math.round(rating) ? 'filled' : ''}`}>★</span>
    ));

  // Check skill compatibility
  const theyTeachMe = user.skillsOffered.filter((s) => currentUser.skillsWanted.includes(s));
  const iTeachThem = currentUser.skillsOffered.filter((s) => user.skillsWanted.includes(s));

  return (
    <div className="page" id="user-profile-page">
      <div className="container">
        <button className="btn btn-secondary btn-sm up-back" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="up-layout">
          <div className="up-main">
            {/* Hero Card */}
            <div className="glass-card up-hero">
              <div className="up-hero-top">
                <div
                  className="avatar avatar-xl"
                  style={{ background: getAvatarGradient(user.id) }}
                >
                  {user.name.charAt(0)}
                </div>
                <div className="up-hero-info">
                  <h1 className="up-name">{user.name}</h1>
                  <p className="up-location">📍 {user.location}</p>
                  <div className="up-meta">
                    <span className="up-rating">
                      <span className="stars">{renderStars(user.rating)}</span>
                      <strong>{user.rating}</strong> ({user.reviewCount})
                    </span>
                    <span>⚡ {user.skillPoints} pts</span>
                    <span>{user.sessionsCompleted} sessions</span>
                  </div>
                </div>
              </div>
              <p className="up-bio">{user.bio}</p>
              <div className="up-availability">🕐 <strong>Available:</strong> {user.availability}</div>
              <div className="up-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => setShowBookModal(true)}
                  id="book-session-btn"
                >
                  📅 Book a Swap
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowReviewModal(true)}
                  id="write-review-btn"
                >
                  ⭐ Write Review
                </button>
              </div>
            </div>

            {/* Compatibility */}
            {(theyTeachMe.length > 0 || iTeachThem.length > 0) && (
              <div className="glass-card up-compat">
                <h2 className="up-section-title">✨ Compatibility</h2>
                {theyTeachMe.length > 0 && (
                  <div className="up-compat-row">
                    <span className="up-compat-label">They can teach you:</span>
                    <div className="up-compat-tags">
                      {theyTeachMe.map((s) => (
                        <span key={s} className="skill-badge offer">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                {iTeachThem.length > 0 && (
                  <div className="up-compat-row">
                    <span className="up-compat-label">They want to learn from you:</span>
                    <div className="up-compat-tags">
                      {iTeachThem.map((s) => (
                        <span key={s} className="skill-badge want">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Skills */}
            <div className="up-skills-grid">
              <div className="glass-card up-skill-card">
                <h3 className="up-skill-title">🎓 Skills Offered</h3>
                <div className="up-skill-tags">
                  {user.skillsOffered.map((s) => (
                    <span key={s} className="skill-badge offer">{s}</span>
                  ))}
                </div>
              </div>
              <div className="glass-card up-skill-card">
                <h3 className="up-skill-title">📚 Wants to Learn</h3>
                <div className="up-skill-tags">
                  {user.skillsWanted.map((s) => (
                    <span key={s} className="skill-badge want">{s}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="glass-card up-reviews">
              <h2 className="up-section-title">Reviews ({reviews.length})</h2>
              {reviews.length === 0 ? (
                <p className="up-no-reviews">No reviews yet. Be the first!</p>
              ) : (
                <div className="up-review-list">
                  {reviews.map((r) => {
                    const reviewer = users.find((u) => u.id === r.fromUserId);
                    return (
                      <div key={r.id} className="up-review-item">
                        <div className="up-ri-top">
                          <div
                            className="avatar avatar-sm"
                            style={{ background: getAvatarGradient(reviewer?.id || 0) }}
                          >
                            {reviewer?.name?.charAt(0) || '?'}
                          </div>
                          <div className="up-ri-info">
                            <span className="up-ri-name">{reviewer?.name || 'Unknown'}</span>
                            <span className="up-ri-date">{r.date}</span>
                          </div>
                          <div className="stars">{renderStars(r.rating)}</div>
                        </div>
                        <p className="up-ri-comment">{r.comment}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <ReviewModal
          userId={user.id}
          userName={user.name}
          onClose={() => setShowReviewModal(false)}
          onSubmit={addReview}
        />
      )}

      {/* Book Modal */}
      {showBookModal && (
        <QuickBookModal
          user={user}
          currentUser={currentUser}
          onClose={() => setShowBookModal(false)}
          onCreate={createSession}
        />
      )}
    </div>
  );
}

function ReviewModal({ userId, userName, onClose, onSubmit }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hover, setHover] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ toUserId: userId, rating, comment });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Review {userName}</h2>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="review-form">
          <div className="form-group">
            <label className="form-label">Rating</label>
            <div className="star-picker">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`star-pick ${s <= (hover || rating) ? 'active' : ''}`}
                  onClick={() => setRating(s)}
                  onMouseEnter={() => setHover(s)}
                  onMouseLeave={() => setHover(0)}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Comment</label>
            <textarea
              className="form-textarea"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              required
              rows={4}
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" id="submit-review">Submit Review</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function QuickBookModal({ user, currentUser, onClose, onCreate }) {
  const [form, setForm] = useState({
    skillTaught: currentUser.skillsOffered[0] || '',
    skillExchanged: user.skillsOffered[0] || '',
    date: '',
    time: '10:00',
    duration: 60,
    notes: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({
      teacherId: currentUser.id,
      learnerId: user.id,
      ...form,
      duration: Number(form.duration),
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Book with {user.name}</h2>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="session-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">You Teach</label>
              <input
                type="text"
                className="form-input"
                value={form.skillTaught}
                onChange={(e) => setForm({ ...form, skillTaught: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">They Teach</label>
              <input
                type="text"
                className="form-input"
                value={form.skillExchanged}
                onChange={(e) => setForm({ ...form, skillExchanged: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Date</label>
              <input type="date" className="form-input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Time</label>
              <input type="time" className="form-input" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Duration</label>
            <select className="form-select" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })}>
              <option value="30">30 min</option>
              <option value="45">45 min</option>
              <option value="60">60 min</option>
              <option value="90">90 min</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea className="form-textarea" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Topics to cover..." rows={3} />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" id="quick-book-submit">Book Session</button>
          </div>
        </form>
      </div>
    </div>
  );
}
