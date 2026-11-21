import React, { useState } from 'react';
import { BirthDetails, ExtractHoroscopeResponse } from '../../types/horoscope';
import { extractHoroscope } from '../../api/horoscope';

const RASHI_OPTIONS = [
  'Mesha (Aries)',
  'Vrishabha (Taurus)',
  'Mithuna (Gemini)',
  'Karka (Cancer)',
  'Simha (Leo)',
  'Kanya (Virgo)',
  'Tula (Libra)',
  'Vrishchika (Scorpio)',
  'Dhanu (Sagittarius)',
  'Makara (Capricorn)',
  'Kumbha (Aquarius)',
  'Meena (Pisces)',
];

const NAKSHATRA_OPTIONS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula',
  'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

interface HoroscopeUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBirthDetails?: BirthDetails;
  onSave: (details: BirthDetails, docName?: string) => void;
}

export const HoroscopeUploadModal: React.FC<HoroscopeUploadModalProps> = ({
  isOpen,
  onClose,
  currentBirthDetails,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'manual'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [extractionResult, setExtractionResult] = useState<ExtractHoroscopeResponse | null>(null);
  const [step, setStep] = useState<'input' | 'review'>('input');

  // Form Fields
  const [name, setName] = useState<string>(currentBirthDetails?.name || 'Anamika');
  const [dob, setDob] = useState<string>(currentBirthDetails?.date_of_birth || '1999-05-18');
  const [tob, setTob] = useState<string>(currentBirthDetails?.time_of_birth || '08:25');
  const [pob, setPob] = useState<string>(currentBirthDetails?.place_of_birth || 'Bengaluru, Karnataka');
  const [rashi, setRashi] = useState<string>(currentBirthDetails?.rashi || 'Mithuna');
  const [nakshatra, setNakshatra] = useState<string>(currentBirthDetails?.nakshatra || 'Mrigashira');
  const [lagna, setLagna] = useState<string>(currentBirthDetails?.lagna || 'Karka');
  const [isManglik, setIsManglik] = useState<boolean>(currentBirthDetails?.is_manglik || false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleExtractWithAI = async () => {
    setIsExtracting(true);
    try {
      const fileName = selectedFile ? selectedFile.name : 'Kundli_Chart.pdf';
      const result = await extractHoroscope(fileName);
      setExtractionResult(result);
      if (result.extracted_details) {
        if (result.extracted_details.name) setName(result.extracted_details.name);
        if (result.extracted_details.date_of_birth) setDob(result.extracted_details.date_of_birth);
        if (result.extracted_details.time_of_birth) setTob(result.extracted_details.time_of_birth);
        if (result.extracted_details.place_of_birth) setPob(result.extracted_details.place_of_birth);
        if (result.extracted_details.rashi) setRashi(result.extracted_details.rashi);
        if (result.extracted_details.nakshatra) setNakshatra(result.extracted_details.nakshatra);
        if (result.extracted_details.lagna) setLagna(result.extracted_details.lagna);
        setIsManglik(result.extracted_details.is_manglik);
      }
      setStep('review');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleManualProceed = () => {
    setStep('review');
  };

  const handleFinalSave = () => {
    // Strip parenthetical English translations if present
    const cleanRashi = rashi.split(' ')[0].trim();
    const details: BirthDetails = {
      name,
      date_of_birth: dob,
      time_of_birth: tob,
      place_of_birth: pob,
      rashi: cleanRashi,
      nakshatra,
      lagna,
      is_manglik: isManglik,
      manglik_note: isManglik
        ? 'Mars placed in 1st/4th/7th/8th/12th house (Passionate, ambitious drive)'
        : 'Mars in non-dosha placement',
    };
    onSave(details, selectedFile?.name || 'Manual_Horoscope_Profile');
    onClose();
  };

  return (
    <div className="horoscope-modal-backdrop" onClick={onClose}>
      <div
        className="horoscope-modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="horoscope-modal-header">
          <div className="horoscope-modal-title-group">
            <span className="horoscope-header-glyph">🔮</span>
            <div>
              <h3 className="horoscope-modal-title">
                {step === 'input' ? 'Cosmic Connections – Upload Horoscope' : 'Review Extracted Horoscope Details'}
              </h3>
              <p className="horoscope-modal-subtitle">
                {step === 'input'
                  ? 'Upload your Kundli / Jathakam chart or enter birth details for Vedic matching'
                  : 'Verify AI-extracted planetary placements before saving your profile'}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="horoscope-modal-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {step === 'input' ? (
          <div className="horoscope-modal-body">
            {/* Tabs */}
            <div className="horoscope-tab-pills">
              <button
                type="button"
                className={`horoscope-tab-btn ${activeTab === 'upload' ? 'active' : ''}`}
                onClick={() => setActiveTab('upload')}
              >
                📄 Upload Kundli / Jathakam (PDF or Image)
              </button>
              <button
                type="button"
                className={`horoscope-tab-btn ${activeTab === 'manual' ? 'active' : ''}`}
                onClick={() => setActiveTab('manual')}
              >
                ✍️ Manual Birth Details
              </button>
            </div>

            {activeTab === 'upload' ? (
              <div className="horoscope-upload-tab">
                <div className="horoscope-dropzone">
                  <span className="dropzone-icon">📜</span>
                  <h4>Upload Kundli / Jathakam Chart</h4>
                  <p>Supports PDF, JPG, JPEG, and PNG formats of your birth chart</p>

                  <input
                    type="file"
                    id="horoscope-file-input"
                    accept=".pdf,.png,.jpg,.jpeg"
                    className="file-hidden-input"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="horoscope-file-input" className="file-browse-btn">
                    {selectedFile ? `Selected: ${selectedFile.name}` : '📁 Choose File from Device'}
                  </label>

                  {selectedFile && (
                    <div className="file-preview-pill">
                      <span>✓ {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                    </div>
                  )}
                </div>

                <div className="horoscope-privacy-banner">
                  <span className="banner-lock">🔒</span>
                  <p>
                    <strong>Privacy First:</strong> Your exact birth time, birthplace, and raw document are securely encrypted and never shared with other users. Only your calculated Guna Milan compatibility score is revealed.
                  </p>
                </div>

                <div className="horoscope-action-footer">
                  <button
                    type="button"
                    className="btn-horoscope-primary"
                    disabled={isExtracting}
                    onClick={handleExtractWithAI}
                  >
                    {isExtracting ? (
                      <>
                        <span className="spinner-inline" /> Extracting Vedic Placements with Gemini...
                      </>
                    ) : (
                      '✨ Extract Planetary Placements with AI'
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="horoscope-manual-tab">
                <div className="horoscope-form-grid">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Anamika"
                    />
                  </div>

                  <div className="form-group">
                    <label>Date of Birth</label>
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Time of Birth (Private)</label>
                    <input
                      type="time"
                      value={tob}
                      onChange={(e) => setTob(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Place of Birth (Private)</label>
                    <input
                      type="text"
                      value={pob}
                      onChange={(e) => setPob(e.target.value)}
                      placeholder="City, State"
                    />
                  </div>

                  <div className="form-group">
                    <label>Rashi (Moon Sign)</label>
                    <select value={rashi} onChange={(e) => setRashi(e.target.value)}>
                      {RASHI_OPTIONS.map((r) => (
                        <option key={r} value={r.split(' ')[0]}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Nakshatra (Birth Star)</label>
                    <select value={nakshatra} onChange={(e) => setNakshatra(e.target.value)}>
                      {NAKSHATRA_OPTIONS.map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Lagna (Ascendant Sign - Optional)</label>
                    <select value={lagna} onChange={(e) => setLagna(e.target.value)}>
                      <option value="">Unknown / Not Sure</option>
                      {RASHI_OPTIONS.map((r) => (
                        <option key={r} value={r.split(' ')[0]}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={isManglik}
                        onChange={(e) => setIsManglik(e.target.checked)}
                      />
                      <span>Active Manglik (Kuja Dosha) in horoscope</span>
                    </label>
                  </div>
                </div>

                <div className="horoscope-action-footer">
                  <button
                    type="button"
                    className="btn-horoscope-primary"
                    onClick={handleManualProceed}
                  >
                    Continue to Review →
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="horoscope-modal-body review-mode">
            {extractionResult && (
              <div className="ai-confidence-banner">
                <span className="confidence-star">✨</span>
                <div>
                  <strong>Gemini AI Extraction Complete</strong>
                  <p>{extractionResult.notes.join(' ')}</p>
                </div>
              </div>
            )}

            <div className="review-cards-grid">
              <div className="review-stat-card">
                <span className="stat-label">Rashi (Moon Sign)</span>
                <select
                  value={rashi}
                  onChange={(e) => setRashi(e.target.value)}
                  className="review-select"
                >
                  {RASHI_OPTIONS.map((r) => (
                    <option key={r} value={r.split(' ')[0]}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div className="review-stat-card">
                <span className="stat-label">Nakshatra (Birth Star)</span>
                <select
                  value={nakshatra}
                  onChange={(e) => setNakshatra(e.target.value)}
                  className="review-select"
                >
                  {NAKSHATRA_OPTIONS.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              <div className="review-stat-card">
                <span className="stat-label">Lagna (Ascendant)</span>
                <input
                  type="text"
                  value={lagna}
                  onChange={(e) => setLagna(e.target.value)}
                  className="review-input"
                />
              </div>

              <div className="review-stat-card">
                <span className="stat-label">Manglik Status</span>
                <div className="manglik-toggle-wrap">
                  <button
                    type="button"
                    className={`pill-toggle ${!isManglik ? 'active' : ''}`}
                    onClick={() => setIsManglik(false)}
                  >
                    Non-Manglik
                  </button>
                  <button
                    type="button"
                    className={`pill-toggle ${isManglik ? 'active manglik' : ''}`}
                    onClick={() => setIsManglik(true)}
                  >
                    Manglik
                  </button>
                </div>
              </div>
            </div>

            <div className="review-details-subgroup">
              <div className="detail-item">
                <span className="detail-title">Native Name:</span>
                <span className="detail-val">{name}</span>
              </div>
              <div className="detail-item">
                <span className="detail-title">Date of Birth:</span>
                <span className="detail-val">{dob}</span>
              </div>
              <div className="detail-item">
                <span className="detail-title">Time of Birth:</span>
                <span className="detail-val">{tob || 'Not provided'} (Encrypted)</span>
              </div>
              <div className="detail-item">
                <span className="detail-title">Place of Birth:</span>
                <span className="detail-val">{pob || 'Not provided'} (Encrypted)</span>
              </div>
            </div>

            <div className="horoscope-action-footer split-buttons">
              <button
                type="button"
                className="btn-horoscope-secondary"
                onClick={() => setStep('input')}
              >
                ← Back / Modify
              </button>
              <button
                type="button"
                className="btn-horoscope-primary"
                onClick={handleFinalSave}
              >
                💾 Save Horoscope Profile & Match
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
