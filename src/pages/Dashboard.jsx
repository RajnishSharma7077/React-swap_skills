import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getAvatarGradient } from '../data/mockData';
import './Dashboard.css';

export default function Dashboard() {
  const { currentUser, sessions, getMatches, users, loading } = useApp();

  if (loading || !currentUser) {
    return (
      <div className="page">
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <div className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 700 }}>Loading Dashboard...</div>
        </div>
      </div>
    );
  }

  const matches = getMatches();
  const upcomingSessions = sessions.filter(
    (s) =>
      s.status === 'upcoming' &&
      (s.teacherId === currentUser.id || s.learnerId === currentUser.id)
  );
  const completedCount = sessions.filter(
    (s) =>
      s.status === 'completed' &&
      (s.teacherId === currentUser.id || s.learnerId === currentUser.id)
  ).length;

  const statCards = [
    { value: currentUser.skillPoints, label: 'Skill Points', icon: '⚡', color: 'var(--amber-400)' },
    { value: currentUser.sessionsCompleted, label: 'Sessions Done', icon: '✅', color: 'var(--emerald-400)' },
    { value: matches.length, label: 'Matches Found', icon: '🤝', color: 'var(--primary-400)' },
    { value: currentUser.rating, label: 'Avg Rating', icon: '⭐', color: 'var(--amber-400)' },
  ];

  return (
    <div className="page" id="dashboard-page">
      <div className="container">
        {/* Welcome */}
        <div className="dash-welcome glass-card">
          <div className="dash-welcome-left">
            <h1 className="page-title">
              Welcome back, <span className="gradient-text">{currentUser.name.split(' ')[0]}</span>!
            </h1>
            <p className="page-subtitle">
              You have {upcomingSessions.length} upcoming session{upcomingSessions.length !== 1 ? 's' : ''} and {matches.filter(m => m.isPerfectMatch).length} perfect matches waiting.
            </p>
          </div>
          <div
            className="avatar avatar-xl"
            style={{ background: getAvatarGradient(currentUser.id) }}
          >
            {currentUser.name.charAt(0)}
          </div>
        </div>

        {/* Stats */}
        <div className="dash-stats">
          {statCards.map((s) => (
            <div key={s.label} className="glass-card stat-card">
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-value" style={{ color: s.color }}>
                {s.value}
              </div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="dash-grid">
          {/* Upcoming Sessions */}
          <div className="dash-section">
            <div className="dash-section-header">
              <h2 className="dash-section-title">Upcoming Sessions</h2>
              <Link to="/sessions" className="btn btn-secondary btn-sm">
                View All
              </Link>
            </div>
            {upcomingSessions.length === 0 ? (
              <div className="glass-card empty-state">
                <div className="empty-icon">📅</div>
                <div className="empty-title">No upcoming sessions</div>
                <div className="empty-desc">
                  Find a match and book your first swap session!
                </div>
              </div>
            ) : (
              <div className="dash-session-list">
                {upcomingSessions.slice(0, 3).map((session) => {
                  const partner = users.find(
                    (u) =>
                      u.id ===
                      (session.teacherId === currentUser.id
                        ? session.learnerId
                        : session.teacherId)
                  );
                  const isTeaching = session.teacherId === currentUser.id;
                  return (
                    <div key={session.id} className="glass-card dash-session-card">
                      <div className="dsc-top">
                        <div
                          className="avatar avatar-sm"
                          style={{ background: getAvatarGradient(partner?.id || 0) }}
                        >
                          {partner?.name?.charAt(0) || '?'}
                        </div>
                        <div className="dsc-info">
                          <div className="dsc-name">{partner?.name || 'Unknown'}</div>
                          <div className="dsc-meta">
                            {isTeaching ? 'Teaching' : 'Learning'}{' '}
                            <strong>{session.skillTaught}</strong>
                          </div>
                        </div>
                        <span className={`dsc-role ${isTeaching ? 'teaching' : 'learning'}`}>
                          {isTeaching ? 'Teaching' : 'Learning'}
                        </span>
                      </div>
                      <div className="dsc-bottom">
                        <span>📅 {new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        <span>🕐 {session.time}</span>
                        <span>⏱ {session.duration}min</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Top Matches */}
          <div className="dash-section">
            <div className="dash-section-header">
              <h2 className="dash-section-title">Top Matches</h2>
              <Link to="/matches" className="btn btn-secondary btn-sm">
                View All
              </Link>
            </div>
            <div className="dash-match-list">
              {matches.slice(0, 3).map((match) => (
                <Link
                  key={match.user.id}
                  to={`/user/${match.user.id}`}
                  className="glass-card dash-match-card"
                >
                  <div className="dmc-top">
                    <div
                      className="avatar"
                      style={{ background: getAvatarGradient(match.user.id) }}
                    >
                      {match.user.name.charAt(0)}
                    </div>
                    <div className="dmc-info">
                      <div className="dmc-name">{match.user.name}</div>
                      <div className="dmc-location">{match.user.location}</div>
                      <div className="dmc-rating">
                        ⭐ {match.user.rating} ({match.user.reviewCount})
                      </div>
                    </div>
                    {match.isPerfectMatch && (
                      <span className="perfect-badge">✨ Perfect</span>
                    )}
                  </div>
                  <div className="dmc-skills">
                    {match.theyTeachMe.length > 0 && (
                      <div className="dmc-skill-row">
                        <span className="dmc-skill-label">Can teach you:</span>
                        <div className="dmc-skill-tags">
                          {match.theyTeachMe.map((s) => (
                            <span key={s} className="skill-badge offer">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {match.iTeachThem.length > 0 && (
                      <div className="dmc-skill-row">
                        <span className="dmc-skill-label">Wants to learn:</span>
                        <div className="dmc-skill-tags">
                          {match.iTeachThem.map((s) => (
                            <span key={s} className="skill-badge want">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Skills Overview */}
        <div className="dash-skills-overview">
          <div className="glass-card dash-skills-card">
            <h3 className="dsk-title">🎓 Skills You Offer</h3>
            <div className="dsk-tags">
              {currentUser.skillsOffered.map((s) => (
                <span key={s} className="skill-badge offer">{s}</span>
              ))}
            </div>
          </div>
          <div className="glass-card dash-skills-card">
            <h3 className="dsk-title">📚 Skills You Want</h3>
            <div className="dsk-tags">
              {currentUser.skillsWanted.map((s) => (
                <span key={s} className="skill-badge want">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
