import React, { useState, useRef } from 'react';
import { UserProfileSummary } from '../../types/compatibility';

interface ProfileHoverCardProps {
  user: UserProfileSummary;
  compatibilityScore?: number;
  children: React.ReactNode;
}

export const ProfileHoverCard: React.FC<ProfileHoverCardProps> = ({
  user,
  compatibilityScore = 88,
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, 180);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 150);
  };

  return (
    <div
      className="profile-hover-target"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      {isVisible && (
        <div className="profile-hover-popover" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          {/* Header Row */}
          <div className="hover-popover-header">
            <img src={user.avatar_url} alt={user.name} className="hover-popover-avatar" />
            <div className="hover-popover-meta">
              <div className="hover-name-row">
                <span className="hover-name">{user.name}, {user.age}</span>
                <span className="hover-score-pill">★ {compatibilityScore}%</span>
              </div>
              <span className="hover-job">{user.occupation}</span>
              <span className="hover-loc">{user.location}</span>
            </div>
          </div>

          <p className="hover-bio">{user.bio}</p>

          <div className="hover-divider" />

          {/* Compatibility Highlights */}
          <div className="hover-highlights">
            {user.profile_data.core_values.length > 0 && (
              <div className="hover-row">
                <span className="hover-tag-label">💎 Values</span>
                <div className="hover-tags">
                  {user.profile_data.core_values.slice(0, 2).map((v, i) => (
                    <span key={i} className="hover-tag value-tag">{v.value}</span>
                  ))}
                </div>
              </div>
            )}

            {user.profile_data.interests_and_lifestyle.length > 0 && (
              <div className="hover-row">
                <span className="hover-tag-label">🎯 Passions</span>
                <div className="hover-tags">
                  {user.profile_data.interests_and_lifestyle.slice(0, 2).map((item, i) => (
                    <span key={i} className="hover-tag interest-tag">{item.interest}</span>
                  ))}
                </div>
              </div>
            )}

            {user.profile_data.communication_preferences.length > 0 && (
              <div className="hover-row">
                <span className="hover-tag-label">💬 Vibe</span>
                <span className="hover-text-val">
                  {user.profile_data.communication_preferences[0].preference}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
