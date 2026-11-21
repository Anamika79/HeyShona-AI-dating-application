import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { analyzeProfile } from '../../api/profile';
import { BasicProfile, ProfileIntelligenceData } from '../../types/profile';
import { ProfileIntelligenceResults } from './ProfileIntelligenceResults';

const SAMPLE_PROFILES = [
  {
    label: 'Adventurer & Techie',
    text: 'I enjoy travelling to remote mountain trails, experimenting with open-source tech, and playing football on weekends. I value honesty, mutual independence, and late-night meaningful conversations over small talk. Please no ghosting.',
  },
  {
    label: 'Mindful Creative & Reader',
    text: 'Architecture designer who loves slow coffee mornings, indie cinema, and philosophy books. Kindness and intellectual curiosity are non-negotiable for me. Looking for an intentional, long-term relationship where we encourage each other’s creative growth.',
  },
  {
    label: 'Foodie & Community Organizer',
    text: 'Community organizer by day, home chef by night. I value social justice, family dinners, and deep listening. I prefer calling over endless texting, and I strictly need partners who respect personal time for community volunteering.',
  },
];

interface ProfileIntelligenceSectionProps {
  basicProfile?: BasicProfile;
  onUpdateExtractedData?: (data: ProfileIntelligenceData) => void;
}

export const ProfileIntelligenceSection: React.FC<ProfileIntelligenceSectionProps> = ({
  basicProfile,
  onUpdateExtractedData,
}) => {
  const [profileText, setProfileText] = useState<string>(() => {
    if (basicProfile?.name) {
      return `Hi, I am ${basicProfile.name}, a ${basicProfile.age}-year-old ${basicProfile.job} based in ${basicProfile.location}. ${basicProfile.bio}`;
    }
    return SAMPLE_PROFILES[0].text;
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ProfileIntelligenceData | null>(null);

  const handleAnalyze = async (textToAnalyze?: string) => {
    const text = (textToAnalyze !== undefined ? textToAnalyze : profileText).trim();
    if (!text) {
      setError('Please provide profile text or select an example above.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await analyzeProfile({ profile_text: text });
      setResult(response.response);
      if (onUpdateExtractedData) {
        onUpdateExtractedData(response.response);
      }
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Failed to analyze profile with Gemini AI.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadBasicProfile = () => {
    if (!basicProfile) return;
    const text = `Hi, I am ${basicProfile.name}, a ${basicProfile.age}-year-old ${basicProfile.job} based in ${basicProfile.location}. ${basicProfile.bio}`;
    setProfileText(text);
    setError(null);
  };

  const handleSelectSample = (sampleText: string) => {
    setProfileText(sampleText);
    setError(null);
  };

  // Callback when a user answers a follow-up question right away
  const handleFollowupAnswerSubmit = async (answeredText: string) => {
    const newFullBio = profileText.trim() + answeredText;
    setProfileText(newFullBio);
    await handleAnalyze(newFullBio);
  };

  return (
    <div className="feature-section">
      <Card
        title="AI Profile Intelligence Analyzer"
        subtitle="Extract genuine values, communication preferences, and lifestyle drivers directly from freeform profile text."
      >
        <div className="analyzer-controls">
          <div className="samples-row">
            <span className="samples-label">Choose Bio Source:</span>
            <div className="samples-buttons">
              {basicProfile && (
                <button
                  type="button"
                  className="sample-pill active-source-pill"
                  onClick={handleLoadBasicProfile}
                  disabled={loading}
                >
                  👤 My Profile ({basicProfile.name})
                </button>
              )}
              {SAMPLE_PROFILES.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`sample-pill ${profileText === sample.text ? 'active' : ''}`}
                  onClick={() => handleSelectSample(sample.text)}
                  disabled={loading}
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>

          <div className="input-group">
            <textarea
              className="profile-textarea"
              rows={4}
              placeholder="Paste or write any user profile bio, dating prompt answer, or introduction here..."
              value={profileText}
              onChange={(e) => setProfileText(e.target.value)}
              disabled={loading}
            />
            <div className="textarea-footer">
              <span className="char-count">{profileText.length} characters</span>
              <Button
                variant="primary"
                onClick={() => handleAnalyze()}
                disabled={loading || !profileText.trim()}
              >
                {loading ? 'Analyzing with Gemini...' : 'Analyze with Gemini AI ✨'}
              </Button>
            </div>
          </div>

          {error && (
            <div className="analyzer-error">
              <span className="error-icon">⚠️</span>
              <div>
                <strong>Analysis Failed:</strong> {error}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Render Results when available */}
      {result && (
        <ProfileIntelligenceResults
          data={result}
          onAnswerSubmit={handleFollowupAnswerSubmit}
          isSubmittingAnswer={loading}
        />
      )}
    </div>
  );
};
