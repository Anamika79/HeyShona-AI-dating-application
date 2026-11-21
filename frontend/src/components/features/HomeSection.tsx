import React from 'react';
import { BasicProfile } from '../../types/profile';
import { ActiveNavView } from '../layout/Sidebar';

interface HomeSectionProps {
  basicProfile: BasicProfile;
  connectionsCount: number;
  onNavigate: (view: ActiveNavView) => void;
  onOpenProfile: () => void;
}

export const HomeSection: React.FC<HomeSectionProps> = ({
  basicProfile,
  connectionsCount,
  onNavigate,
  onOpenProfile,
}) => {
  return (
    <div className="home-container">
      {/* Hero Welcome Banner */}
      <div className="home-hero-card">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          <span>Next-Generation AI Dating</span>
        </div>

        <h1 className="home-hero-title">
          Welcome to <span className="gradient-text">Hey Shona!</span> 💕
        </h1>

        <p className="home-hero-subtitle">
          An intentional dating and connection platform optimized for psychological depth, shared core values, and mutual trust rather than superficial swiping.
        </p>

        {/* User Quick Status */}
        <div className="home-user-pill" onClick={onOpenProfile} title="Click to view or edit profile">
          <img
            src={
              basicProfile.avatar_url ||
              'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80'
            }
            alt={basicProfile.name}
            className="home-user-avatar"
          />
          <div className="home-user-info">
            <span className="home-user-name">Welcome back, {basicProfile.name}</span>
            <span className="home-user-meta">{basicProfile.job} • {basicProfile.location}</span>
          </div>
          <span className="home-profile-edit-btn">Edit Profile ✏️</span>
        </div>

        {/* Primary CTA Buttons */}
        <div className="home-hero-actions">
          <button
            type="button"
            className="home-primary-btn"
            onClick={() => onNavigate('compat-engine')}
          >
            <span>🌟 Discover Compatible Matches</span>
          </button>
          <button
            type="button"
            className="home-secondary-btn"
            onClick={() => onNavigate('connections')}
          >
            <span>💬 My Connections ({connectionsCount})</span>
          </button>
        </div>
      </div>

      {/* Active Subsystems Grid */}
      <div className="home-section-block">
        <div className="home-section-header">
          <div>
            <h3 className="section-title">Active AI Modules</h3>
            <p className="section-subtitle">Click on any core module to explore intelligent matching and communication tools.</p>
          </div>
          <span className="live-status-pill">7 Systems Operational</span>
        </div>

        <div className="home-features-grid">
          {/* Card 1: AI Compatibility Engine */}
          <div
            className="home-feature-card"
            onClick={() => onNavigate('compat-engine')}
            role="button"
            tabIndex={0}
          >
            <div className="card-icon-wrap gold">
              <span>🌟</span>
            </div>
            <div className="card-content">
              <div className="card-top-line">
                <h4 className="card-name">AI Compatibility Engine</h4>
                <span className="live-chip">Live</span>
              </div>
              <p className="card-text">
                Multi-dimensional psychological scoring across 5 weighted dimensions (Core Values, Expectations, Communication, Lifestyle, Boundaries).
              </p>
              <span className="card-action-link">Explore Candidate Discovery →</span>
            </div>
          </div>

          {/* Card 2: My Connections & Live Chats */}
          <div
            className="home-feature-card"
            onClick={() => onNavigate('connections')}
            role="button"
            tabIndex={0}
          >
            <div className="card-icon-wrap pink">
              <span>💬</span>
            </div>
            <div className="card-content">
              <div className="card-top-line">
                <h4 className="card-name">My Connections & Live Chat</h4>
                <span className="live-chip">Live</span>
              </div>
              <p className="card-text">
                Browse connected matches with instant profile hover cards and interactive simulated chats with realistic multi-turn banter.
              </p>
              <span className="card-action-link">Open Active Chats ({connectionsCount}) →</span>
            </div>
          </div>

          {/* Card 3: Profile Intelligence */}
          <div
            className="home-feature-card"
            onClick={() => onNavigate('profile-intel')}
            role="button"
            tabIndex={0}
          >
            <div className="card-icon-wrap purple">
              <span>🧠</span>
            </div>
            <div className="card-content">
              <div className="card-top-line">
                <h4 className="card-name">Profile Intelligence</h4>
                <span className="live-chip">Live</span>
              </div>
              <p className="card-text">
                Gemini-powered deep psychological extractor revealing authentic values, lifestyle drivers, and actionable follow-up questions.
              </p>
              <span className="card-action-link">Analyze Profile Depth →</span>
            </div>
          </div>

          {/* Card 4: Cupid AI Dating Assistant */}
          <div
            className="home-feature-card"
            onClick={() => onNavigate('ai-assistant')}
            role="button"
            tabIndex={0}
          >
            <div className="card-icon-wrap red">
              <span>🏹</span>
            </div>
            <div className="card-content">
              <div className="card-top-line">
                <h4 className="card-name">Cupid AI Wingman</h4>
                <span className="live-chip">Live</span>
              </div>
              <p className="card-text">
                Your dedicated dating wingman: icebreaker starters, out-of-topics topic revivers, and customized psychological coaching.
              </p>
              <span className="card-action-link">Consult Cupid Assistant →</span>
            </div>
          </div>

          {/* Card 5: Connection Intelligence (Chat Metrics) */}
          <div
            className="home-feature-card"
            onClick={() => onNavigate('chat-intel')}
            role="button"
            tabIndex={0}
          >
            <div className="card-icon-wrap blue">
              <span>📊</span>
            </div>
            <div className="card-content">
              <div className="card-top-line">
                <h4 className="card-name">Connection Intelligence</h4>
                <span className="live-chip">Live</span>
              </div>
              <p className="card-text">
                Mutual-consent conversation metrics: conversation momentum, participation balance, 5-stage depth evolution, and weekly summaries.
              </p>
              <span className="card-action-link">View Chat Metrics & Insights →</span>
            </div>
          </div>

          {/* Card 6: AI-Powered Personalized Date Planner */}
          <div
            className="home-feature-card"
            onClick={() => onNavigate('date-planner')}
            role="button"
            tabIndex={0}
          >
            <div className="card-icon-wrap red">
              <span>🍷</span>
            </div>
            <div className="card-content">
              <div className="card-top-line">
                <h4 className="card-name">Personalized Date Planner</h4>
                <span className="live-chip">Live</span>
              </div>
              <p className="card-text">
                Curates 3 customized date concepts and structured itineraries honoring both users' dietary habits, hobbies, and energy rhythms.
              </p>
              <span className="card-action-link">Plan a Date Itinerary →</span>
            </div>
          </div>

          {/* Card 7: AI-Powered Horoscope Match – Cosmic Connections */}
          <div
            className="home-feature-card"
            onClick={() => onNavigate('horoscope-match')}
            role="button"
            tabIndex={0}
          >
            <div className="card-icon-wrap purple">
              <span>🔮</span>
            </div>
            <div className="card-content">
              <div className="card-top-line">
                <h4 className="card-name">Cosmic Connections (Kundli Milan)</h4>
                <span className="live-chip">Live</span>
              </div>
              <p className="card-text">
                Traditional Vedic 36-point Ashtakoota compatibility, Kundli upload, Gemini planetary extraction, and Manglik Dosha harmony.
              </p>
              <span className="card-action-link">Explore Astrological Matches →</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
