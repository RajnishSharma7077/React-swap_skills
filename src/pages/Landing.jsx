import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getAvatarGradient } from '../data/mockData';
import './Landing.css';

export default function Landing() {
  const { users } = useApp();

  const stats = [
    { value: '2.4K+', label: 'Active Learners' },
    { value: '180+', label: 'Skills Available' },
    { value: '15K+', label: 'Sessions Completed' },
    { value: '4.9', label: 'Avg Rating' },
  ];

  const features = [
    {
      icon: '🔄',
      title: 'Skill Exchange',
      desc: 'Trade your expertise for new knowledge. No money needed — just mutual learning.',
    },
    {
      icon: '🤝',
      title: 'Smart Matching',
      desc: 'Our algorithm finds people with complementary skills who are perfect swap partners.',
    },
    {
      icon: '📅',
      title: 'Easy Scheduling',
      desc: 'Book, reschedule, or cancel sessions with a few clicks. Full CRUD control.',
    },
    {
      icon: '⭐',
      title: 'Reputation System',
      desc: 'Build your profile with reviews and Skill Points. Quality learners rise to the top.',
    },
  ];

  const steps = [
    { num: '01', title: 'Create Profile', desc: 'List what you can teach and what you want to learn.' },
    { num: '02', title: 'Get Matched', desc: 'Find learners with complementary skill sets.' },
    { num: '03', title: 'Book a Swap', desc: 'Schedule a peer learning session at your convenience.' },
    { num: '04', title: 'Learn & Earn', desc: 'Complete sessions and earn Skill Points & reviews.' },
  ];

  return (
    <div className="landing" id="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg-orb hero-orb-1" />
        <div className="hero-bg-orb hero-orb-2" />
        <div className="container hero-content">
          <div className="hero-badge animate-fade-in">
            <span className="badge-dot" />
            Peer-to-Peer Learning Network
          </div>
          <h1 className="hero-title animate-fade-in">
            Trade Skills,<br />
            Not <span className="gradient-text">Money</span>
          </h1>
          <p className="hero-subtitle animate-fade-in">
            Connect with learners worldwide. Teach what you know, learn what you
            don't. SkillSwap makes peer education free, fun, and rewarding.
          </p>
          <div className="hero-actions animate-fade-in">
            <Link to="/dashboard" className="btn btn-primary btn-lg" id="hero-cta">
              Start Swapping
              <span>→</span>
            </Link>
            <Link to="/matches" className="btn btn-secondary btn-lg" id="hero-explore">
              Explore Matches
            </Link>
          </div>

          {/* Floating User Avatars */}
          <div className="hero-avatars animate-fade-in">
            {users.slice(0, 5).map((u, i) => (
              <div
                key={u.id}
                className="hero-avatar-bubble"
                style={{
                  background: getAvatarGradient(u.id),
                  animationDelay: `${i * 0.2}s`,
                }}
                title={u.name}
              >
                {u.name.charAt(0)}
              </div>
            ))}
            <div className="hero-avatar-count">+2.4K learners</div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="stats-bar">
        <div className="container">
          <div className="stats-grid">
            {stats.map((s) => (
              <div key={s.label} className="stat-item">
                <span className="stat-item-value">{s.value}</span>
                <span className="stat-item-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section" id="features">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              Why <span className="gradient-text">SkillSwap</span>?
            </h2>
            <p className="section-subtitle">
              Everything you need for effective peer learning, built into one platform.
            </p>
          </div>
          <div className="features-grid">
            {features.map((f) => (
              <div key={f.title} className="feature-card glass-card">
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-section" id="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="section-subtitle">Four simple steps to start learning.</p>
          </div>
          <div className="steps-grid">
            {steps.map((s, i) => (
              <div key={s.num} className="step-card" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="step-num">{s.num}</div>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
                {i < steps.length - 1 && <div className="step-connector" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <h2 className="cta-title">Ready to start swapping skills?</h2>
            <p className="cta-desc">
              Join thousands of learners exchanging knowledge every day.
            </p>
            <Link to="/dashboard" className="btn btn-primary btn-lg" id="cta-bottom">
              Get Started Free →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-inner">
          <p className="footer-text">
            © 2025 SkillSwap. Built with 💜 for learners everywhere.
          </p>
        </div>
      </footer>
    </div>
  );
}
