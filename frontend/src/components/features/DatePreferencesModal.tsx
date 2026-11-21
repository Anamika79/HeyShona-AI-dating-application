import React, { useState } from 'react';
import { DatePreferenceProfile } from '../../types/datePlanner';
import { saveDatePreferences } from '../../api/datePlanner';

interface DatePreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPreferences: DatePreferenceProfile;
  onSaved: (updated: DatePreferenceProfile) => void;
}

export const DatePreferencesModal: React.FC<DatePreferencesModalProps> = ({
  isOpen,
  onClose,
  currentPreferences,
  onSaved,
}) => {
  const [formData, setFormData] = useState<DatePreferenceProfile>(currentPreferences);
  const [newFood, setNewFood] = useState<string>('');
  const [newFavActivity, setNewFavActivity] = useState<string>('');
  const [newDisliked, setNewDisliked] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleAddFood = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (!newFood.trim()) return;
    setFormData((prev) => ({
      ...prev,
      food_preferences: [...prev.food_preferences, newFood.trim()],
    }));
    setNewFood('');
  };

  const handleRemoveFood = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      food_preferences: prev.food_preferences.filter((_, i) => i !== index),
    }));
  };

  const handleAddFavActivity = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (!newFavActivity.trim()) return;
    setFormData((prev) => ({
      ...prev,
      favorite_activities: [...prev.favorite_activities, newFavActivity.trim()],
    }));
    setNewFavActivity('');
  };

  const handleRemoveFavActivity = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      favorite_activities: prev.favorite_activities.filter((_, i) => i !== index),
    }));
  };

  const handleAddDisliked = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (!newDisliked.trim()) return;
    setFormData((prev) => ({
      ...prev,
      disliked_activities: [...prev.disliked_activities, newDisliked.trim()],
    }));
    setNewDisliked('');
  };

  const handleRemoveDisliked = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      disliked_activities: prev.disliked_activities.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const saved = await saveDatePreferences(formData.user_id, formData);
      onSaved(saved);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 1000);
    } catch (err) {
      console.error('Failed to save date preferences:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="date-prefs-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="date-prefs-header">
          <div className="date-prefs-title-group">
            <span className="prefs-header-icon">⚙️</span>
            <div>
              <h3 className="prefs-modal-title">My Date Planning Preferences</h3>
              <p className="prefs-modal-desc">
                Personal preferences used by AI Date Planner to curate comfortable, enjoyable dates.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="insights-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Modal Content */}
        <div className="date-prefs-body">
          {/* Vibe & Environment */}
          <div className="form-group-row">
            <div className="form-field">
              <label>Preferred Date Vibe</label>
              <select
                className="date-input-select"
                value={formData.vibe_preference}
                onChange={(e) =>
                  setFormData({ ...formData, vibe_preference: e.target.value })
                }
              >
                <option value="Creative, Relaxed & Meaningful">Creative, Relaxed & Meaningful</option>
                <option value="Romantic & Intimate">Romantic & Intimate</option>
                <option value="Restorative & Calm">Restorative & Calm</option>
                <option value="Playful & Inspiring">Playful & Inspiring</option>
                <option value="Food & Culinary Focused">Food & Culinary Focused</option>
                <option value="Cultural & Curious">Cultural & Curious</option>
              </select>
            </div>

            <div className="form-field">
              <label>Environment Setting</label>
              <select
                className="date-input-select"
                value={formData.environment_preference}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    environment_preference: e.target.value,
                  })
                }
              >
                <option value="Cozy indoor spaces & scenic shaded greenery">
                  Cozy indoor spaces & shaded greenery
                </option>
                <option value="Exclusively indoor & air-conditioned">
                  Exclusively indoor & air-conditioned
                </option>
                <option value="Open-air, breezy courtyards & rooftops">
                  Open-air, breezy courtyards & rooftops
                </option>
                <option value="Scenic nature & outdoor walking paths">
                  Scenic nature & outdoor walking paths
                </option>
              </select>
            </div>
          </div>

          {/* Budget Preference */}
          <div className="form-field">
            <label>Typical Budget Bracket</label>
            <select
              className="date-input-select"
              value={formData.budget_preference}
              onChange={(e) =>
                setFormData({ ...formData, budget_preference: e.target.value })
              }
            >
              <option value="Budget-friendly (Under ₹1,200)">Budget-friendly (Under ₹1,200)</option>
              <option value="Moderate (₹1,500 - ₹3,000)">Moderate (₹1,500 - ₹3,000)</option>
              <option value="Premium Experience (₹3,000 - ₹5,000)">Premium Experience (₹3,000 - ₹5,000)</option>
            </select>
          </div>

          {/* Food Preferences Tags */}
          <div className="form-field">
            <label>Food & Drink Preferences</label>
            <div className="tags-entry-row">
              <input
                type="text"
                className="date-input-text"
                placeholder="Add item (e.g. Specialty coffee, Italian, Dim sum)..."
                value={newFood}
                onChange={(e) => setNewFood(e.target.value)}
                onKeyDown={handleAddFood}
              />
              <button
                type="button"
                className="add-tag-btn"
                onClick={handleAddFood}
              >
                + Add
              </button>
            </div>
            <div className="tags-chip-cloud">
              {formData.food_preferences.map((item, idx) => (
                <span key={idx} className="chip-pill food">
                  {item}
                  <button
                    type="button"
                    className="chip-remove-btn"
                    onClick={() => handleRemoveFood(idx)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Favorite Activities */}
          <div className="form-field">
            <label>Favorite Date Activities</label>
            <div className="tags-entry-row">
              <input
                type="text"
                className="date-input-text"
                placeholder="Add favorite (e.g. Pottery, Live acoustic jazz, Bookstores)..."
                value={newFavActivity}
                onChange={(e) => setNewFavActivity(e.target.value)}
                onKeyDown={handleAddFavActivity}
              />
              <button
                type="button"
                className="add-tag-btn"
                onClick={handleAddFavActivity}
              >
                + Add
              </button>
            </div>
            <div className="tags-chip-cloud">
              {formData.favorite_activities.map((item, idx) => (
                <span key={idx} className="chip-pill activity">
                  {item}
                  <button
                    type="button"
                    className="chip-remove-btn"
                    onClick={() => handleRemoveFavActivity(idx)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Disliked Activities (Constraints) */}
          <div className="form-field">
            <label>Activities You Dislike / Avoid</label>
            <div className="tags-entry-row">
              <input
                type="text"
                className="date-input-text"
                placeholder="Add to avoid (e.g. Overly loud nightclubs, Rushed buffets)..."
                value={newDisliked}
                onChange={(e) => setNewDisliked(e.target.value)}
                onKeyDown={handleAddDisliked}
              />
              <button
                type="button"
                className="add-tag-btn danger"
                onClick={handleAddDisliked}
              >
                + Add
              </button>
            </div>
            <div className="tags-chip-cloud">
              {formData.disliked_activities.map((item, idx) => (
                <span key={idx} className="chip-pill disliked">
                  🚫 {item}
                  <button
                    type="button"
                    className="chip-remove-btn"
                    onClick={() => handleRemoveDisliked(idx)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="date-prefs-footer">
          {saveSuccess && (
            <span className="save-success-msg">✓ Preferences saved!</span>
          )}
          <button type="button" className="prefs-cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="prefs-save-btn"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Date Preferences'}
          </button>
        </div>
      </div>
    </div>
  );
};
