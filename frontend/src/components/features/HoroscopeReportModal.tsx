import React from 'react';
import { HoroscopeReportResponse } from '../../types/horoscope';

interface HoroscopeReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: HoroscopeReportResponse | null;
  candidateAvatar?: string;
  onConnect?: () => void;
}

export const HoroscopeReportModal: React.FC<HoroscopeReportModalProps> = ({
  isOpen,
  onClose,
  report,
  candidateAvatar,
  onConnect,
}) => {
  if (!isOpen || !report) return null;

  const {
    user1_name,
    user2_name,
    user1_rashi,
    user1_nakshatra,
    user2_rashi,
    user2_nakshatra,
    ashtakoota,
    manglik_analysis,
    vedic_summary,
    astrological_strengths,
    growth_areas,
    disclaimer,
  } = report;

  const isHighMatch = ashtakoota.total_score >= 24;

  return (
    <div className="horoscope-modal-backdrop" onClick={onClose}>
      <div
        className="horoscope-report-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="report-modal-header">
          <div className="report-header-title-block">
            <span className="report-glyph">✨ 🔮 ✨</span>
            <div>
              <h3 className="report-title">Cosmic Compatibility Report</h3>
              <p className="report-subtitle">
                Traditional Vedic Kundli Milan between <strong>{user1_name}</strong> and <strong>{user2_name}</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            className="report-modal-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Report Content Body */}
        <div className="report-modal-body">
          {/* Top Cosmic Synergy Card */}
          <div className="cosmic-match-summary-card">
            <div className="cosmic-avatars-pair">
              <div className="cosmic-user-node">
                <span className="avatar-chip-role">You</span>
                <span className="cosmic-astro-badge">
                  {user1_rashi} • {user1_nakshatra}
                </span>
                <h4 className="cosmic-name">{user1_name}</h4>
              </div>

              <div className="cosmic-score-ring-wrap">
                <div className="cosmic-score-badge">
                  <span className="score-number">{ashtakoota.total_score}</span>
                  <span className="score-denom">/ 36 Gunas</span>
                </div>
                <span className={`score-tier-pill ${isHighMatch ? 'tier-high' : 'tier-mid'}`}>
                  {ashtakoota.compatibility_category}
                </span>
              </div>

              <div className="cosmic-user-node">
                <span className="avatar-chip-role">Candidate</span>
                {candidateAvatar && (
                  <img src={candidateAvatar} alt={user2_name} className="cosmic-avatar-img" />
                )}
                <span className="cosmic-astro-badge">
                  {user2_rashi} • {user2_nakshatra}
                </span>
                <h4 className="cosmic-name">{user2_name}</h4>
              </div>
            </div>

            <div className="cosmic-synthesis-box">
              <span className="synthesis-sparkle">📜 Vedic Synthesis:</span>
              <p>{vedic_summary}</p>
            </div>
          </div>

          {/* Manglik Analysis Section */}
          <div className="manglik-banner-card">
            <div className="manglik-icon-block">
              <span className="manglik-glyph">♂</span>
            </div>
            <div className="manglik-text-block">
              <div className="manglik-header-row">
                <h4 className="manglik-title">Manglik (Kuja Dosha) Harmony</h4>
                <span className="manglik-status-pill">{manglik_analysis.status}</span>
              </div>
              <p className="manglik-desc">{manglik_analysis.summary}</p>
            </div>
          </div>

          {/* Ashtakoota 8 Dimensions Breakdown */}
          <div className="ashtakoota-section">
            <div className="ashtakoota-heading-row">
              <h4 className="ashtakoota-title">Ashtakoota 8-Dimensional Guna Breakdown</h4>
              <span className="ashtakoota-sub">36-Point Traditional System</span>
            </div>

            <div className="kootas-grid">
              {ashtakoota.kootas.map((koota, idx) => {
                const ratio = koota.obtained_score / koota.max_score;
                const isPerfect = ratio >= 0.99;
                const isGood = ratio >= 0.5;

                return (
                  <div key={idx} className="koota-card">
                    <div className="koota-header-row">
                      <div className="koota-names">
                        <span className="koota-sanskrit">{koota.sanskrit_name}</span>
                        <strong className="koota-name">{koota.name}</strong>
                      </div>
                      <div className="koota-score-block">
                        <span className={`koota-score-val ${isPerfect ? 'perfect' : isGood ? 'good' : 'fair'}`}>
                          {koota.obtained_score}
                        </span>
                        <span className="koota-score-max">/ {koota.max_score}</span>
                      </div>
                    </div>

                    <div className="koota-progress-track">
                      <div
                        className={`koota-progress-fill ${isPerfect ? 'fill-perfect' : isGood ? 'fill-good' : 'fill-fair'}`}
                        style={{ width: `${Math.round(ratio * 100)}%` }}
                      />
                    </div>

                    <span className="koota-life-area">✦ {koota.area_of_life}</span>
                    <p className="koota-desc">{koota.interpretation}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Astrological Strengths & Growth Areas */}
          <div className="astro-insights-split">
            <div className="astro-strengths-box">
              <h5>🌟 Astrological Resonances</h5>
              <ul>
                {astrological_strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="astro-growth-box">
              <h5>🌱 Conscious Mindful Areas</h5>
              <ul>
                {growth_areas.map((g, i) => (
                  <li key={i}>{g}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Ethical & Cultural Heritage Disclaimer */}
          <div className="astro-disclaimer-box">
            <span className="disclaimer-icon">ℹ️</span>
            <div>
              <strong>Cultural Heritage & Ethical Notice</strong>
              <p>{disclaimer}</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="report-modal-footer">
          <button type="button" className="btn-report-close" onClick={onClose}>
            Close Report
          </button>
          {onConnect && (
            <button
              type="button"
              className="btn-report-connect"
              onClick={() => {
                onConnect();
                onClose();
              }}
            >
              💕 Connect with {user2_name}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
