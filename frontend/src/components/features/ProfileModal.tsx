import React from 'react';
import { BasicProfile, ProfileIntelligenceData } from '../../types/profile';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  basicProfile: BasicProfile;
  intelligenceData: ProfileIntelligenceData | null;
  onEditBasicProfile: () => void;
  onElaborateWithAI?: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  basicProfile,
  intelligenceData,
  onEditBasicProfile,
  onElaborateWithAI,
}) => {
  if (!isOpen) return null;

  const defaultAvatar =
    basicProfile.gender === 'Male'
      ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
      : basicProfile.gender === 'LGBTQ+'
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
      : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80';

  const avatarSrc = basicProfile.avatar_url || defaultAvatar;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close profile">
          ✕
        </button>

        {/* Profile Card Header */}
        <div className="profile-banner">
          <div className="profile-avatar-wrap">
            <img
              src={avatarSrc}
              alt={basicProfile.name}
              className="profile-avatar-img"
            />
            <span className="profile-online-dot" title="Active now" />
          </div>
        </div>

        <div className="profile-content">
          {/* Option to Build / Edit Basic Profile */}
          <div className="profile-top-build-banner">
            <div className="banner-left-info">
              <span className="banner-sparkle-icon">✨</span>
              <div className="banner-text-col">
                <span className="banner-title">Basic Profile Info</span>
                <span className="banner-desc">Configure your identity & anonymous matching preferences</span>
              </div>
            </div>
            <button
              type="button"
              className="banner-build-btn"
              onClick={() => {
                onClose();
                onEditBasicProfile();
              }}
            >
              ✏️ Build / Edit Profile
            </button>
          </div>

          <div className="profile-name-section">
            <div className="profile-name-row">
              <h2 className="profile-name">
                {basicProfile.name}, {basicProfile.age}
              </h2>
              <span className="profile-gender-pill">
                {basicProfile.gender === 'Female' ? '👩 Female' : basicProfile.gender === 'Male' ? '👨 Male' : '🏳️‍🌈 LGBTQ+'}
              </span>
              <span className="profile-verified-badge" title="Verified Profile">
                ✓ Verified
              </span>
            </div>
            <p className="profile-headline">
              {basicProfile.job} • {basicProfile.location}
            </p>
          </div>

          <div className="profile-section-divider" />

          {/* Quick Bio Summary */}
          <div className="profile-brief-block">
            <div className="section-title-row">
              <h4 className="profile-section-title">About Me (In Brief)</h4>
              <button
                type="button"
                className="edit-profile-link-btn"
                onClick={() => {
                  onClose();
                  onEditBasicProfile();
                }}
              >
                ✏️ Edit Info
              </button>
            </div>
            <p className="profile-bio-text">
              {basicProfile.bio || 'Passionate about authentic conversations, personal growth, and intentional connection.'}
            </p>
          </div>

          {/* Note: Anonymous "Looking for" preference is strictly kept private and NEVER shown here! */}

          {/* AI-Extracted Profile Highlights (What other users see in brief) */}
          {intelligenceData ? (
            <div className="profile-intelligence-summary">
              <div className="ai-status-row">
                <span className="ai-status-badge">✨ AI-Elaborated Dimensions</span>
              </div>

              {/* Values */}
              {intelligenceData.core_values.length > 0 && (
                <div className="profile-summary-row">
                  <span className="summary-label">💎 Core Values</span>
                  <div className="summary-tags">
                    {intelligenceData.core_values.slice(0, 4).map((v, i) => (
                      <span key={i} className="public-tag value-tag">
                        {v.value}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Interests */}
              {intelligenceData.interests_and_lifestyle.length > 0 && (
                <div className="profile-summary-row">
                  <span className="summary-label">🎯 Key Passions</span>
                  <div className="summary-tags">
                    {intelligenceData.interests_and_lifestyle.slice(0, 5).map((item, i) => (
                      <span key={i} className="public-tag interest-tag">
                        {item.interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Communication */}
              {intelligenceData.communication_preferences.length > 0 && (
                <div className="profile-summary-row">
                  <span className="summary-label">💬 Communication</span>
                  <p className="summary-text">
                    {intelligenceData.communication_preferences[0].preference}
                  </p>
                </div>
              )}

              {/* Relationship Goals */}
              {intelligenceData.relationship_expectations.length > 0 && (
                <div className="profile-summary-row">
                  <span className="summary-label">🤝 Intentions</span>
                  <p className="summary-text">
                    {intelligenceData.relationship_expectations[0].expectation}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="profile-empty-summary">
              <span className="empty-sparkle">✨</span>
              <p>
                Want richer profile insights? Run the <strong>AI Profile Intelligence Analyzer</strong> to elaborate your psychological dimensions, core values, and communication habits.
              </p>
              {onElaborateWithAI && (
                <button
                  type="button"
                  className="elaborate-now-btn"
                  onClick={() => {
                    onClose();
                    onElaborateWithAI();
                  }}
                >
                  🚀 Elaborate Profile with AI
                </button>
              )}
            </div>
          )}

          <div className="profile-actions-row">
            <button
              type="button"
              className="profile-edit-btn"
              onClick={() => {
                onClose();
                onEditBasicProfile();
              }}
            >
              ✏️ Edit Basic Profile
            </button>
            <button type="button" className="profile-connect-btn" onClick={onClose}>
              Done Viewing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
