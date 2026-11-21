import React from 'react';
import { Connection } from '../../types/chat';
import { ProfileHoverCard } from '../common/ProfileHoverCard';

interface ConnectionsSectionProps {
  connections: Connection[];
  onOpenChat: (candidateId: string) => void;
  onExploreDiscovery: () => void;
}

export const ConnectionsSection: React.FC<ConnectionsSectionProps> = ({
  connections,
  onOpenChat,
  onExploreDiscovery,
}) => {
  return (
    <div className="connections-section-container">
      <div className="connections-header">
        <div>
          <div className="discovery-badge">Active Connections</div>
          <h3 className="discovery-title">People You’ve Connected With ({connections.length})</h3>
          <p className="discovery-subtitle">
            Hover over any profile to view their brief compatibility summary, or start a live conversation!
          </p>
        </div>

        <button className="explore-more-btn" onClick={onExploreDiscovery}>
          🔍 Discover More Profiles
        </button>
      </div>

      {connections.length === 0 ? (
        <div className="connections-empty-card">
          <div className="empty-icon">🤝</div>
          <h4>No Connections Yet</h4>
          <p>
            Browse the <strong>AI Compatibility Engine</strong> on the left, check your values alignment, and click <strong>"Connect 💕"</strong> to add candidates here.
          </p>
          <button className="primary-discovery-btn" onClick={onExploreDiscovery}>
            ✨ Start Exploring Candidates
          </button>
        </div>
      ) : (
        <div className="connections-grid">
          {connections.map((conn) => {
            const { user } = conn;
            return (
              <div key={conn.id} className="connection-card">
                <ProfileHoverCard user={user} compatibilityScore={88}>
                  <div className="conn-avatar-row">
                    <div className="conn-avatar-wrap">
                      <img
                        src={user.avatar_url}
                        alt={user.name}
                        className="conn-avatar-img"
                      />
                      <span className="conn-online-dot" />
                    </div>

                    <div className="conn-details">
                      <div className="conn-name-row">
                        <h4 className="conn-name">{user.name}, {user.age}</h4>
                        {user.gender && (
                          <span className="conn-gender-tag">
                            {user.gender === 'Female' ? '👩 Female' : user.gender === 'Male' ? '👨 Male' : '🏳️‍🌈 LGBTQ+'}
                          </span>
                        )}
                      </div>
                      <p className="conn-meta">{user.occupation} • {user.location}</p>
                      <span className="conn-time-badge">Connected {conn.connectedAt}</span>
                    </div>
                  </div>
                </ProfileHoverCard>

                <p className="conn-bio-snippet">{user.bio}</p>

                {/* Values Tags */}
                {user.profile_data.core_values.length > 0 && (
                  <div className="conn-tags-row">
                    {user.profile_data.core_values.slice(0, 2).map((val, i) => (
                      <span key={i} className="candidate-val-tag">
                        💎 {val.value}
                      </span>
                    ))}
                    {user.profile_data.interests_and_lifestyle.slice(0, 1).map((item, i) => (
                      <span key={i} className="candidate-int-tag">
                        🎯 {item.interest}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="conn-actions-row">
                  <button
                    type="button"
                    className="conn-chat-btn"
                    onClick={() => onOpenChat(user.id)}
                  >
                    💬 Start Chatting
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
