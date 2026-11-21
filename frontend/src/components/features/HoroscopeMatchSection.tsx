import React, { useState, useEffect } from 'react';
import {
  HoroscopeProfile,
  HoroscopeMatchCard,
  HoroscopeReportResponse,
  BirthDetails,
} from '../../types/horoscope';
import { UserProfileSummary } from '../../types/compatibility';
import {
  fetchUserHoroscope,
  saveUserHoroscope,
  fetchHoroscopeMatches,
  fetchHoroscopeReport,
} from '../../api/horoscope';
import { HoroscopeUploadModal } from './HoroscopeUploadModal';
import { HoroscopeReportModal } from './HoroscopeReportModal';

interface HoroscopeMatchSectionProps {
  onConnectCandidate: (candidate: UserProfileSummary) => void;
  connectedCandidateIds: string[];
  onOpenChat: (candidateId: string) => void;
}

export const HoroscopeMatchSection: React.FC<HoroscopeMatchSectionProps> = ({
  onConnectCandidate,
  connectedCandidateIds,
  onOpenChat,
}) => {
  const [profile, setProfile] = useState<HoroscopeProfile | null>(null);
  const [matches, setMatches] = useState<HoroscopeMatchCard[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'exceptional' | 'high' | 'manglik'>('all');

  // Modals
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [selectedReport, setSelectedReport] = useState<HoroscopeReportResponse | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<HoroscopeMatchCard | null>(null);
  const [isLoadingReport, setIsLoadingReport] = useState<boolean>(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [userProf, matchList] = await Promise.all([
        fetchUserHoroscope('anamika_current'),
        fetchHoroscopeMatches(),
      ]);
      setProfile(userProf);
      setMatches(matchList);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async (details: BirthDetails, docName?: string) => {
    const updated = await saveUserHoroscope(
      'anamika_current',
      details,
      profile?.is_visible_for_matching ?? true,
      docName
    );
    setProfile(updated);
    // Reload match scores with updated birth details
    const refreshedMatches = await fetchHoroscopeMatches();
    setMatches(refreshedMatches);
  };

  const handleTogglePrivacy = async () => {
    if (!profile || !profile.birth_details) return;
    const newVisibility = !profile.is_visible_for_matching;
    const updated = await saveUserHoroscope(
      'anamika_current',
      profile.birth_details,
      newVisibility,
      profile.uploaded_document_name
    );
    setProfile(updated);
  };

  const handleOpenReport = async (candidate: HoroscopeMatchCard) => {
    setSelectedCandidate(candidate);
    setIsLoadingReport(true);
    try {
      const rep = await fetchHoroscopeReport(candidate.candidate_id, profile?.birth_details);
      setSelectedReport(rep);
      setIsReportModalOpen(true);
    } finally {
      setIsLoadingReport(false);
    }
  };

  // Filter matches
  const filteredMatches = matches.filter((m) => {
    if (activeFilter === 'exceptional') return m.guna_score >= 28;
    if (activeFilter === 'high') return m.guna_score >= 24;
    if (activeFilter === 'manglik') return m.manglik_compatible;
    return true;
  });

  return (
    <div className="horoscope-match-container">
      {/* Hero Header */}
      <div className="horoscope-hero-card">
        <div className="horoscope-hero-badge">
          <span className="badge-glow">✨</span> Vedic Astrology & Kundli Milan
        </div>
        <h2 className="horoscope-hero-title">Cosmic Connections</h2>
        <p className="horoscope-hero-subtitle">
          Explore authentic 36-point Ashtakoota compatibility, planetary synergy, and birth chart harmony.
          Vedic matching helps you discover natural temperamental alignment while keeping your private birth time and coordinates securely encrypted.
        </p>
      </div>

      {/* User Horoscope Profile Banner */}
      <div className="user-horoscope-profile-card">
        <div className="user-horoscope-info-left">
          <div className="horoscope-avatar-wrap">
            <span className="horoscope-avatar-symbol">♈</span>
          </div>
          <div className="user-horoscope-text">
            <div className="user-horoscope-name-row">
              <h4 className="user-horoscope-name">Your Horoscope Profile</h4>
              <span className="horoscope-status-tag">
                {profile?.has_horoscope ? '✓ Chart Analyzed' : 'No Horoscope Yet'}
              </span>
            </div>

            {profile?.birth_details ? (
              <div className="user-astro-pills">
                <span className="astro-pill">
                  <strong>Rashi:</strong> {profile.birth_details.rashi}
                </span>
                <span className="astro-pill">
                  <strong>Nakshatra:</strong> {profile.birth_details.nakshatra}
                </span>
                {profile.birth_details.lagna && (
                  <span className="astro-pill">
                    <strong>Lagna:</strong> {profile.birth_details.lagna}
                  </span>
                )}
                <span className={`astro-pill ${profile.birth_details.is_manglik ? 'manglik' : 'non-manglik'}`}>
                  {profile.birth_details.is_manglik ? 'Mars / Manglik Active' : 'Non-Manglik'}
                </span>
                {profile.uploaded_document_name && (
                  <span className="astro-doc-pill">
                    📄 {profile.uploaded_document_name}
                  </span>
                )}
              </div>
            ) : (
              <p className="no-horoscope-hint">
                Upload your Kundli or enter birth details to unlock personalized Guna Milan scores.
              </p>
            )}
          </div>
        </div>

        <div className="user-horoscope-actions-right">
          <button
            type="button"
            className="btn-update-horoscope"
            onClick={() => setIsUploadModalOpen(true)}
          >
            {profile?.has_horoscope ? '🔄 Update / Replace Horoscope' : '➕ Upload Horoscope (PDF/Image)'}
          </button>

          <label className="horoscope-privacy-toggle" title="Control whether other users can discover horoscope alignment with you">
            <input
              type="checkbox"
              checked={profile?.is_visible_for_matching ?? true}
              onChange={handleTogglePrivacy}
            />
            <span className="toggle-label-text">
              {profile?.is_visible_for_matching ? 'Public Vedic Discovery ON' : 'Horoscope Hidden from Discovery'}
            </span>
          </label>
        </div>
      </div>

      {/* Discovery Filters Header */}
      <div className="horoscope-discovery-controls">
        <div className="filter-title-group">
          <h3 className="discovery-section-title">
            Astrological Matches ({filteredMatches.length})
          </h3>
          <span className="discovery-sub">Ranked by Traditional 36-Point Guna Milan</span>
        </div>

        <div className="horoscope-filter-pills">
          <button
            type="button"
            className={`filter-pill-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All Matches
          </button>
          <button
            type="button"
            className={`filter-pill-btn ${activeFilter === 'exceptional' ? 'active' : ''}`}
            onClick={() => setActiveFilter('exceptional')}
          >
            ⭐ Exceptional (&gt;28 pts)
          </button>
          <button
            type="button"
            className={`filter-pill-btn ${activeFilter === 'high' ? 'active' : ''}`}
            onClick={() => setActiveFilter('high')}
          >
            🌟 High Match (&gt;24 pts)
          </button>
          <button
            type="button"
            className={`filter-pill-btn ${activeFilter === 'manglik' ? 'active' : ''}`}
            onClick={() => setActiveFilter('manglik')}
          >
            ♂ Manglik Compatible
          </button>
        </div>
      </div>

      {/* Matches Grid */}
      {isLoading ? (
        <div className="horoscope-loading-state">
          <div className="cosmic-spinner" />
          <p>Calculating 8-dimensional Vedic Ashtakoota matrix...</p>
        </div>
      ) : filteredMatches.length === 0 ? (
        <div className="horoscope-empty-state">
          <span className="empty-glyph">🌌</span>
          <h4>No Astrological Matches in this Filter</h4>
          <p>Try switching to "All Matches" to view all available cosmic connections.</p>
        </div>
      ) : (
        <div className="horoscope-matches-grid">
          {filteredMatches.map((cand) => {
            const isConnected = connectedCandidateIds.includes(cand.candidate_id);
            const isExceptional = cand.guna_score >= 28;

            return (
              <div
                key={cand.candidate_id}
                className={`horoscope-card ${isExceptional ? 'card-exceptional' : ''}`}
              >
                {/* Top Row: Avatar & Details */}
                <div className="horoscope-card-top">
                  <div className="candidate-avatar-wrap">
                    <img
                      src={cand.avatar_url}
                      alt={cand.candidate_name}
                      className="candidate-avatar-img"
                    />
                    <span className="avatar-online-dot" />
                  </div>

                  <div className="candidate-card-info">
                    <div className="candidate-name-row">
                      <h4 className="candidate-name">
                        {cand.candidate_name}, {cand.age}
                      </h4>
                    </div>
                    <p className="candidate-job">
                      {cand.occupation} • {cand.location}
                    </p>

                    {/* Astrological Tags */}
                    <div className="candidate-astro-badges">
                      <span className="astro-tag moon-tag">
                        🌙 {cand.rashi}
                      </span>
                      <span className="astro-tag star-tag">
                        ⭐ {cand.nakshatra}
                      </span>
                      <span className={`astro-tag ${cand.is_manglik ? 'tag-manglik' : 'tag-neutral'}`}>
                        {cand.is_manglik ? '♂ Manglik' : 'Non-Manglik'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Score Banner */}
                <div className="horoscope-score-banner">
                  <div className="score-badge-group">
                    <span className="score-val">{cand.guna_score}</span>
                    <span className="score-max">/ 36 Gunas</span>
                  </div>
                  <span className={`score-tier-label ${isExceptional ? 'tier-ex' : 'tier-good'}`}>
                    {cand.compatibility_tier}
                  </span>
                </div>

                {/* Synergy Highlight */}
                <div className="horoscope-synergy-highlight">
                  <span className="synergy-spark">✦</span>
                  <p>{cand.synergy_highlight}</p>
                </div>

                {/* Action Buttons */}
                <div className="horoscope-card-actions">
                  <button
                    type="button"
                    className="btn-view-cosmic-report"
                    onClick={() => handleOpenReport(cand)}
                    disabled={isLoadingReport}
                  >
                    📊 View Cosmic Report
                  </button>

                  {isConnected ? (
                    <button
                      type="button"
                      className="btn-connected-pill"
                      onClick={() => onOpenChat(cand.candidate_id)}
                    >
                      💬 Open Chat
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn-connect-cosmic"
                      onClick={() =>
                        onConnectCandidate({
                          id: cand.candidate_id,
                          name: cand.candidate_name,
                          age: cand.age,
                          occupation: cand.occupation,
                          location: cand.location,
                          avatar_url: cand.avatar_url,
                          bio: `${cand.occupation} in ${cand.location}. Valuing emotional depth and cosmic alignment.`,
                          profile_data: {
                            personality_insights: [],
                            core_values: [
                              { value: 'Cosmic Alignment', evidence: 'Astrological synergy', is_explicit: true },
                              { value: 'Mutual Respect', evidence: 'Vedic harmony', is_explicit: true },
                            ],
                            interests_and_lifestyle: [],
                            relationship_expectations: [],
                            communication_preferences: [],
                            personal_boundaries: [],
                            missing_information: { unknown_aspects: [], recommended_follow_up_questions: [] },
                          },
                        })
                      }
                    >
                      💕 Connect
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Non-Believer Friendly Notice Banner */}
      <div className="horoscope-info-footer-card">
        <span className="info-symbol">💡</span>
        <div className="info-text">
          <strong>Astrology is entirely optional on Hey Shona!</strong>
          <p>
            If you do not follow Vedic astrology, our core 5-dimensional psychological compatibility engine, values alignment, and multi-profile chat continue to operate normally. You can disable horoscope matching at any time.
          </p>
        </div>
      </div>

      {/* Upload / Edit Modal */}
      <HoroscopeUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        currentBirthDetails={profile?.birth_details}
        onSave={handleSaveProfile}
      />

      {/* Cosmic Compatibility Report Modal */}
      <HoroscopeReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        report={selectedReport}
        candidateAvatar={selectedCandidate?.avatar_url}
        onConnect={() => {
          if (selectedCandidate) {
            onConnectCandidate({
              id: selectedCandidate.candidate_id,
              name: selectedCandidate.candidate_name,
              age: selectedCandidate.age,
              occupation: selectedCandidate.occupation,
              location: selectedCandidate.location,
              avatar_url: selectedCandidate.avatar_url,
              bio: `${selectedCandidate.occupation} in ${selectedCandidate.location}. Valuing emotional depth and cosmic alignment.`,
              profile_data: {
                personality_insights: [],
                core_values: [
                  { value: 'Cosmic Alignment', evidence: 'Astrological synergy', is_explicit: true },
                  { value: 'Mutual Respect', evidence: 'Vedic harmony', is_explicit: true },
                ],
                interests_and_lifestyle: [],
                relationship_expectations: [],
                communication_preferences: [],
                personal_boundaries: [],
                missing_information: { unknown_aspects: [], recommended_follow_up_questions: [] },
              },
            });
          }
        }}
      />
    </div>
  );
};
