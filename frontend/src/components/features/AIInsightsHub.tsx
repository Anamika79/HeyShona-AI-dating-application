import React, { useState } from 'react';
import { Brain, BarChart3, Moon } from 'lucide-react';
import { BasicProfile, ProfileIntelligenceData } from '../../types/profile';
import { Connection } from '../../types/chat';
import { UserProfileSummary } from '../../types/compatibility';
import { ProfileIntelligenceSection } from './ProfileIntelligenceSection';
import { HoroscopeMatchSection } from './HoroscopeMatchSection';

interface AIInsightsHubProps {
  basicProfile: BasicProfile;
  connections: Connection[];
  onUpdateExtractedData?: (data: ProfileIntelligenceData) => void;
  onConnectCandidate: (candidate: UserProfileSummary) => void;
  onOpenChat: (candidateId: string) => void;
  initialTab?: 'profile-intel' | 'connection-metrics' | 'horoscope';
}

export const AIInsightsHub: React.FC<AIInsightsHubProps> = ({
  basicProfile,
  connections,
  onUpdateExtractedData,
  onConnectCandidate,
  onOpenChat,
  initialTab = 'profile-intel',
}) => {
  const [activeTab, setActiveTab] = useState<'profile-intel' | 'connection-metrics' | 'horoscope'>(initialTab);

  return (
    <div className="ai-insights-hub">
      {/* Sub-Tabs Navigation */}
      <div className="subsystem-tabs-bar">
        <button
          type="button"
          className={`subsystem-tab-btn ${activeTab === 'profile-intel' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile-intel')}
        >
          <Brain size={16} />
          <span>Profile Intelligence</span>
        </button>

        <button
          type="button"
          className={`subsystem-tab-btn ${activeTab === 'connection-metrics' ? 'active' : ''}`}
          onClick={() => setActiveTab('connection-metrics')}
        >
          <BarChart3 size={16} />
          <span>Connection Insights</span>
        </button>

        <button
          type="button"
          className={`subsystem-tab-btn ${activeTab === 'horoscope' ? 'active' : ''}`}
          onClick={() => setActiveTab('horoscope')}
        >
          <Moon size={16} />
          <span>Horoscope Synastry (Optional)</span>
        </button>
      </div>

      {/* Tab 1: Profile Intelligence */}
      {activeTab === 'profile-intel' && (
        <div>
          <ProfileIntelligenceSection
            basicProfile={basicProfile}
            onUpdateExtractedData={onUpdateExtractedData}
          />
        </div>
      )}

      {/* Tab 2: Connection Insights Overview */}
      {activeTab === 'connection-metrics' && (
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-light)', borderRadius: '16px', padding: '28px', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--color-rose-light)', color: 'var(--color-rose)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BarChart3 size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '20px' }}>Connection Insights & Chat Metrics</h3>
              <p style={{ margin: '2px 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
                Mutual communication cadence, response equality, and emotional alignment
              </p>
            </div>
          </div>

          <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6, maxWidth: '750px' }}>
            Connection Intelligence only analyzes conversations where both participants have explicitly consented. It provides transparent metrics on balance, emotional tone, and conversation starters without surveillance.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '24px' }}>
            {connections.map((conn) => (
              <div
                key={conn.id}
                style={{
                  background: 'var(--bg-surface-subtle)',
                  border: '1px solid var(--border-light)',
                  borderRadius: '12px',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img
                    src={conn.user.avatar_url}
                    alt={conn.user.name}
                    style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>{conn.user.name}</h4>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{conn.user.occupation}</span>
                  </div>
                </div>

                <div style={{ background: 'var(--bg-surface)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '12.5px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Response Cadence:</span>
                    <strong style={{ color: 'var(--color-sage)' }}>Balanced (1.2x)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Mutual Sentiment:</span>
                    <strong style={{ color: 'var(--color-rose)' }}>94% Positive</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Consent Status:</span>
                    <span style={{ color: 'var(--color-sage)', fontWeight: 600 }}>Mutual Consent Verified ✓</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="card-connect-btn"
                  onClick={() => onOpenChat(conn.user.id)}
                  style={{ width: '100%', marginTop: '4px' }}
                >
                  Open Chat & View Full Report
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Horoscope Match */}
      {activeTab === 'horoscope' && (
        <div>
          <HoroscopeMatchSection
            onConnectCandidate={onConnectCandidate}
            connectedCandidateIds={connections.map((c) => c.user.id)}
            onOpenChat={onOpenChat}
          />
        </div>
      )}
    </div>
  );
};
