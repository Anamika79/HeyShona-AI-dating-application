import React, { useState, useEffect } from 'react';
import {
  CandidateCompatibilityCard,
  UserProfileSummary,
  CompatibilityReport,
} from '../../types/compatibility';
import { BasicProfile, LookingForType, ProfileIntelligenceData } from '../../types/profile';
import { Connection } from '../../types/chat';
import { fetchCandidates, fetchCompatibilityReport } from '../../api/compatibility';
import { CupidAssistantModal } from './CupidAssistantModal';
import { CompatibilityReportModal } from './CompatibilityReportModal';

interface CompatibilityEngineSectionProps {
  basicProfile: BasicProfile;
  currentUserData?: ProfileIntelligenceData | null;
  connections: Connection[];
  onConnectCandidate: (candidate: UserProfileSummary) => void;
  onOpenChat: (candidateId: string) => void;
}

const FILTER_OPTIONS: { label: string; value: LookingForType; icon: string }[] = [
  { label: 'Everyone', value: 'Everyone', icon: '💫' },
  { label: 'Female', value: 'Female', icon: '👩' },
  { label: 'Male', value: 'Male', icon: '👨' },
  { label: 'LGBTQ+', value: 'LGBTQ+', icon: '🏳️‍🌈' },
];

export const CompatibilityEngineSection: React.FC<CompatibilityEngineSectionProps> = ({
  basicProfile,
  currentUserData: _currentUserData,
  connections,
  onConnectCandidate,
  onOpenChat,
}) => {
  const [candidates, setCandidates] = useState<CandidateCompatibilityCard[]>([]);
  const [loadingCandidates, setLoadingCandidates] = useState<boolean>(true);
  const [candidateError, setCandidateError] = useState<string | null>(null);

  // Filter state starts from user's anonymous choice
  const [activeFilter, setActiveFilter] = useState<LookingForType>(
    basicProfile.looking_for || 'Everyone'
  );

  // Sync if parent profile's anonymous preference changes
  useEffect(() => {
    if (basicProfile.looking_for) {
      setActiveFilter(basicProfile.looking_for);
    }
  }, [basicProfile.looking_for]);

  // Selected candidate for Cupid Assistant
  const [selectedCupidCandidate, setSelectedCupidCandidate] = useState<UserProfileSummary | null>(null);

  // Selected candidate for Compatibility Report
  const [selectedReportCandidate, setSelectedReportCandidate] = useState<UserProfileSummary | null>(null);
  const [compatReport, setCompatReport] = useState<CompatibilityReport | null>(null);
  const [loadingReport, setLoadingReport] = useState<boolean>(false);
  const [reportError, setReportError] = useState<string | null>(null);

  const handleOpenCompatibilityReport = async (candidate: UserProfileSummary) => {
    setSelectedReportCandidate(candidate);
    setLoadingReport(true);
    setReportError(null);
    setCompatReport(null);

    try {
      const user_a_profile: UserProfileSummary = {
        id: 'current_user',
        name: basicProfile.name,
        age: basicProfile.age,
        gender: basicProfile.gender,
        occupation: basicProfile.job,
        location: basicProfile.location,
        avatar_url: basicProfile.avatar_url || '',
        bio: basicProfile.bio,
        profile_data: _currentUserData || {
          personality_insights: [],
          core_values: [
            { value: 'Authenticity & Transparency', evidence: 'biographical preference', is_explicit: true },
            { value: 'Intellectual Curiosity', evidence: 'biographical preference', is_explicit: true },
          ],
          interests_and_lifestyle: [
            { interest: 'Art Exhibitions', category: 'Culture', evidence: 'biographical statement' },
            { interest: 'Design Systems', category: 'Creative', evidence: 'biographical statement' },
          ],
          relationship_expectations: [
            { expectation: 'Meaningful, respectful emotional depth', evidence: 'biographical statement' },
          ],
          communication_preferences: [
            { preference: 'Thoughtful, regular messages with mutual presence', evidence: 'biographical statement' },
          ],
          personal_boundaries: [
            { boundary: 'Clear communication, respectful pacing', evidence: 'biographical statement' },
          ],
          missing_information: { unknown_aspects: [], recommended_follow_up_questions: [] },
        },
      };

      const report = await fetchCompatibilityReport({
        user_a_profile,
        user_b_profile: candidate,
      });
      setCompatReport(report);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to generate compatibility report';
      setReportError(msg);
    } finally {
      setLoadingReport(false);
    }
  };

  useEffect(() => {
    const loadCandidates = async () => {
      setLoadingCandidates(true);
      setCandidateError(null);
      try {
        const data = await fetchCandidates(activeFilter);
        setCandidates(data);
      } catch (err) {
        setCandidateError(
          err instanceof Error
            ? err.message
            : 'Unable to load discovery profiles.'
        );
      } finally {
        setLoadingCandidates(false);
      }
    };

    loadCandidates();
  }, [activeFilter]);

  const getScoreColorClass = (score: number) => {
    if (score >= 80) return 'score-high';
    if (score >= 65) return 'score-medium';
    return 'score-low';
  };

  return (
    <div className="compat-engine-container">
      <div className="discovery-header">
        <div className="discovery-header-info">
          <span className="discovery-badge">Live Discovery Stream</span>
          <h3 className="discovery-title">Discover Compatible People</h3>
          <p className="discovery-subtitle">
            Profiles ranked dynamically by semantic values alignment, communication synergy, and lifestyle harmony.
          </p>
        </div>
      </div>

      {/* Anonymous Filter Control Bar */}
      <div className="discovery-filter-bar">
        <div className="filter-bar-left">
          <span className="filter-lock-icon">🔒</span>
          <div className="filter-text-group">
            <span className="filter-title">
              Private Matching Preference: <strong>Looking for {activeFilter}</strong>
            </span>
            <span className="filter-subtitle">
              Only you see this filter. It matches candidate profiles based on your anonymous choice.
            </span>
          </div>
        </div>

        <div className="filter-chips">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`filter-chip ${activeFilter === opt.value ? 'active' : ''}`}
              onClick={() => setActiveFilter(opt.value)}
            >
              <span>{opt.icon}</span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {loadingCandidates && (
        <div className="candidates-loading-box">
          <div className="compat-spinner" />
          <p>Calculating live compatibility matrix for {activeFilter} profiles...</p>
        </div>
      )}

      {candidateError && (
        <div className="analyzer-error">
          <span>⚠️</span>
          <div>
            <strong>Error loading discovery profiles:</strong> {candidateError}
          </div>
        </div>
      )}

      {!loadingCandidates && !candidateError && candidates.length === 0 && (
        <div className="candidates-empty-box">
          <p>No profiles found matching current preference. Try selecting "Everyone" above!</p>
        </div>
      )}

      {!loadingCandidates && !candidateError && candidates.length > 0 && (
        <div className="candidates-grid">
          {candidates.map((card) => {
            const { profile, compatibility_score, compatibility_headline } = card;
            const scoreClass = getScoreColorClass(compatibility_score);

            return (
              <div
                key={profile.id}
                className="candidate-card"
                onClick={() => handleOpenCompatibilityReport(profile)}
                title="Click to view 5D compatibility results"
              >
                {/* Photo Header */}
                <div className="candidate-image-wrap">
                  <img
                    src={profile.avatar_url}
                    alt={profile.name}
                    className="candidate-img"
                    loading="lazy"
                  />
                  {/* Floating Compatibility Badge */}
                  <div className={`candidate-compat-pill ${scoreClass}`}>
                    <span className="compat-star">★</span>
                    <span className="compat-pct">{compatibility_score}% Compatible</span>
                  </div>

                  {/* Gender Tag */}
                  {profile.gender && (
                    <span className="candidate-gender-badge">
                      {profile.gender === 'Female' ? '👩 Female' : profile.gender === 'Male' ? '👨 Male' : '🏳️‍🌈 LGBTQ+'}
                    </span>
                  )}
                </div>

                {/* Info Container */}
                <div className="candidate-info">
                  <div className="candidate-name-row">
                    <h4 className="candidate-name">{profile.name}, {profile.age}</h4>
                    <span className="hover-hint-pill">View Report 📊</span>
                  </div>
                  <p className="candidate-meta">{profile.occupation} • {profile.location}</p>
                  <p className="candidate-bio-snippet">{profile.bio}</p>

                  {/* Core Value Pills */}
                  {profile.profile_data.core_values.length > 0 && (
                    <div className="candidate-tags-row">
                      {profile.profile_data.core_values.slice(0, 2).map((val, i) => (
                        <span key={i} className="candidate-val-tag">
                          💎 {val.value}
                        </span>
                      ))}
                      {profile.profile_data.interests_and_lifestyle.slice(0, 1).map((int, i) => (
                        <span key={i} className="candidate-int-tag">
                          🎯 {int.interest}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* AI Headline Insight */}
                  <div className="candidate-insight-box">
                    <span className="insight-sparkle">✨</span>
                    <p className="insight-text">{compatibility_headline}</p>
                  </div>
                </div>

                {/* Actions Row */}
                <div className="candidate-card-actions">
                  <button
                    type="button"
                    className="card-cupid-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCupidCandidate(profile);
                    }}
                    title="Get Cupid wingman advice and icebreakers"
                  >
                    <span>🏹 Cupid Tips</span>
                  </button>
                  {connections.some((c) => c.user.id === profile.id) ? (
                    <button
                      type="button"
                      className="card-connected-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenChat(profile.id);
                      }}
                    >
                      💬 Chat
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="card-connect-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onConnectCandidate(profile);
                      }}
                    >
                      Connect 💕
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detailed Compatibility Report Modal */}
      {selectedReportCandidate && (
        <CompatibilityReportModal
          isOpen={Boolean(selectedReportCandidate)}
          onClose={() => {
            setSelectedReportCandidate(null);
            setCompatReport(null);
          }}
          candidate={selectedReportCandidate}
          report={compatReport}
          loading={loadingReport}
          error={reportError}
          isConnected={Boolean(selectedReportCandidate && connections.some((c) => c.user.id === selectedReportCandidate.id))}
          onConnect={(cand) => {
            onConnectCandidate(cand);
            setSelectedReportCandidate(null);
          }}
          onOpenChat={(id) => {
            onOpenChat(id);
            setSelectedReportCandidate(null);
          }}
        />
      )}

      {/* Cupid AI Assistant Modal */}
      {selectedCupidCandidate && (
        <CupidAssistantModal
          isOpen={Boolean(selectedCupidCandidate)}
          onClose={() => setSelectedCupidCandidate(null)}
          match={selectedCupidCandidate}
          onUseStarter={(_starter) => {
            onConnectCandidate(selectedCupidCandidate);
            onOpenChat(selectedCupidCandidate.id);
          }}
        />
      )}
    </div>
  );
};
