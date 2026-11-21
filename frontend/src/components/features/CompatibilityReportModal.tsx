import React from 'react';
import { CompatibilityReport, UserProfileSummary } from '../../types/compatibility';

interface CompatibilityReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: UserProfileSummary | null;
  report: CompatibilityReport | null;
  loading: boolean;
  error: string | null;
  isConnected?: boolean;
  onConnect?: (candidate: UserProfileSummary) => void;
  onOpenChat?: (candidateId: string) => void;
}

export const CompatibilityReportModal: React.FC<CompatibilityReportModalProps> = ({
  isOpen,
  onClose,
  candidate,
  report,
  loading,
  error,
  isConnected,
  onConnect,
  onOpenChat,
}) => {
  if (!isOpen || !candidate) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="compat-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close report">
          ✕
        </button>

        {/* Candidate Mini Header */}
        <div className="compat-modal-header">
          <img
            src={candidate.avatar_url}
            alt={candidate.name}
            className="compat-modal-avatar"
          />
          <div className="compat-modal-header-info">
            <div className="compat-name-row">
              <h3>{candidate.name}, {candidate.age}</h3>
              <span className="compat-verified-tag">✓ Verified Profile</span>
            </div>
            <p className="compat-occupation">{candidate.occupation} • {candidate.location}</p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="compat-modal-body">
          {loading && (
            <div className="compat-loading-state">
              <div className="compat-spinner" />
              <h4>Consulting Gemini Compatibility Engine...</h4>
              <p>Analyzing semantic values alignment, communication dynamics, and mutual chemistry.</p>
            </div>
          )}

          {error && (
            <div className="analyzer-error">
              <span>⚠️</span>
              <div>
                <strong>Unable to generate full report:</strong> {error}
              </div>
            </div>
          )}

          {!loading && report && (
            <div className="compat-report-content">
              {/* Overall Score Badge Banner */}
              <div className="compat-score-banner">
                <div className="score-circle">
                  <span className="score-number">{report.overall_score}%</span>
                  <span className="score-label">Match</span>
                </div>
                <div className="score-banner-text">
                  <h4 className="score-headline">{report.headline}</h4>
                  <p className="score-explanation">{report.overall_explanation}</p>
                </div>
              </div>

              {/* 5-Dimension Compatibility Breakdown */}
              <div className="dimension-breakdown-section">
                <h4 className="section-title">Weighted Dimensional Breakdown</h4>
                <div className="dimensions-list">
                  {/* Core Values */}
                  <div className="dimension-bar-item">
                    <div className="dimension-bar-header">
                      <span className="dim-name">💎 Core Values (30% weight)</span>
                      <span className="dim-score">{report.breakdown.core_values.score}%</span>
                    </div>
                    <div className="progress-track">
                      <div
                        className="progress-fill val-fill"
                        style={{ width: `${report.breakdown.core_values.score}%` }}
                      />
                    </div>
                    {report.breakdown.core_values.explanation && (
                      <span className="dim-desc">{report.breakdown.core_values.explanation}</span>
                    )}
                  </div>

                  {/* Relationship Expectations */}
                  <div className="dimension-bar-item">
                    <div className="dimension-bar-header">
                      <span className="dim-name">🤝 Relationship Expectations (25% weight)</span>
                      <span className="dim-score">{report.breakdown.relationship_expectations.score}%</span>
                    </div>
                    <div className="progress-track">
                      <div
                        className="progress-fill exp-fill"
                        style={{ width: `${report.breakdown.relationship_expectations.score}%` }}
                      />
                    </div>
                    {report.breakdown.relationship_expectations.explanation && (
                      <span className="dim-desc">{report.breakdown.relationship_expectations.explanation}</span>
                    )}
                  </div>

                  {/* Communication Style */}
                  <div className="dimension-bar-item">
                    <div className="dimension-bar-header">
                      <span className="dim-name">💬 Communication Style (20% weight)</span>
                      <span className="dim-score">{report.breakdown.communication_style.score}%</span>
                    </div>
                    <div className="progress-track">
                      <div
                        className="progress-fill comm-fill"
                        style={{ width: `${report.breakdown.communication_style.score}%` }}
                      />
                    </div>
                    {report.breakdown.communication_style.explanation && (
                      <span className="dim-desc">{report.breakdown.communication_style.explanation}</span>
                    )}
                  </div>

                  {/* Lifestyle and Interests */}
                  <div className="dimension-bar-item">
                    <div className="dimension-bar-header">
                      <span className="dim-name">🎯 Lifestyle & Interests (15% weight)</span>
                      <span className="dim-score">{report.breakdown.lifestyle_and_interests.score}%</span>
                    </div>
                    <div className="progress-track">
                      <div
                        className="progress-fill life-fill"
                        style={{ width: `${report.breakdown.lifestyle_and_interests.score}%` }}
                      />
                    </div>
                    {report.breakdown.lifestyle_and_interests.explanation && (
                      <span className="dim-desc">{report.breakdown.lifestyle_and_interests.explanation}</span>
                    )}
                  </div>

                  {/* Personal Boundaries */}
                  <div className="dimension-bar-item">
                    <div className="dimension-bar-header">
                      <span className="dim-name">🛡️ Personal Boundaries (10% weight)</span>
                      <span className="dim-score">{report.breakdown.personal_boundaries.score}%</span>
                    </div>
                    <div className="progress-track">
                      <div
                        className="progress-fill bound-fill"
                        style={{ width: `${report.breakdown.personal_boundaries.score}%` }}
                      />
                    </div>
                    {report.breakdown.personal_boundaries.explanation && (
                      <span className="dim-desc">{report.breakdown.personal_boundaries.explanation}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Why You Might Connect */}
              <div className="report-insights-block connect-block">
                <div className="block-header">
                  <span className="block-icon">✨</span>
                  <h4 className="section-title">Why You Might Connect</h4>
                </div>
                <ul className="insights-bullet-list">
                  {report.why_you_might_connect.map((point, idx) => (
                    <li key={idx} className="insight-bullet-item">
                      <span className="check-bullet">✓</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Potential Differences */}
              <div className="report-insights-block diff-block">
                <div className="block-header">
                  <span className="block-icon">⚖️</span>
                  <h4 className="section-title">Potential Differences to Explore</h4>
                </div>
                <p className="diff-disclaimer">
                  Constructive growth opportunities to discuss openly rather than red flags:
                </p>
                <ul className="insights-bullet-list">
                  {report.potential_differences.map((diff, idx) => (
                    <li key={idx} className="diff-bullet-item">
                      <span className="diff-bullet">→</span>
                      <span>{diff}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Conversation Starters */}
              <div className="report-insights-block starters-block">
                <div className="block-header">
                  <span className="block-icon">💭</span>
                  <h4 className="section-title">Personalized Conversation Starters</h4>
                </div>
                <div className="starters-list">
                  {report.conversation_starters.map((starter, idx) => (
                    <div key={idx} className="starter-pill-box">
                      <span className="starter-q-num">#{idx + 1}</span>
                      <span className="starter-q-text">{starter}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Connect & Chat Action Bar */}
              <div className="report-action-footer">
                {isConnected ? (
                  <div className="connected-action-group">
                    <span className="connected-status-pill">✓ You are Connected</span>
                    {onOpenChat && (
                      <button
                        type="button"
                        className="modal-start-chat-btn"
                        onClick={() => {
                          onClose();
                          onOpenChat(candidate.id);
                        }}
                      >
                        💬 Start Chatting with {candidate.name} →
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    className="modal-connect-btn"
                    onClick={() => onConnect && onConnect(candidate)}
                  >
                    <span>Connect with {candidate.name} 💕</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
