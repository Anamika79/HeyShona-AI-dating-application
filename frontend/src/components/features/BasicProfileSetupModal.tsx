import React, { useState } from 'react';
import { BasicProfile, GenderType, LookingForType } from '../../types/profile';

interface BasicProfileSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: BasicProfile;
  onSaveProfile: (profile: BasicProfile) => void;
}

const GENDER_OPTIONS: { label: string; value: GenderType; icon: string }[] = [
  { label: 'Female', value: 'Female', icon: '👩' },
  { label: 'Male', value: 'Male', icon: '👨' },
  { label: 'LGBTQ+', value: 'LGBTQ+', icon: '🏳️‍🌈' },
];

const LOOKING_FOR_OPTIONS: { label: string; value: LookingForType; icon: string }[] = [
  { label: 'Female', value: 'Female', icon: '👩' },
  { label: 'Male', value: 'Male', icon: '👨' },
  { label: 'LGBTQ+', value: 'LGBTQ+', icon: '🏳️‍🌈' },
  { label: 'Everyone', value: 'Everyone', icon: '💫' },
];

export const BasicProfileSetupModal: React.FC<BasicProfileSetupModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSaveProfile,
}) => {
  const [name, setName] = useState(currentProfile.name);
  const [age, setAge] = useState<number>(currentProfile.age || 26);
  const [gender, setGender] = useState<GenderType>(currentProfile.gender || 'Female');
  const [location, setLocation] = useState(currentProfile.location);
  const [job, setJob] = useState(currentProfile.job);
  const [lookingFor, setLookingFor] = useState<LookingForType>(currentProfile.looking_for || 'Male');
  const [bio, setBio] = useState(currentProfile.bio);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSaveProfile({
      name: name.trim(),
      age: Number(age) || 26,
      gender,
      location: location.trim() || 'Bengaluru, India',
      job: job.trim() || 'Software Engineer',
      looking_for: lookingFor,
      bio: bio.trim() || 'Passionate about authentic conversations, personal growth, and weekend adventures.',
      avatar_url: currentProfile.avatar_url,
    });
    onClose();
  };

  const handleQuickFill = () => {
    setName('Anamika');
    setAge(26);
    setGender('Female');
    setLocation('Bengaluru, India');
    setJob('Product Designer & Art Enthusiast');
    setLookingFor('Male');
    setBio('Passionate about art, typography, and specialty coffee. Looking for genuine empathy, intellectual banter, and mindful weekend trail walks.');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card basic-profile-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close setup">
          ✕
        </button>

        <div className="setup-modal-header">
          <div className="setup-badge">✨ Profile Setup</div>
          <h2 className="setup-title">Your Basic Profile</h2>
          <p className="setup-subtitle">
            Tell us about yourself to calibrate your AI Compatibility Engine and profile intelligence.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="setup-form">
          {/* Name & Age Row */}
          <div className="setup-row-2">
            <div className="setup-field">
              <label className="setup-label">
                Full Name <span className="required-star">*</span>
              </label>
              <input
                type="text"
                className="setup-input"
                placeholder="e.g. Anamika"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="setup-field">
              <label className="setup-label">
                Age <span className="required-star">*</span>
              </label>
              <input
                type="number"
                min={18}
                max={99}
                className="setup-input"
                placeholder="e.g. 26"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                required
              />
            </div>
          </div>

          {/* Gender Selector */}
          <div className="setup-field">
            <label className="setup-label">
              Gender Identity <span className="required-star">*</span>
            </label>
            <div className="pills-selector">
              {GENDER_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  className={`pill-option ${gender === opt.value ? 'selected' : ''}`}
                  onClick={() => setGender(opt.value)}
                >
                  <span className="pill-icon">{opt.icon}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Location & Job Row */}
          <div className="setup-row-2">
            <div className="setup-field">
              <label className="setup-label">
                Location <span className="required-star">*</span>
              </label>
              <input
                type="text"
                className="setup-input"
                placeholder="e.g. Bengaluru, India"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>

            <div className="setup-field">
              <label className="setup-label">
                Job / Occupation <span className="required-star">*</span>
              </label>
              <input
                type="text"
                className="setup-input"
                placeholder="e.g. Product Designer"
                value={job}
                onChange={(e) => setJob(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Anonymous Looking For Field */}
          <div className="setup-field anonymous-looking-field">
            <div className="anonymous-header-row">
              <label className="setup-label">
                Looking For:
              </label>
              <span className="anonymous-pill">🔒 Anonymous & Private</span>
            </div>
            <p className="anonymous-helper-text">
              This choice is strictly private. It will <strong>NOT</strong> appear on your profile. The AI Compatibility Engine uses this to match candidate profiles based on gender.
            </p>
            <div className="pills-selector">
              {LOOKING_FOR_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  className={`pill-option ${lookingFor === opt.value ? 'selected' : ''}`}
                  onClick={() => setLookingFor(opt.value)}
                >
                  <span className="pill-icon">{opt.icon}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* About Me / Bio */}
          <div className="setup-field">
            <label className="setup-label">
              About Me (In Brief)
            </label>
            <textarea
              className="setup-textarea"
              rows={3}
              placeholder="A few lines on what you love, what excites you, and what you value in human connections..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="setup-actions">
            <button
              type="button"
              className="quickfill-btn"
              onClick={handleQuickFill}
            >
              🪄 Fill Demo Sample
            </button>
            <button type="submit" className="save-profile-btn">
              Save Profile & Continue 💕
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
