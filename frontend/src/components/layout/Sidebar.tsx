import React from 'react';
import { BasicProfile } from '../../types/profile';

export type ActiveNavView =
  | 'home'
  | 'compat-engine'
  | 'connections'
  | 'chat'
  | 'profile-intel'
  | 'horoscope-match'
  | 'ai-assistant'
  | 'chat-intel'
  | 'date-planner'
  | 'safety-intel';

interface SidebarProps {
  activeView: ActiveNavView;
  onSelectView: (view: ActiveNavView) => void;
  connectionsCount: number;
  basicProfile: BasicProfile;
  onOpenProfile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onSelectView,
  connectionsCount,
  basicProfile,
  onOpenProfile,
}) => {
  const defaultAvatar =
    basicProfile.gender === 'Male'
      ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'
      : basicProfile.gender === 'LGBTQ+'
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'
      : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80';

  const avatarSrc = basicProfile.avatar_url || defaultAvatar;

  return (
    <aside className="app-sidebar">
      {/* Sidebar Brand - Clicking returns to Home */}
      <div
        className="sidebar-brand clickable"
        onClick={() => onSelectView('home')}
        title="Return to Hey Shona! Home"
        role="button"
        tabIndex={0}
      >
        <div className="sidebar-logo">
          <span>💕</span>
        </div>
        <div className="sidebar-brand-text">
          <h2 className="sidebar-title">Hey Shona!</h2>
          <span className="sidebar-subtitle">AI Dating Platform</span>
        </div>
      </div>

      {/* Main Task Pane Navigation */}
      <nav className="sidebar-nav">
        <div className="sidebar-nav-group">
          <span className="sidebar-group-label">Core Engine</span>

          {/* 1. Discover Compatible People */}
          <button
            type="button"
            className={`sidebar-nav-item ${activeView === 'compat-engine' ? 'active' : ''}`}
            onClick={() => onSelectView('compat-engine')}
          >
            <span className="nav-icon">🌟</span>
            <div className="nav-text-block">
              <span className="nav-title">Discover Matches</span>
              <span className="nav-desc">AI Compatibility Engine</span>
            </div>
            <span className="live-dot" title="Active feature" />
          </button>

          {/* 2. Connections & Chats */}
          <button
            type="button"
            className={`sidebar-nav-item ${activeView === 'connections' || activeView === 'chat' ? 'active' : ''}`}
            onClick={() => onSelectView('connections')}
          >
            <span className="nav-icon">💬</span>
            <div className="nav-text-block">
              <span className="nav-title">My Connections</span>
              <span className="nav-desc">Chats & Alignment</span>
            </div>
            {connectionsCount > 0 && (
              <span className="nav-count-badge">{connectionsCount}</span>
            )}
          </button>

          {/* 3. Profile Intelligence */}
          <button
            type="button"
            className={`sidebar-nav-item ${activeView === 'profile-intel' ? 'active' : ''}`}
            onClick={() => onSelectView('profile-intel')}
          >
            <span className="nav-icon">🧠</span>
            <div className="nav-text-block">
              <span className="nav-title">Profile Intelligence</span>
              <span className="nav-desc">Values & Depth Analyzer</span>
            </div>
            <span className="live-dot" title="Active feature" />
          </button>

          {/* 4. Cupid AI Assistant */}
          <button
            type="button"
            className={`sidebar-nav-item ${activeView === 'ai-assistant' ? 'active' : ''}`}
            onClick={() => onSelectView('ai-assistant')}
          >
            <span className="nav-icon">🏹</span>
            <div className="nav-text-block">
              <span className="nav-title">Cupid AI Assistant</span>
              <span className="nav-desc">Starters & Coaching</span>
            </div>
            <span className="live-dot" title="Active Cupid Assistant" />
          </button>

          {/* 5. Chat Intelligence & Metrics */}
          <button
            type="button"
            className={`sidebar-nav-item ${activeView === 'chat-intel' ? 'active' : ''}`}
            onClick={() => onSelectView('chat-intel')}
          >
            <span className="nav-icon">📊</span>
            <div className="nav-text-block">
              <span className="nav-title">Connection Insights</span>
              <span className="nav-desc">AI-Powered Chat Metrics</span>
            </div>
            <span className="live-dot" title="Active Connection Intelligence" />
          </button>

          {/* 6. AI Personalized Date Planner */}
          <button
            type="button"
            className={`sidebar-nav-item ${activeView === 'date-planner' ? 'active' : ''}`}
            onClick={() => onSelectView('date-planner')}
          >
            <span className="nav-icon">🍷</span>
            <div className="nav-text-block">
              <span className="nav-title">Date Planner</span>
              <span className="nav-desc">Personalized Itineraries</span>
            </div>
            <span className="live-dot" title="Active Date Planner" />
          </button>

          {/* 7. AI Horoscope Matching - Cosmic Connections */}
          <button
            type="button"
            className={`sidebar-nav-item ${activeView === 'horoscope-match' ? 'active' : ''}`}
            onClick={() => onSelectView('horoscope-match')}
          >
            <span className="nav-icon">🔮</span>
            <div className="nav-text-block">
              <span className="nav-title">Horoscope Match</span>
              <span className="nav-desc">Cosmic Connections (Kundli)</span>
            </div>
            <span className="live-dot" title="Active Horoscope Match" />
          </button>
        </div>
      </nav>

      {/* Sidebar Footer: Profile Trigger */}
      <div className="sidebar-footer">
        <button
          type="button"
          className="sidebar-user-pill"
          onClick={onOpenProfile}
          title="Open Profile Settings"
        >
          <div className="user-pill-avatar-wrap">
            <img src={avatarSrc} alt={basicProfile.name} className="user-pill-avatar" />
            <span className="user-pill-dot" />
          </div>
          <div className="user-pill-info">
            <span className="user-pill-name">{basicProfile.name || 'My Profile'}</span>
            <span className="user-pill-meta">{basicProfile.job || 'Click to view'}</span>
          </div>
          <span className="user-pill-arrow">⚙</span>
        </button>
      </div>
    </aside>
  );
};
