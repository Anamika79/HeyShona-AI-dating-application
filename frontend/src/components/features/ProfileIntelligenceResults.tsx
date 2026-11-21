import React, { useState } from 'react';
import { ProfileIntelligenceData } from '../../types/profile';
import { Button } from '../common/Button';

interface ProfileIntelligenceResultsProps {
  data: ProfileIntelligenceData;
  onAnswerSubmit?: (answeredText: string) => void;
  isSubmittingAnswer?: boolean;
}

export const ProfileIntelligenceResults: React.FC<ProfileIntelligenceResultsProps> = ({
  data,
  onAnswerSubmit,
  isSubmittingAnswer = false,
}) => {
  const {
    core_values,
    interests_and_lifestyle,
    personality_insights,
    relationship_expectations,
    communication_preferences,
    personal_boundaries,
    missing_information,
  } = data;

  // Track answer inputs per question index
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [activeQuestionIdx, setActiveQuestionIdx] = useState<number | null>(null);

  const handleAnswerChange = (idx: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [idx]: value }));
  };

  const handleSaveAndReanalyze = (idx: number) => {
    const question = missing_information.recommended_follow_up_questions[idx];
    const answer = answers[idx]?.trim();
    if (!answer || !onAnswerSubmit) return;

    // Combine as prompt/answer addition
    const addition = `\n\nQ: ${question}\nA: ${answer}`;
    onAnswerSubmit(addition);
    // Clear answer input after submit
    setAnswers((prev) => {
      const copy = { ...prev };
      delete copy[idx];
      return copy;
    });
    setActiveQuestionIdx(null);
  };

  return (
    <div className="results-container">
      <div className="results-header">
        <div className="results-title-badge">AI Analysis Complete</div>
        <h3 className="results-title">Extracted Profile Intelligence</h3>
        <p className="results-subtitle">
          Grounded exclusively in user-stated evidence, without assumptions or hallucinated traits.
        </p>
      </div>

      <div className="results-grid">
        {/* Core Values */}
        <div className="result-card">
          <div className="result-card-header">
            <span className="result-card-icon">💎</span>
            <h4>Core Values ({core_values.length})</h4>
          </div>
          {core_values.length === 0 ? (
            <p className="empty-dimension">No explicit core values stated in profile.</p>
          ) : (
            <div className="tags-list">
              {core_values.map((v, i) => (
                <div key={i} className="insight-item">
                  <div className="item-main">
                    <span className="item-title value-tag">{v.value}</span>
                    <span className="badge-subtle">{v.is_explicit ? 'explicit' : 'cautious'}</span>
                  </div>
                  <div className="evidence-quote">“{v.evidence}”</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Interests & Lifestyle */}
        <div className="result-card">
          <div className="result-card-header">
            <span className="result-card-icon">🎯</span>
            <h4>Interests & Lifestyle ({interests_and_lifestyle.length})</h4>
          </div>
          {interests_and_lifestyle.length === 0 ? (
            <p className="empty-dimension">No hobbies or activities mentioned.</p>
          ) : (
            <div className="tags-list">
              {interests_and_lifestyle.map((item, i) => (
                <div key={i} className="insight-item">
                  <div className="item-main">
                    <span className="item-title interest-tag">{item.interest}</span>
                    {item.category && <span className="category-pill">{item.category}</span>}
                  </div>
                  <div className="evidence-quote">“{item.evidence}”</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Communication Preferences */}
        <div className="result-card">
          <div className="result-card-header">
            <span className="result-card-icon">💬</span>
            <h4>Communication Style ({communication_preferences.length})</h4>
          </div>
          {communication_preferences.length === 0 ? (
            <p className="empty-dimension">Communication cadence or medium not specified.</p>
          ) : (
            <div className="tags-list">
              {communication_preferences.map((p, i) => (
                <div key={i} className="insight-item">
                  <div className="item-main">
                    <span className="item-title">{p.preference}</span>
                  </div>
                  <div className="evidence-quote">“{p.evidence}”</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Relationship Expectations */}
        <div className="result-card">
          <div className="result-card-header">
            <span className="result-card-icon">🤝</span>
            <h4>Relationship Expectations ({relationship_expectations.length})</h4>
          </div>
          {relationship_expectations.length === 0 ? (
            <p className="empty-dimension">No partnership goals or relationship intentions stated.</p>
          ) : (
            <div className="tags-list">
              {relationship_expectations.map((exp, i) => (
                <div key={i} className="insight-item">
                  <div className="item-main">
                    <span className="item-title">{exp.expectation}</span>
                  </div>
                  <div className="evidence-quote">“{exp.evidence}”</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Personality Insights */}
        {personality_insights.length > 0 && (
          <div className="result-card">
            <div className="result-card-header">
              <span className="result-card-icon">🧠</span>
              <h4>Personality Insights ({personality_insights.length})</h4>
            </div>
            <div className="tags-list">
              {personality_insights.map((pi, i) => (
                <div key={i} className="insight-item">
                  <div className="item-main">
                    <span className="item-title">{pi.trait}</span>
                    {pi.confidence && <span className="badge-subtle">{pi.confidence}</span>}
                  </div>
                  <div className="evidence-quote">“{pi.evidence}”</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Personal Boundaries */}
        {personal_boundaries.length > 0 && (
          <div className="result-card">
            <div className="result-card-header">
              <span className="result-card-icon">🛡️</span>
              <h4>Personal Boundaries ({personal_boundaries.length})</h4>
            </div>
            <div className="tags-list">
              {personal_boundaries.map((b, i) => (
                <div key={i} className="insight-item">
                  <div className="item-main">
                    <span className="item-title">{b.boundary}</span>
                  </div>
                  <div className="evidence-quote">“{b.evidence}”</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Missing Information & Recommended Follow-up Prompts with Instant Answering */}
      {(missing_information.unknown_aspects.length > 0 ||
        missing_information.recommended_follow_up_questions.length > 0) && (
        <div className="followup-card">
          <div className="followup-header">
            <span className="result-card-icon">💡</span>
            <div>
              <h4>Recommended Follow-up Questions for Depth</h4>
              <p className="followup-desc">
                Answer any question right away to enrich your profile intelligence and re-analyze instantly:
              </p>
            </div>
          </div>

          {missing_information.recommended_follow_up_questions.length > 0 && (
            <div className="questions-list">
              {missing_information.recommended_follow_up_questions.map((q, idx) => {
                const isOpen = activeQuestionIdx === idx;
                const answerVal = answers[idx] || '';

                return (
                  <div key={idx} className="question-interactive-block">
                    <div
                      className={`question-bubble clickable ${isOpen ? 'active' : ''}`}
                      onClick={() => setActiveQuestionIdx(isOpen ? null : idx)}
                    >
                      <span className="q-number">Q{idx + 1}</span>
                      <span className="q-text">{q}</span>
                      <button
                        type="button"
                        className="q-action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveQuestionIdx(isOpen ? null : idx);
                        }}
                      >
                        {isOpen ? 'Close' : '✍️ Answer'}
                      </button>
                    </div>

                    {isOpen && (
                      <div className="inline-answer-box">
                        <textarea
                          rows={2}
                          className="inline-answer-input"
                          placeholder="Type your authentic answer here..."
                          value={answerVal}
                          onChange={(e) => handleAnswerChange(idx, e.target.value)}
                          disabled={isSubmittingAnswer}
                          autoFocus
                        />
                        <div className="inline-answer-actions">
                          <span className="answer-hint">
                            Adding this will update your profile text and re-trigger Gemini analysis.
                          </span>
                          <Button
                            variant="primary"
                            onClick={() => handleSaveAndReanalyze(idx)}
                            disabled={isSubmittingAnswer || !answerVal.trim()}
                          >
                            {isSubmittingAnswer ? 'Submitting & Updating...' : 'Submit & Update Intelligence 🚀'}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {missing_information.unknown_aspects.length > 0 && (
            <div className="unknown-aspects-section">
              <span className="aspects-label">Unaddressed Dimensions:</span>
              <div className="aspects-tags">
                {missing_information.unknown_aspects.map((aspect, idx) => (
                  <span key={idx} className="aspect-tag">
                    {aspect}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
