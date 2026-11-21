import React, { useState, useEffect } from 'react';
import { UserProfileSummary } from '../../types/compatibility';
import { fetchCupidAdvice, CupidAdviceResponse } from '../../api/cupid';

interface CupidAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: UserProfileSummary;
  userName?: string;
  onUseStarter?: (text: string) => void;
}

export const CupidAssistantModal: React.FC<CupidAssistantModalProps> = ({
  isOpen,
  onClose,
  match,
  userName = 'Anamika',
  onUseStarter,
}) => {
  const [activeTab, setActiveTab] = useState<'starters' | 'revive' | 'guidance' | 'custom'>('starters');
  const [advice, setAdvice] = useState<CupidAdviceResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [customQuestion, setCustomQuestion] = useState<string>('');
  const [customReply, setCustomReply] = useState<string | null>(null);
  const [customLoading, setCustomLoading] = useState<boolean>(false);

  // Load Cupid advice for this match when modal opens
  useEffect(() => {
    if (!isOpen || !match) return;

    const loadAdvice = async () => {
      setLoading(true);
      try {
        const res = await fetchCupidAdvice({
          user_name: userName,
          match_name: match.name,
          match_bio: match.bio,
          match_occupation: match.occupation,
          match_values: match.profile_data.core_values.map((v) => v.value),
          match_interests: match.profile_data.interests_and_lifestyle.map((i) => i.interest),
          match_communication:
            match.profile_data.communication_preferences.length > 0
              ? match.profile_data.communication_preferences[0].preference
              : undefined,
        });
        setAdvice(res);
      } catch {
        // Fallback handled gracefully
      } finally {
        setLoading(false);
      }
    };

    loadAdvice();
  }, [isOpen, match, userName]);

  const handleAskCustom = async (promptText?: string) => {
    const q = (promptText !== undefined ? promptText : customQuestion).trim();
    if (!q) return;

    setCustomLoading(true);
    setCustomReply(null);
    try {
      const res = await fetchCupidAdvice({
        user_name: userName,
        match_name: match.name,
        match_bio: match.bio,
        match_occupation: match.occupation,
        match_values: match.profile_data.core_values.map((v) => v.value),
        match_interests: match.profile_data.interests_and_lifestyle.map((i) => i.interest),
        user_query: q,
      });
      setCustomReply(res.custom_reply || res.cupid_vibe);
    } catch {
      setCustomReply(
        `Cupid says: Keep it genuine and light! Say something like: "Hey ${match.name}, I was thinking about trying this new coffee spot this weekend—would love to grab a cup together if you're free!" ☕`
      );
    } finally {
      setCustomLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="cupid-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Floating Close Button */}
        <button className="modal-close-btn" onClick={onClose} aria-label="Close Cupid">
          ✕
        </button>

        {/* Cupid Header with Bow & Arrow Theme */}
        <div className="cupid-header">
          <div className="cupid-avatar-wrap">
            <span className="cupid-wings-left">🪽</span>
            <div className="cupid-icon-circle">
              <span className="cupid-icon">🏹</span>
            </div>
            <span className="cupid-wings-right">🪽</span>
          </div>

          <div className="cupid-badge">💘 Cupid AI Dating Wingman</div>
          <h2 className="cupid-title">Cupid AI Assistant</h2>
          <p className="cupid-subtitle">
            Coaching and conversation spark for your connection with <strong>{match.name}</strong>
          </p>

          {/* Cupid Vibe Summary */}
          {advice?.cupid_vibe && (
            <div className="cupid-vibe-banner">
              <span className="vibe-sparkle">✨</span>
              <span>{advice.cupid_vibe}</span>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="cupid-tabs">
          <button
            type="button"
            className={`cupid-tab-btn ${activeTab === 'starters' ? 'active' : ''}`}
            onClick={() => setActiveTab('starters')}
          >
            <span>💡</span>
            <span>Starters</span>
          </button>
          <button
            type="button"
            className={`cupid-tab-btn ${activeTab === 'revive' ? 'active' : ''}`}
            onClick={() => setActiveTab('revive')}
          >
            <span>🌊</span>
            <span>Out of Topics?</span>
          </button>
          <button
            type="button"
            className={`cupid-tab-btn ${activeTab === 'guidance' ? 'active' : ''}`}
            onClick={() => setActiveTab('guidance')}
          >
            <span>🛡️</span>
            <span>Communication Guidance</span>
          </button>
          <button
            type="button"
            className={`cupid-tab-btn ${activeTab === 'custom' ? 'active' : ''}`}
            onClick={() => setActiveTab('custom')}
          >
            <span>💌</span>
            <span>Ask Cupid</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="cupid-tab-body">
          {loading && (
            <div className="cupid-loading">
              <div className="cupid-spinner" />
              <p>Cupid is consulting the love algorithm for {match.name}...</p>
            </div>
          )}

          {!loading && (
            <>
              {/* TAB 1: Conversation Starters */}
              {activeTab === 'starters' && (
                <div className="cupid-tab-content">
                  <div className="tab-section-intro">
                    <h4>Personalized Conversation Starters</h4>
                    <p>Designed by Cupid based on {match.name}'s hobbies and values:</p>
                  </div>

                  <div className="cupid-starters-list">
                    {(advice?.starters || [
                      `What first inspired you to get into ${match.occupation}?`,
                      `If you had an entire Sunday with zero obligations, what's your dream plan?`,
                      `What's something you're looking forward to this month?`,
                    ]).map((starter, i) => (
                      <div key={i} className="cupid-starter-card">
                        <div className="starter-content">
                          <span className="starter-number">#{i + 1}</span>
                          <p className="starter-text">{starter}</p>
                        </div>
                        {onUseStarter && (
                          <button
                            type="button"
                            className="use-starter-btn"
                            onClick={() => {
                              onUseStarter(starter);
                              onClose();
                            }}
                          >
                            Send to Chat 💬
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: Revive Conversation (Out of Topics) */}
              {activeTab === 'revive' && (
                <div className="cupid-tab-content">
                  <div className="tab-section-intro">
                    <h4>Revive the Conversation</h4>
                    <p>When the chat pauses or small talk dries up, Cupid recommends these exciting pivots:</p>
                  </div>

                  <div className="cupid-starters-list">
                    {(advice?.topic_revivers || [
                      "Hypothetical: We both get free plane tickets tomorrow for 48 hours—where are we going?",
                      "What's the most underrated spot in your city that you secretly love?",
                      "What's a song, book, or show that completely altered your mood recently?",
                    ]).map((reviver, i) => (
                      <div key={i} className="cupid-starter-card revive-card">
                        <div className="starter-content">
                          <span className="starter-number">✨</span>
                          <p className="starter-text">{reviver}</p>
                        </div>
                        {onUseStarter && (
                          <button
                            type="button"
                            className="use-starter-btn"
                            onClick={() => {
                              onUseStarter(reviver);
                              onClose();
                            }}
                          >
                            Send to Chat 💬
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: Communication Guidance */}
              {activeTab === 'guidance' && (
                <div className="cupid-tab-content">
                  <div className="tab-section-intro">
                    <h4>Communication Guidance & Alignment</h4>
                    <p>Tactical psychological coaching for healthy, attractive communication with {match.name}:</p>
                  </div>

                  <div className="cupid-tips-list">
                    {(advice?.communication_tips || [
                      `Match their thoughtful tone—${match.name} values substance and presence.`,
                      `Explore their passions in ${match.occupation} with genuine questions.`,
                      `Give room for unhurried replies; avoid spamming when they're in focus mode.`,
                    ]).map((tip, i) => (
                      <div key={i} className="cupid-tip-item">
                        <span className="tip-bullet">💘</span>
                        <p className="tip-text">{tip}</p>
                      </div>
                    ))}
                  </div>

                  <div className="cupid-coach-highlight">
                    <span className="coach-icon">🎯</span>
                    <div>
                      <strong>Cupid's Golden Rule:</strong>
                      <p>
                        Dating on Hey Shona is about authentic curiosity. Ask questions you genuinely want to hear the answers to, not questions you think they want you to ask!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: Ask Cupid Custom Advice */}
              {activeTab === 'custom' && (
                <div className="cupid-tab-content">
                  <div className="tab-section-intro">
                    <h4>Ask Cupid for Advice</h4>
                    <p>Need help asking for a date, writing a reply, or changing topics? Ask Cupid below:</p>
                  </div>

                  <div className="quick-questions-row">
                    <span className="quick-q-label">Quick Prompts:</span>
                    <button
                      type="button"
                      className="quick-q-chip"
                      onClick={() => handleAskCustom(`How should I casually ask ${match.name} out for a coffee date?`)}
                    >
                      ☕ Ask out for coffee
                    </button>
                    <button
                      type="button"
                      className="quick-q-chip"
                      onClick={() => handleAskCustom(`Give me a playful, flirty response to keep the vibe fun with ${match.name}.`)}
                    >
                      😉 Keep it playful & flirty
                    </button>
                    <button
                      type="button"
                      className="quick-q-chip"
                      onClick={() => handleAskCustom(`How do I ask ${match.name} about their weekend plans without being pushy?`)}
                    >
                      🗓️ Weekend plans check-in
                    </button>
                  </div>

                  <div className="custom-input-box">
                    <input
                      type="text"
                      className="custom-q-input"
                      placeholder={`e.g. How to ask ${match.name} about their favorite books?`}
                      value={customQuestion}
                      onChange={(e) => setCustomQuestion(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAskCustom();
                      }}
                    />
                    <button
                      type="button"
                      className="custom-ask-btn"
                      onClick={() => handleAskCustom()}
                      disabled={customLoading || !customQuestion.trim()}
                    >
                      {customLoading ? 'Consulting...' : 'Ask Cupid 🏹'}
                    </button>
                  </div>

                  {customReply && (
                    <div className="cupid-custom-reply-card">
                      <div className="reply-header">
                        <span>🏹 Cupid's Recommendation:</span>
                      </div>
                      <p className="reply-text">{customReply}</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
