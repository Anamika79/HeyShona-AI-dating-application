import React, { useState, useEffect } from 'react';
import { Connection } from '../../types/chat';
import {
  DatePreferenceProfile,
  DatePlanResponse,
  DateConcept,
  SavedDatePlan,
} from '../../types/datePlanner';
import { fetchDatePreferences, generateDatePlan } from '../../api/datePlanner';
import { DatePreferencesModal } from './DatePreferencesModal';

interface DatePlannerSectionProps {
  connections: Connection[];
  currentUserName?: string;
  onExploreConnections?: () => void;
}

const LOCAL_STORAGE_SAVED_PLANS = 'hey_shona_saved_date_plans';

export const DatePlannerSection: React.FC<DatePlannerSectionProps> = ({
  connections,
  currentUserName = 'Anamika',
  onExploreConnections,
}) => {
  // Active selected match
  const [selectedMatchId, setSelectedMatchId] = useState<string>(() => {
    return connections.length > 0 ? connections[0].user.id : '';
  });

  // Current user's preferences & Match preferences
  const [userPrefs, setUserPrefs] = useState<DatePreferenceProfile | null>(null);
  const [matchPrefs, setMatchPrefs] = useState<DatePreferenceProfile | null>(null);

  // Date Configuration Form Inputs
  const [city, setCity] = useState<string>('Bengaluru, India');
  const [preferredDate, setPreferredDate] = useState<string>('Upcoming Weekend');
  const [timeOfDay, setTimeOfDay] = useState<string>('Late Afternoon & Evening');
  const [budgetRange, setBudgetRange] = useState<string>('Moderate (₹1,500 - ₹3,000)');
  const [dateType, setDateType] = useState<string>('Creative & Relaxed');
  const [additionalNotes, setAdditionalNotes] = useState<string>('');

  // Generation state & results
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedPlan, setGeneratedPlan] = useState<DatePlanResponse | null>(null);
  const [activeConceptId, setActiveConceptId] = useState<string | null>(null);

  // Modals & saved plans
  const [isPrefsModalOpen, setIsPrefsModalOpen] = useState<boolean>(false);
  const [showSavedPlans, setShowSavedPlans] = useState<boolean>(false);
  const [savedPlans, setSavedPlans] = useState<SavedDatePlan[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_SAVED_PLANS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const selectedConnection = connections.find((c) => c.user.id === selectedMatchId) || connections[0];

  // Fetch current user preferences on mount
  useEffect(() => {
    fetchDatePreferences('current_user', currentUserName)
      .then((data) => setUserPrefs(data))
      .catch((err) => console.error('Failed to load user date preferences:', err));
  }, [currentUserName]);

  // Fetch selected match preferences when connection changes
  useEffect(() => {
    if (selectedConnection) {
      fetchDatePreferences(selectedConnection.user.id, selectedConnection.user.name)
        .then((data) => setMatchPrefs(data))
        .catch((err) => console.error('Failed to load match date preferences:', err));
    }
  }, [selectedConnection]);

  // Save plans persistence
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_SAVED_PLANS, JSON.stringify(savedPlans));
    } catch {
      // ignore
    }
  }, [savedPlans]);

  const handleGeneratePlan = async () => {
    if (!selectedConnection) return;
    setLoading(true);
    setError(null);

    try {
      const payload = {
        connection_id: selectedConnection.user.id,
        user_name: currentUserName,
        match_name: selectedConnection.user.name,
        match_profile: selectedConnection.user.profile_data,
        user_preferences: userPrefs || undefined,
        match_preferences: matchPrefs || undefined,
        city,
        preferred_date: preferredDate,
        preferred_time_of_day: timeOfDay,
        budget_range: budgetRange,
        date_type: dateType,
        additional_notes: additionalNotes.trim() ? additionalNotes.trim() : null,
      };

      const res = await generateDatePlan(payload);
      setGeneratedPlan(res);
      if (res.concepts.length > 0) {
        setActiveConceptId(res.concepts[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate date recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConcept = (concept: DateConcept) => {
    if (!selectedConnection) return;
    const exists = savedPlans.some((p) => p.concept.id === concept.id && p.matchId === selectedConnection.user.id);
    if (exists) {
      setSaveSuccessMsg(`"${concept.title}" is already in your saved plans!`);
      setTimeout(() => setSaveSuccessMsg(null), 3000);
      return;
    }

    const newSaved: SavedDatePlan = {
      id: `saved_${Date.now()}`,
      matchId: selectedConnection.user.id,
      matchName: selectedConnection.user.name,
      matchAvatar: selectedConnection.user.avatar_url,
      city,
      concept,
      savedAt: 'Just now',
    };

    setSavedPlans([newSaved, ...savedPlans]);
    setSaveSuccessMsg(`Saved "${concept.title}" to your favorites! 💖`);
    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  const handleRemoveSavedPlan = (id: string) => {
    setSavedPlans(savedPlans.filter((p) => p.id !== id));
  };

  if (connections.length === 0) {
    return (
      <div className="planner-empty-view">
        <div className="empty-graphic">🍷</div>
        <h2>Connect First to Plan Dates</h2>
        <p>
          AI-Powered Date Planner designs tailored experiences using the shared compatibility, food preferences, and energy rhythms of both you and your connection.
        </p>
        {onExploreConnections && (
          <button className="home-primary-btn" onClick={onExploreConnections}>
            🌟 Discover Compatible People First
          </button>
        )}
      </div>
    );
  }

  const activeConcept = generatedPlan?.concepts.find((c) => c.id === activeConceptId) || generatedPlan?.concepts[0];

  return (
    <div className="date-planner-container">
      {/* Top Banner */}
      <div className="planner-hero-header">
        <div className="planner-hero-text">
          <div className="planner-badge">
            <span className="badge-sparkle">🍷</span>
            <span>Intelligent Date Experience Planner</span>
          </div>
          <h2 className="planner-main-title">Curate a Meaningful Date Experience</h2>
          <p className="planner-main-subtitle">
            AI synthesizes both your personal preferences, your match's dietary habits, and shared values to generate low-pressure, memorable itineraries.
          </p>
        </div>

        <div className="planner-top-actions">
          <button
            type="button"
            className="planner-action-btn secondary"
            onClick={() => setIsPrefsModalOpen(true)}
            title="Edit your personal food, budget, and activity preferences"
          >
            <span>⚙️ My Date Preferences</span>
          </button>
          <button
            type="button"
            className={`planner-action-btn ${showSavedPlans ? 'active' : ''}`}
            onClick={() => setShowSavedPlans(!showSavedPlans)}
            title="View your saved favorite date itineraries"
          >
            <span>💖 Saved Plans ({savedPlans.length})</span>
          </button>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="planner-toast">
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* View Saved Plans Overlay / Mode */}
      {showSavedPlans ? (
        <div className="saved-plans-view">
          <div className="saved-plans-header">
            <h3>💖 Saved Date Itineraries ({savedPlans.length})</h3>
            <button
              type="button"
              className="close-saved-btn"
              onClick={() => setShowSavedPlans(false)}
            >
              ✕ Back to Planner
            </button>
          </div>

          {savedPlans.length === 0 ? (
            <div className="saved-empty-card">
              <span className="empty-icon">📂</span>
              <p>No saved plans yet. Generate date ideas below and click <strong>"Save Plan 💖"</strong> to store them here!</p>
            </div>
          ) : (
            <div className="saved-plans-grid">
              {savedPlans.map((item) => (
                <div key={item.id} className="saved-plan-card">
                  <div className="saved-plan-top">
                    <img src={item.matchAvatar} alt={item.matchName} className="saved-match-avatar" />
                    <div>
                      <h4 className="saved-plan-title">{item.concept.title}</h4>
                      <span className="saved-plan-meta">With {item.matchName} • {item.city}</span>
                    </div>
                    <button
                      type="button"
                      className="remove-saved-btn"
                      onClick={() => handleRemoveSavedPlan(item.id)}
                      title="Remove from saved"
                    >
                      🗑️
                    </button>
                  </div>
                  <p className="saved-plan-desc">{item.concept.description}</p>
                  <div className="saved-plan-tags">
                    <span className="saved-tag">{item.concept.date_type}</span>
                    <span className="saved-tag">{item.concept.estimated_total_cost}</span>
                    <span className="saved-tag">{item.concept.estimated_duration}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Step 1 & 2: Select Connection Bar */}
          <div className="planner-section-card">
            <div className="step-header-row">
              <span className="step-num">Step 1</span>
              <h3 className="step-title">Select Who You Want to Plan a Date With</h3>
            </div>
            <div className="connections-picker-row">
              {connections.map((conn) => {
                const isSelected = conn.user.id === selectedConnection.user.id;
                return (
                  <div
                    key={conn.id}
                    className={`conn-pick-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedMatchId(conn.user.id);
                      setGeneratedPlan(null); // reset to let user generate fresh for new match
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="conn-pick-avatar-wrap">
                      <img
                        src={conn.user.avatar_url}
                        alt={conn.user.name}
                        className="conn-pick-avatar"
                      />
                      {isSelected && <span className="conn-pick-badge">Selected ✓</span>}
                    </div>
                    <div className="conn-pick-info">
                      <h4 className="conn-pick-name">{conn.user.name}, {conn.user.age}</h4>
                      <p className="conn-pick-job">{conn.user.occupation}</p>
                      <span className="conn-pick-loc">{conn.user.location}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 3: Match's Shared Preferences Profile Card */}
          {matchPrefs && selectedConnection && (
            <div className="planner-section-card match-prefs-card">
              <div className="step-header-row">
                <span className="step-num">Step 2</span>
                <h3 className="step-title">{selectedConnection.user.name}'s Shared Date Preferences</h3>
                <span className="privacy-pill">🔒 Voluntarily Shared for Planning</span>
              </div>

              <div className="match-prefs-grid">
                <div className="match-pref-col">
                  <span className="pref-label">Food & Drinks:</span>
                  <div className="pref-chips-list">
                    {matchPrefs.food_preferences.map((f, i) => (
                      <span key={i} className="chip-pill food">☕ {f}</span>
                    ))}
                  </div>
                </div>

                <div className="match-pref-col">
                  <span className="pref-label">Enjoys:</span>
                  <div className="pref-chips-list">
                    {matchPrefs.favorite_activities.map((a, i) => (
                      <span key={i} className="chip-pill activity">✨ {a}</span>
                    ))}
                  </div>
                </div>

                <div className="match-pref-col">
                  <span className="pref-label">Dislikes / Avoids:</span>
                  <div className="pref-chips-list">
                    {matchPrefs.disliked_activities.map((d, i) => (
                      <span key={i} className="chip-pill disliked">🚫 {d}</span>
                    ))}
                  </div>
                </div>

                <div className="match-pref-col">
                  <span className="pref-label">Ideal Vibe & Setting:</span>
                  <p className="pref-text-val">
                    {matchPrefs.vibe_preference} • {matchPrefs.environment_preference}
                  </p>
                  {matchPrefs.accessibility_notes && (
                    <span className="pref-pacing-note">ℹ️ {matchPrefs.accessibility_notes}</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Date Configuration Input Form */}
          <div className="planner-section-card">
            <div className="step-header-row">
              <span className="step-num">Step 3</span>
              <h3 className="step-title">Configure Date Parameters & Details</h3>
            </div>

            <div className="planner-form-grid">
              {/* City / Location */}
              <div className="planner-field">
                <label>Target City / Neighborhood</label>
                <input
                  type="text"
                  className="date-input-text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Bengaluru, Indiranagar"
                />
              </div>

              {/* Date Timing */}
              <div className="planner-field">
                <label>Preferred Date</label>
                <select
                  className="date-input-select"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                >
                  <option value="Upcoming Weekend">Upcoming Weekend</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                  <option value="Friday After-Work">Friday After-Work</option>
                  <option value="Weekday Evening">Weekday Evening</option>
                </select>
              </div>

              {/* Time of Day */}
              <div className="planner-field">
                <label>Time of Day</label>
                <select
                  className="date-input-select"
                  value={timeOfDay}
                  onChange={(e) => setTimeOfDay(e.target.value)}
                >
                  <option value="Late Afternoon & Evening">Late Afternoon & Evening</option>
                  <option value="Morning (Coffee & Walk)">Morning (Coffee & Walk)</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Dinner & Night">Dinner & Night</option>
                </select>
              </div>

              {/* Date Type */}
              <div className="planner-field">
                <label>Date Experience Type</label>
                <select
                  className="date-input-select"
                  value={dateType}
                  onChange={(e) => setDateType(e.target.value)}
                >
                  <option value="Creative & Relaxed">Creative & Relaxed</option>
                  <option value="Romantic & Intimate">Romantic & Intimate</option>
                  <option value="Restorative & Restful">Restorative & Restful (Low-Stress)</option>
                  <option value="Food & Culinary Tasting">Food & Culinary Tasting</option>
                  <option value="Cultural & Art Walk">Cultural & Art Walk</option>
                  <option value="Playful & Inspiring">Playful & Inspiring</option>
                </select>
              </div>

              {/* Budget Range */}
              <div className="planner-field">
                <label>Budget Range</label>
                <select
                  className="date-input-select"
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                >
                  <option value="Budget-friendly (Under ₹1,200)">Budget-friendly (Under ₹1,200)</option>
                  <option value="Moderate (₹1,500 - ₹3,000)">Moderate (₹1,500 - ₹3,000)</option>
                  <option value="Premium Experience (₹3,000 - ₹5,000)">Premium Experience (₹3,000 - ₹5,000)</option>
                </select>
              </div>

              {/* Custom Prompt / Notes */}
              <div className="planner-field full-width">
                <label>Special Instructions or Context (Optional)</label>
                <input
                  type="text"
                  className="date-input-text"
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder={`e.g. ${selectedConnection.user.name} had a demanding week, so avoid crowded places and pick cozy seating.`}
                />
              </div>
            </div>

            <div className="planner-submit-row">
              <button
                type="button"
                className="planner-generate-btn"
                onClick={handleGeneratePlan}
                disabled={loading}
              >
                {loading ? (
                  <span>⏳ Crafting Date Itineraries with Gemini...</span>
                ) : (
                  <span>✨ Generate 3 Personalized Date Concepts</span>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="planner-error-box">
              <span>⚠️ {error}</span>
            </div>
          )}

          {/* Step 5: Generated Date Concepts Cards */}
          {generatedPlan && (
            <div className="planner-results-section">
              <div className="synergy-summary-banner">
                <div className="synergy-top-row">
                  <span className="synergy-sparkle">✨</span>
                  <span className="synergy-title">AI Compatibility & Synergy Analysis</span>
                </div>
                <p className="synergy-text">{generatedPlan.personalized_synergy_summary}</p>
              </div>

              <div className="concepts-cards-grid">
                {generatedPlan.concepts.map((concept, idx) => {
                  const isActive = concept.id === activeConceptId;
                  return (
                    <div
                      key={concept.id}
                      className={`concept-card ${isActive ? 'active' : ''}`}
                      onClick={() => setActiveConceptId(concept.id)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="concept-card-top">
                        <span className="concept-index">Option {idx + 1}</span>
                        <span className="concept-type-chip">{concept.date_type}</span>
                      </div>

                      <h4 className="concept-title">{concept.title}</h4>
                      <p className="concept-tagline">"{concept.tagline}"</p>
                      <p className="concept-desc">{concept.description}</p>

                      <div className="concept-meta-row">
                        <span className="meta-badge">⏱️ {concept.estimated_duration}</span>
                        <span className="meta-badge">💰 {concept.estimated_total_cost}</span>
                        <span className="meta-badge">🌿 {concept.indoor_outdoor}</span>
                      </div>

                      <div className="concept-why-box">
                        <span className="why-label">Why it works for both:</span>
                        <p className="why-text">{concept.why_it_suits_both}</p>
                      </div>

                      <div className="concept-actions-row">
                        <button
                          type="button"
                          className={`view-itinerary-btn ${isActive ? 'active' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveConceptId(concept.id);
                          }}
                        >
                          {isActive ? 'Showing Itinerary Below ✓' : 'View Structured Itinerary 🗓️'}
                        </button>
                        <button
                          type="button"
                          className="save-concept-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSaveConcept(concept);
                          }}
                          title="Save this plan to your favorites"
                        >
                          💖 Save Plan
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Step 6: Detailed Structured Itinerary */}
              {activeConcept && (
                <div className="detailed-itinerary-card">
                  <div className="itinerary-header">
                    <div>
                      <span className="itinerary-tag">Complete Date Itinerary</span>
                      <h3 className="itinerary-title">{activeConcept.title}</h3>
                      <p className="itinerary-subtitle">
                        Estimated {activeConcept.estimated_duration} • {activeConcept.estimated_total_cost} • {activeConcept.indoor_outdoor}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="save-concept-btn highlight"
                      onClick={() => handleSaveConcept(activeConcept)}
                    >
                      💖 Save to My Plans
                    </button>
                  </div>

                  {/* Sequence Timeline */}
                  <div className="itinerary-timeline">
                    {activeConcept.itinerary.map((step) => (
                      <div key={step.step_number} className="timeline-step">
                        <div className="step-indicator">
                          <span className="step-circle-badge">{step.step_number}</span>
                          <span className="step-line" />
                        </div>

                        <div className="step-body-card">
                          <div className="step-time-row">
                            <span className="step-time">{step.time_slot}</span>
                            <span className="step-cost-pill">{step.estimated_cost}</span>
                          </div>
                          <h4 className="step-activity-name">{step.activity_name}</h4>
                          <p className="step-desc">{step.description}</p>
                          <div className="step-badges-row">
                            <span className="step-type-badge">📍 {step.location_type}</span>
                            <span className="step-type-badge">⛅ {step.indoor_outdoor}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Logistics, Travel Tips & Weather Backup */}
                  <div className="itinerary-logistics-grid">
                    <div className="logistics-col">
                      <span className="logistics-heading">🚗 Travel & Transit Considerations</span>
                      <p className="logistics-text">{activeConcept.travel_tips}</p>
                    </div>

                    <div className="logistics-col">
                      <span className="logistics-heading">🌦️ Weather Backup & Alternatives</span>
                      <p className="logistics-text">{activeConcept.alternative_options}</p>
                    </div>

                    <div className="logistics-col">
                      <span className="logistics-heading">💡 Tips to Keep in Mind</span>
                      <ul className="logistics-list">
                        {activeConcept.things_to_consider.map((tip, i) => (
                          <li key={i}>• {tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Date Preferences Modal */}
      {userPrefs && (
        <DatePreferencesModal
          isOpen={isPrefsModalOpen}
          onClose={() => setIsPrefsModalOpen(false)}
          currentPreferences={userPrefs}
          onSaved={(updated) => setUserPrefs(updated)}
        />
      )}
    </div>
  );
};
