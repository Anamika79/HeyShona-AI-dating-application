import React from 'react';
import { StatusVariant } from '../common/StatusBadge';
import { BasicProfile } from '../../types/profile';

interface HeaderProps {
  systemStatus?: {
    label: string;
    variant: StatusVariant;
  };
  basicProfile?: BasicProfile;
  onOpenProfile?: () => void;
  onGoHome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  basicProfile,
  onOpenProfile,
  onGoHome,
}) => {
  const defaultAvatar =
    basicProfile?.gender === 'Male'
      ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'
      : basicProfile?.gender === 'LGBTQ+'
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'
      : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80';

  const avatarSrc = basicProfile?.avatar_url || defaultAvatar;

  return (
    <header className="app-header">
      <div className="app-header__container">
        {/* Left Section: Brand - Clicking returns to Home */}
        <div className="app-header__left">
          <div
            className="app-header__brand clickable"
            onClick={onGoHome}
            title="Return to Hey Shona! Home"
            role="button"
            tabIndex={0}
          >
            <div className="app-header__logo">
              <span role="img" aria-label="heart-sparkles">💕</span>
            </div>
            <div className="app-header__title-group">
              <h1 className="app-header__title">Hey Shona!</h1>
              <span className="app-header__tagline">Optimized for depth, compatibility & trust</span>
            </div>
          </div>
        </div>

        {/* Right Section: Demo Video & Profile Icon */}
        <div className="app-header__right" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <a
            href="/demo-video.html"
            target="_blank"
            rel="noopener noreferrer"
            className="header-demo-video-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(139, 92, 246, 0.2))',
              border: '1px solid rgba(236, 72, 153, 0.5)',
              color: '#f472b6',
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
            title="Watch 3-minute feature demo video with female voiceover"
          >
            <span>🎬</span> 3-Min Demo Video
          </a>
          {onOpenProfile && (
            <button
              type="button"
              className="header-profile-icon-only-btn"
              onClick={onOpenProfile}
              title="Profile & Settings"
              aria-label="Profile & Settings"
            >
              <img
                src={avatarSrc}
                alt="Profile Icon"
                className="header-profile-avatar"
              />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
