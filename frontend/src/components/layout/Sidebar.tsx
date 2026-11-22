import React from 'react';
import {
  Compass,
  HeartHandshake,
  Sparkles,
  Bot,
  User,
  Shield,
  Sun,
  Moon,
} from 'lucide-react';
import { BasicProfile } from '../../types/profile';

export type PrimaryDestination =
  | 'discover'
  | 'connections'
  | 'ai-insights'
  | 'shona-ai'
  | 'profile'
  | 'settings';

export type ActiveNavView = PrimaryDestination | string;

interface SidebarProps {
  activeDestination: PrimaryDestination;
  onSelectDestination: (dest: PrimaryDestination) => void;
  connectionsCount: number;
  basicProfile: BasicProfile;
  currentTheme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeDestination,
  onSelectDestination,
  connectionsCount,
  basicProfile,
  currentTheme,
  onToggleTheme,
}) => {
  const defaultAvatar =
    basicProfile.gender === 'Male'
      ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'
      : basicProfile.gender === 'LGBTQ+'
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'
      : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80';

  const avatarSrc = basicProfile.avatar_url || defaultAvatar;

  const navItems: { id: PrimaryDestination; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'discover',
      label: 'Discover',
      icon: <Compass size={19} />,
    },
    {
      id: 'connections',
      label: 'Connections',
      icon: <HeartHandshake size={19} />,
      badge: connectionsCount > 0 ? connectionsCount : undefined,
    },
    {
      id: 'ai-insights',
      label: 'AI Insights',
      icon: <Sparkles size={19} />,
    },
    {
      id: 'shona-ai',
      label: 'Shona AI',
      icon: <Bot size={19} />,
    },
    {
      id: 'profile',
      label: 'My Profile',
      icon: <User size={19} />,
    },
  ];

  return (
    <aside className="app-sidebar">
      {/* Brand Header */}
      <div
        className="sidebar-brand"
        onClick={() => onSelectDestination('discover')}
        role="button"
        tabIndex={0}
      >
        <div className="sidebar-logo-icon">💫</div>
        <div className="sidebar-brand-text">
          <h2>Hey Shona!</h2>
          <span>Intentional Dating</span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="sidebar-nav">
        <span className="sidebar-nav-label">Main Menu</span>
        {navItems.map((item) => {
          const isActive = activeDestination === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`sidebar-nav-btn ${isActive ? 'active' : ''}`}
              onClick={() => onSelectDestination(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.badge !== undefined && (
                <span className="sidebar-badge">{item.badge}</span>
              )}
            </button>
          );
        })}

        <span className="sidebar-nav-label" style={{ marginTop: '16px' }}>Account & Trust</span>
        <button
          type="button"
          className={`sidebar-nav-btn ${activeDestination === 'settings' ? 'active' : ''}`}
          onClick={() => onSelectDestination('settings')}
        >
          <span className="nav-icon"><Shield size={19} /></span>
          <span>Settings & Safety</span>
        </button>
      </nav>

      {/* Footer Controls: Theme Toggle & User Pill */}
      <div className="sidebar-footer">
        <button
          type="button"
          className="theme-toggle-btn"
          onClick={onToggleTheme}
          title={`Switch to ${currentTheme === 'light' ? 'Dark' : 'Light'} theme`}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {currentTheme === 'light' ? <Sun size={15} color="#D9668D" /> : <Moon size={15} color="#E9D5DF" />}
            <span>{currentTheme === 'light' ? 'Light Theme' : 'Dark Theme'}</span>
          </span>
          <span style={{ fontSize: '11px', opacity: 0.7 }}>Toggle</span>
        </button>

        <button
          type="button"
          className="sidebar-nav-btn"
          onClick={() => onSelectDestination('profile')}
          style={{ padding: '8px 10px', marginTop: '4px' }}
        >
          <img
            src={avatarSrc}
            alt={basicProfile.name}
            style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', textAlign: 'left' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>
              {basicProfile.name}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              Relationship Blueprint
            </span>
          </div>
        </button>
      </div>
    </aside>
  );
};
