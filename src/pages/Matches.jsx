import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getAvatarGradient, ALL_SKILLS } from '../data/mockData';
import './Matches.css';

export default function Matches() {
  const { getMatches, loading } = useApp();

  if (loading) {
    return (
      <div className="page">
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <div className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 700 }}>Finding Matches...</div>
        </div>
      </div>
    );
  }

  const allMatches = getMatches();
  const [filter, setFilter] = useState('all');
  const [searchSkill, setSearchSkill] = useState('');

  const filtered = allMatches.filter((m) => {
    if (filter === 'perfect' && !m.isPerfectMatch) return false;
    if (filter === 'canTeach' && m.theyTeachMe.length === 0) return false;
    if (filter === 'wantsToLearn' && m.iTeachThem.length === 0) return false;
    if (searchSkill) {
      const skill = searchSkill.toLowerCase();
      const hasSkill =
        m.theyTeachMe.some((s) => s.toLowerCase().includes(skill)) ||
        m.iTeachThem.some((s) => s.toLowerCase().includes(skill)) ||
        m.user.skillsOffered.some((s) => s.toLowerCase().includes(skill));
      if (!hasSkill) return false;
    }
    return true;
  });

  return (
    <div className="page" id="matches-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            Find Your <span className="gradient-text">Match</span>
          </h1>
          <p className="page-subtitle">
            Discover people with complementary skills for perfect learning swaps.
          </p>
        </div>

        {/* Filters */}
        <div className="match-filters">
          <div className="tabs">
            {[
              { key: 'all', label: `All (${allMatches.length})` },
              { key: 'perfect', label: `Perfect Matches (${allMatches.filter((m) => m.isPerfectMatch).length})` },
              { key: 'canTeach', label: 'Can Teach Me' },
              { key: 'wantsToLearn', label: 'Wants My Skills' },
            ].map((t) => (
              <button
                key={t.key}
                className={`tab ${filter === t.key ? 'active' : ''}`}
                onClick={() => setFilter(t.key)}
                id={`filter-${t.key}`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <input
            type="text"
            className="form-input match-search"
            placeholder="Search by skill..."
            value={searchSkill}
            onChange={(e) => setSearchSkill(e.target.value)}
            id="match-search-input"
          />
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="glass-card empty-state">
            <div className="empty-icon">🔍</div>
            <div className="empty-title">No matches found</div>
            <div className="empty-desc">
              Try adjusting your filters or adding more skills to your profile.
            </div>
          </div>
        ) : (
          <div className="grid-3">
            {filtered.map((match) => (
              <Link
                key={match.user.id}
                to={`/user/${match.user.id}`}
                className="glass-card match-card"
                id={`match-${match.user.id}`}
              >
                <div className="mc-header">
                  <div
                    className="avatar avatar-lg"
                    style={{ background: getAvatarGradient(match.user.id) }}
                  >
                    {match.user.name.charAt(0)}
                  </div>
                  <div className="mc-score">
                    <span className="mc-score-value">{match.matchScore}</span>
                    <span className="mc-score-label">Match Score</span>
                  </div>
                </div>

                <div className="mc-body">
                  <div className="mc-name-row">
                    <h3 className="mc-name">{match.user.name}</h3>
                    {match.isPerfectMatch && (
                      <span className="perfect-badge">✨ Perfect Match</span>
                    )}
                  </div>
                  <p className="mc-location">{match.user.location}</p>
                  <div className="mc-rating-row">
                    <span className="mc-rating">⭐ {match.user.rating}</span>
                    <span className="mc-reviews">({match.user.reviewCount} reviews)</span>
                    <span className="mc-sessions">{match.user.sessionsCompleted} sessions</span>
                  </div>

                  {match.theyTeachMe.length > 0 && (
                    <div className="mc-skill-section">
                      <span className="mc-skill-heading">🎓 Can teach you</span>
                      <div className="mc-skill-tags">
                        {match.theyTeachMe.map((s) => (
                          <span key={s} className="skill-badge offer">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {match.iTeachThem.length > 0 && (
                    <div className="mc-skill-section">
                      <span className="mc-skill-heading">📚 Wants from you</span>
                      <div className="mc-skill-tags">
                        {match.iTeachThem.map((s) => (
                          <span key={s} className="skill-badge want">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mc-footer">
                  <span className="mc-points">⚡ {match.user.skillPoints} pts</span>
                  <span className="mc-view">View Profile →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
