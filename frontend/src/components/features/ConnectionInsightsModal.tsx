import React, { useState, useEffect, useCallback } from 'react';
import { UserProfileSummary } from '../../types/compatibility';
import { ChatMessage } from '../../types/chat';
import {
  ChatMetricsResponse,
  ChatConsentState,
} from '../../types/chatMetrics';
import {
  fetchChatMetrics,
  fetchConsentStatus,
  updateConsentStatus,
  deleteConnectionInsights,
} from '../../api/chatMetrics';

interface ConnectionInsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: UserProfileSummary;
  messages: ChatMessage[];
  currentUserName?: string;
  onUseStarter?: (question: string) => void;
}

export const ConnectionInsightsModal: React.FC<ConnectionInsightsModalProps> = ({
  isOpen,
  onClose,
  match,
  messages,
  currentUserName = 'Anamika',
  onUseStarter,
}) => {
  const [timeframe, setTimeframe] = useState<string>('7d');
  const [metrics, setMetrics] = useState<ChatMetricsResponse | null>(null);
  const [consent, setConsent] = useState<ChatConsentState>({
    connection_id: match.id,
    user_consented: true,
    partner_consented: true,
    is_mutual_consent: true,
    consent_description: 'Both participants have enabled Connection Intelligence.',
    can_revoke: true,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteNotice, setDeleteNotice] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch live server consent
      let liveConsent = consent;
      try {
        liveConsent = await fetchConsentStatus(match.id);
        setConsent(liveConsent);
      } catch {
        // Fallback to local consent state
      }

      // 2. Fetch Metrics
      const payload = {
        connection_id: match.id,
        user_name: currentUserName,
        match_name: match.name,
        messages: messages.map((m) => ({
          id: m.id,
          sender: m.sender,
          text: m.text,
          timestamp: m.timestamp,
        })),
        timeframe,
        user_consented: liveConsent.user_consented,
        partner_consented: liveConsent.partner_consented,
      };

      const res = await fetchChatMetrics(payload);
      setMetrics(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze conversation metrics');
    } finally {
      setLoading(false);
    }
  }, [match.id, match.name, currentUserName, messages, timeframe]);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, loadData]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleToggleConsent = async (type: 'user' | 'partner') => {
    const nextUser = type === 'user' ? !consent.user_consented : consent.user_consented;
    const nextPartner = type === 'partner' ? !consent.partner_consented : consent.partner_consented;

    try {
      const updated = await updateConsentStatus(match.id, nextUser, nextPartner);
      setConsent(updated);
      // Reload metrics with new consent state
      loadData();
    } catch (err) {
      console.error('Failed to update consent:', err);
    }
  };

  const handleDeleteInsights = async () => {
    try {
      await deleteConnectionInsights(match.id);
      setDeleteNotice('All previous metrics & insights for this connection have been deleted.');
      setMetrics(null);
      setTimeout(() => setDeleteNotice(null), 4000);
    } catch (err) {
      console.error('Failed to delete insights:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="insights-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="insights-modal-header">
          <div className="insights-title-row">
            <div className="insights-header-icon-wrap">
              <span className="insights-header-icon">📊</span>
            </div>
            <div>
              <div className="insights-badge-row">
                <span className="insights-feat-badge">AI Chat Metrics</span>
                <span className="insights-tagline">Connection Intelligence</span>
              </div>
              <h2 className="insights-title">
                Communication Dynamics with {match.name}
              </h2>
            </div>
          </div>

          <div className="insights-header-actions">
            {/* Timeframe Filter Pills */}
            <div className="insights-timeframe-pills">
              <button
                type="button"
                className={`timeframe-btn ${timeframe === '7d' ? 'active' : ''}`}
                onClick={() => setTimeframe('7d')}
              >
                Last 7 Days
              </button>
              <button
                type="button"
                className={`timeframe-btn ${timeframe === '30d' ? 'active' : ''}`}
                onClick={() => setTimeframe('30d')}
              >
                Last 30 Days
              </button>
              <button
                type="button"
                className={`timeframe-btn ${timeframe === 'all' ? 'active' : ''}`}
                onClick={() => setTimeframe('all')}
              >
                All History
              </button>
            </div>

            <button
              type="button"
              className="insights-close-btn"
              onClick={onClose}
              aria-label="Close"
              title="Close Insights"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Mutual Consent Management Card */}
        <div className="insights-consent-card">
          <div className="consent-top-row">
            <div className="consent-status-indicator">
              <span className={`status-dot ${consent.is_mutual_consent ? 'online' : 'paused'}`} />
              <span className="status-label">
                {consent.is_mutual_consent
                  ? 'Mutual Consent Active (Analysis Enabled)'
                  : 'Pending Mutual Consent (Analysis Paused)'}
              </span>
            </div>

            <div className="consent-toggle-group">
              <button
                type="button"
                className={`consent-pill-toggle ${consent.user_consented ? 'enabled' : 'disabled'}`}
                onClick={() => handleToggleConsent('user')}
                title="Toggle your personal consent for conversation insights"
              >
                Your Consent: {consent.user_consented ? 'Granted ✓' : 'Revoked ✗'}
              </button>

              <button
                type="button"
                className={`consent-pill-toggle partner ${consent.partner_consented ? 'enabled' : 'disabled'}`}
                onClick={() => handleToggleConsent('partner')}
                title="Simulate match consent for demo testing"
              >
                {match.name}: {consent.partner_consented ? 'Consented ✓' : 'Revoked ✗'}
              </button>

              <button
                type="button"
                className="delete-insights-btn"
                onClick={handleDeleteInsights}
                title="Permanently delete all conversation insights"
              >
                🗑️ Delete Insights
              </button>
            </div>
          </div>

          <p className="consent-explainer-text">
            🛡️ <strong>Mutual Privacy Guarantee:</strong> Conversation Intelligence analyzes communication rhythm and semantic topic progression only when both users consent. Individual messages and private analytics are never leaked, and no judgment of your relationship is ever made.
          </p>
        </div>

        {deleteNotice && (
          <div className="insights-delete-toast">
            <span>🗑️ {deleteNotice}</span>
          </div>
        )}

        {/* Modal Body / Scrollable Content */}
        <div className="insights-modal-body">
          {loading ? (
            <div className="insights-loading-view">
              <div className="cupid-wings-anim">📊 ✨</div>
              <h3>Analyzing Conversation Dynamics...</h3>
              <p>Gemini AI is examining communication reciprocity, depth evolution, and shared topics.</p>
            </div>
          ) : error ? (
            <div className="insights-error-view">
              <span className="error-icon">⚠️</span>
              <h4>Unable to load connection insights</h4>
              <p>{error}</p>
              <button className="primary-discovery-btn" onClick={loadData}>
                Retry Analysis
              </button>
            </div>
          ) : !consent.is_mutual_consent ? (
            /* Mutual Consent Gate State */
            <div className="insights-gate-card">
              <div className="gate-icon">🔒</div>
              <h3>Mutual Consent Required</h3>
              <p>
                To protect privacy, AI Conversation Intelligence will only analyze chat dynamics once both you and{' '}
                <strong>{match.name}</strong> independently enable the feature.
              </p>
              <div className="gate-checklist">
                <div className={`check-item ${consent.user_consented ? 'done' : 'pending'}`}>
                  <span>{consent.user_consented ? '✅' : '⚪'}</span>
                  <span>Your Consent: {consent.user_consented ? 'Enabled' : 'Disabled'}</span>
                </div>
                <div className={`check-item ${consent.partner_consented ? 'done' : 'pending'}`}>
                  <span>{consent.partner_consented ? '✅' : '⚪'}</span>
                  <span>{match.name}'s Consent: {consent.partner_consented ? 'Enabled' : 'Pending'}</span>
                </div>
              </div>
              <div className="gate-actions">
                <button
                  type="button"
                  className="primary-discovery-btn"
                  onClick={() => handleToggleConsent('user')}
                >
                  {consent.user_consented ? 'Revoke My Consent' : 'Enable My Consent'}
                </button>
                <button
                  type="button"
                  className="demo-simulate-btn"
                  onClick={() => handleToggleConsent('partner')}
                >
                  Simulate {match.name}'s Consent (Demo)
                </button>
              </div>
            </div>
          ) : !metrics?.has_sufficient_data ? (
            /* Insufficient Data State (< 3 messages) */
            <div className="insights-gate-card">
              <div className="gate-icon">💬</div>
              <h3>More Messages Needed for Analysis</h3>
              <p>
                You've exchanged <strong>{messages.length} message(s)</strong> with {match.name}. Send at least 3-4 messages to begin detecting rhythm, depth, and communication patterns!
              </p>
              <button
                type="button"
                className="primary-discovery-btn"
                onClick={onClose}
              >
                💬 Return to Chat & Exchange Messages
              </button>
            </div>
          ) : metrics ? (
            /* Full Connection Intelligence Dashboard */
            <div className="insights-dashboard-grid">
              {/* 1. Weekly AI Connection Summary */}
              {metrics.weekly_summary && (
                <div className="insight-card hero-summary-card">
                  <div className="card-top-tag">
                    <span className="sparkle-icon">✨</span>
                    <span className="card-tag-text">Weekly Connection Summary</span>
                  </div>
                  <h3 className="hero-summary-headline">
                    {metrics.weekly_summary.headline}
                  </h3>
                  <p className="hero-summary-narrative">
                    "{metrics.weekly_summary.summary}"
                  </p>

                  <div className="summary-columns-grid">
                    {/* What's Working */}
                    <div className="summary-col working-col">
                      <h4 className="col-title">
                        <span>🌟</span> What’s Working
                      </h4>
                      <ul className="insights-bullet-list">
                        {metrics.weekly_summary.whats_working.map((item, i) => (
                          <li key={i}>
                            <span className="check-bullet">✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Opportunity to Connect */}
                    <div className="summary-col opportunity-col">
                      <h4 className="col-title">
                        <span>🌱</span> Opportunity to Connect
                      </h4>
                      <p className="opportunity-text">
                        {metrics.weekly_summary.opportunity_to_connect}
                      </p>

                      <div className="suggestion-box">
                        <span className="sugg-badge">💡 Suggested Question:</span>
                        <p className="sugg-text">"{metrics.weekly_summary.ai_conversation_suggestion}"</p>
                        {onUseStarter && (
                          <button
                            type="button"
                            className="use-sugg-btn"
                            onClick={() => {
                              onUseStarter(metrics.weekly_summary!.ai_conversation_suggestion);
                              onClose();
                            }}
                          >
                            💬 Send to Chat
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2-Column Row: Momentum & Balance */}
              <div className="insights-dual-row">
                {/* 2. Conversation Momentum */}
                {metrics.momentum && (
                  <div className="insight-card momentum-card">
                    <div className="card-header-line">
                      <div>
                        <h4 className="card-heading">📈 Conversation Momentum</h4>
                        <p className="card-subheading">Activity and message frequency over time</p>
                      </div>
                      <span className="trend-badge">{metrics.momentum.trend_label}</span>
                    </div>

                    {/* Chart Visualization */}
                    <div className="momentum-chart-container">
                      <div className="momentum-bars-row">
                        {metrics.momentum.data_points.map((pt, idx) => (
                          <div key={idx} className="chart-bar-col">
                            <div className="bar-stack-wrap">
                              <div
                                className="bar-segment match-seg"
                                style={{ height: `${Math.min(100, pt.match_messages * 18)}%` }}
                                title={`${match.name}: ${pt.match_messages} msgs`}
                              />
                              <div
                                className="bar-segment user-seg"
                                style={{ height: `${Math.min(100, pt.user_messages * 18)}%` }}
                                title={`You: ${pt.user_messages} msgs`}
                              />
                            </div>
                            <span className="bar-date-label">{pt.date}</span>
                          </div>
                        ))}
                      </div>

                      <div className="chart-legend-row">
                        <span className="legend-item">
                          <span className="legend-color-dot user-dot" /> You ({currentUserName})
                        </span>
                        <span className="legend-item">
                          <span className="legend-color-dot match-dot" /> {match.name}
                        </span>
                      </div>
                    </div>

                    <p className="momentum-desc">{metrics.momentum.trend_description}</p>
                    <p className="momentum-cadence-note">ℹ️ {metrics.momentum.cadence_note}</p>
                  </div>
                )}

                {/* 3. Communication Balance */}
                {metrics.balance && (
                  <div className="insight-card balance-card">
                    <div className="card-header-line">
                      <div>
                        <h4 className="card-heading">⚖️ Communication Balance</h4>
                        <p className="card-subheading">Participation & reciprocity dynamics</p>
                      </div>
                      <span className="balance-status-badge">{metrics.balance.balance_status}</span>
                    </div>

                    {/* Reciprocity Ratio Bar */}
                    <div className="balance-progress-wrap">
                      <div className="balance-labels-row">
                        <span className="user-pct-label">You: {metrics.balance.user_pct}%</span>
                        <span className="match-pct-label">{match.name}: {metrics.balance.match_pct}%</span>
                      </div>
                      <div className="balance-track">
                        <div
                          className="balance-fill-user"
                          style={{ width: `${metrics.balance.user_pct}%` }}
                        />
                        <div
                          className="balance-fill-match"
                          style={{ width: `${metrics.balance.match_pct}%` }}
                        />
                      </div>
                    </div>

                    {/* Word Count Comparison Cards */}
                    <div className="avg-words-row">
                      <div className="avg-word-box">
                        <span className="avg-num">{metrics.balance.user_avg_words}</span>
                        <span className="avg-label">Avg Words / Msg (You)</span>
                      </div>
                      <div className="avg-word-box">
                        <span className="avg-num">{metrics.balance.match_avg_words}</span>
                        <span className="avg-label">Avg Words / Msg ({match.name})</span>
                      </div>
                      <div className="avg-word-box total">
                        <span className="avg-num">{metrics.balance.total}</span>
                        <span className="avg-label">Total Messages</span>
                      </div>
                    </div>

                    <p className="balance-insight-text">{metrics.balance.balance_insight}</p>
                    <span className="balance-ethical-note">
                      🌱 Healthy communication thrives on reciprocity, not exact 50/50 word quotas.
                    </span>
                  </div>
                )}
              </div>

              {/* 4. Emotional Engagement Indicators */}
              {metrics.engagement && (
                <div className="insight-card engagement-card">
                  <div className="card-header-line">
                    <div>
                      <h4 className="card-heading">💖 Emotional Engagement Indicators</h4>
                      <p className="card-subheading">Observable conversational patterns & active listening signals</p>
                    </div>
                  </div>

                  <div className="engagement-indicators-grid">
                    {metrics.engagement.indicators.map((ind, i) => (
                      <div key={i} className="engagement-item-box">
                        <div className="ind-header-row">
                          <span className="ind-title">{ind.title}</span>
                          <span className="ind-freq-badge">{ind.frequency}</span>
                        </div>
                        <p className="ind-evidence">{ind.evidence}</p>
                      </div>
                    ))}
                  </div>
                  <p className="engagement-note">ℹ️ {metrics.engagement.summary_note}</p>
                </div>
              )}

              {/* 5. Conversation Depth Progression */}
              {metrics.depth && (
                <div className="insight-card depth-card">
                  <div className="card-header-line">
                    <div>
                      <h4 className="card-heading">🌊 Conversation Depth Evolution</h4>
                      <p className="card-subheading">Progression from small talk into values and life stories</p>
                    </div>
                    <span className="depth-active-badge">
                      Active: {metrics.depth.current_title}
                    </span>
                  </div>

                  {/* 5-Level Visual Ladder */}
                  <div className="depth-levels-ladder">
                    {metrics.depth.progression.map((lvl) => {
                      const isCurrent = lvl.level === metrics.depth?.current_level;
                      const isCompleted = lvl.level < (metrics.depth?.current_level || 1);
                      return (
                        <div
                          key={lvl.level}
                          className={`depth-step-item ${isCurrent ? 'current' : isCompleted ? 'completed' : 'locked'}`}
                        >
                          <div className="step-circle">
                            {isCompleted ? '✓' : lvl.level}
                          </div>
                          <span className="step-title">{lvl.title}</span>
                          <span className="step-desc">{lvl.description}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Explored Topics Tags */}
                  <div className="depth-topics-row">
                    <span className="topics-label">Discussed Topics:</span>
                    <div className="topics-tags-list">
                      {metrics.depth.topics_explored.map((topic, i) => (
                        <span key={i} className="topic-pill">
                          #{topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 6. Communication Patterns */}
              {metrics.patterns && (
                <div className="insight-card patterns-card">
                  <h4 className="card-heading">🔍 Observable Communication Patterns</h4>
                  <div className="patterns-boxes-row">
                    <div className="pattern-stat-box">
                      <span className="pat-label">Message Length Style</span>
                      <span className="pat-val">{metrics.patterns.message_length_style}</span>
                    </div>
                    <div className="pattern-stat-box">
                      <span className="pat-label">Peak Rhythm Hours</span>
                      <span className="pat-val">{metrics.patterns.peak_hours}</span>
                    </div>
                    <div className="pattern-stat-box">
                      <span className="pat-label">Question Reciprocity</span>
                      <span className="pat-val">{metrics.patterns.question_reciprocity}</span>
                    </div>
                  </div>
                  <p className="pattern-summary-text">
                    💡 <em>{metrics.patterns.observation_summary}</em>
                  </p>
                </div>
              )}

              {/* 7. Explore Deeper Conversations (AI Starters) */}
              {metrics.deeper_starters.length > 0 && (
                <div className="insight-card deeper-starters-card">
                  <div className="card-header-line">
                    <div>
                      <h4 className="card-heading">🚀 Explore Deeper Conversations</h4>
                      <p className="card-subheading">Personalized prompts to expand beyond routine chat</p>
                    </div>
                  </div>

                  <div className="starters-cards-grid">
                    {metrics.deeper_starters.map((starter, i) => (
                      <div key={i} className="deeper-starter-item">
                        <span className="starter-theme-badge">{starter.theme}</span>
                        <p className="starter-question-text">"{starter.question}"</p>
                        <p className="starter-why-text">{starter.why_it_connects}</p>
                        {onUseStarter && (
                          <button
                            type="button"
                            className="use-starter-btn"
                            onClick={() => {
                              onUseStarter(starter.question);
                              onClose();
                            }}
                          >
                            💬 Send to Chat
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Ethical Disclaimer Footer */}
        <div className="insights-modal-footer">
          <p className="ethical-disclaimer-text">
            ⚖️ <strong>Ethical AI Guardrails:</strong> {metrics?.ethical_disclaimer ||
              'Connection Intelligence provides constructive observations to support mindful communication. It never assigns empathy scores, diagnoses personality, or recommends relationship decisions.'}
          </p>
        </div>
      </div>
    </div>
  );
};
