import React from 'react';
import { Shield, Sparkles, Edit3, CheckCircle2, Lock } from 'lucide-react';
import { BasicProfile, ProfileIntelligenceData } from '../../types/profile';

interface ProfileHubProps {
  basicProfile: BasicProfile;
  intelligenceData: ProfileIntelligenceData | null;
  onEditProfile: () => void;
  onAnalyzeWithAI: () => void;
}

export const ProfileHub: React.FC<ProfileHubProps> = ({
  basicProfile,
  intelligenceData,
  onEditProfile,
  onAnalyzeWithAI,
}) => {
  const defaultAvatar =
    basicProfile.gender === 'Male'
      ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
      : basicProfile.gender === 'LGBTQ+'
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
      : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80';

  const avatarSrc = basicProfile.avatar_url || defaultAvatar;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Top Profile Summary Card */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-light)',
        borderRadius: '20px',
        padding: '32px',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        gap: '32px',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: '28px'
      }}>
        <div style={{
          position: 'relative',
          width: '130px',
          height: '130px',
          borderRadius: '50%',
          overflow: 'hidden',
          border: '3px solid var(--color-rose)',
          boxShadow: 'var(--shadow-card)',
          flexShrink: 0
        }}>
          <img src={avatarSrc} alt={basicProfile.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        <div style={{ flex: 1, minWidth: '260px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <h2 style={{ margin: 0, fontSize: '26px' }}>{basicProfile.name}, {basicProfile.age}</h2>
            <span style={{
              background: 'var(--color-sage-light)',
              color: 'var(--color-sage)',
              border: '1px solid var(--color-sage-border)',
              padding: '3px 10px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <CheckCircle2 size={13} /> Blueprint Verified
            </span>
            <span style={{
              background: 'var(--color-rose-light)',
              color: 'var(--color-rose)',
              border: '1px solid var(--color-rose-border)',
              padding: '3px 10px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 600
            }}>
              Looking for {basicProfile.looking_for || 'Everyone'}
            </span>
          </div>

          <p style={{ margin: '6px 0 0', fontSize: '14.5px', color: 'var(--text-muted)' }}>
            {basicProfile.job} • {basicProfile.location}
          </p>

          <p style={{ margin: '12px 0 0', fontSize: '14px', lineHeight: 1.6, color: 'var(--text-body)' }}>
            {basicProfile.bio}
          </p>

          <div style={{ display: 'flex', gap: '12px', marginTop: '18px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="card-connect-btn"
              onClick={onEditProfile}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '9px 18px' }}
            >
              <Edit3 size={15} /> Edit Basic Profile
            </button>
            <button
              type="button"
              className="card-cupid-btn"
              onClick={onAnalyzeWithAI}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '9px 18px' }}
            >
              <Sparkles size={15} color="#D9668D" /> Refine with Gemini AI
            </button>
          </div>
        </div>
      </div>

      {/* Relationship Blueprint Overview */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-light)',
        borderRadius: '20px',
        padding: '32px',
        boxShadow: 'var(--shadow-card)',
        marginBottom: '28px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--color-rose-light)', color: 'var(--color-rose)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '20px' }}>Your Relationship Blueprint</h3>
              <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                Your private compatibility baseline. Only synthesized alignments are shared with candidates.
              </span>
            </div>
          </div>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            color: 'var(--text-muted)',
            background: 'var(--bg-surface-subtle)',
            padding: '5px 12px',
            borderRadius: '16px'
          }}>
            <Lock size={12} /> Confidential & Autonomous
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {/* Core Values */}
          <div style={{ background: 'var(--bg-surface-subtle)', border: '1px solid var(--border-light)', borderRadius: '14px', padding: '20px' }}>
            <h4 style={{ margin: '0 0 10px', fontSize: '15px', color: 'var(--color-rose)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              💎 Core Values & Principles
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {intelligenceData?.core_values?.length ? (
                intelligenceData.core_values.map((v, i) => (
                  <span key={i} className="candidate-val-tag">
                    {v.value}
                  </span>
                ))
              ) : (
                <>
                  <span className="candidate-val-tag">Authenticity & Empathy</span>
                  <span className="candidate-val-tag">Creative Independence</span>
                  <span className="candidate-val-tag">Intellectual Curiosity</span>
                </>
              )}
            </div>
          </div>

          {/* Communication Rhythms */}
          <div style={{ background: 'var(--bg-surface-subtle)', border: '1px solid var(--border-light)', borderRadius: '14px', padding: '20px' }}>
            <h4 style={{ margin: '0 0 10px', fontSize: '15px', color: 'var(--color-sage)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              💬 Communication Cadence
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {intelligenceData?.communication_preferences?.length ? (
                intelligenceData.communication_preferences.map((c, i) => (
                  <span key={i} className="candidate-int-tag">
                    {c.preference}
                  </span>
                ))
              ) : (
                <>
                  <span className="candidate-int-tag">Thoughtful, unhurried replies</span>
                  <span className="candidate-int-tag">Prefers meaningful dialogue</span>
                  <span className="candidate-int-tag">Voice notes welcome</span>
                </>
              )}
            </div>
          </div>

          {/* Relationship Expectations */}
          <div style={{ background: 'var(--bg-surface-subtle)', border: '1px solid var(--border-light)', borderRadius: '14px', padding: '20px' }}>
            <h4 style={{ margin: '0 0 10px', fontSize: '15px', color: 'var(--color-deep-plum)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🌱 Relationship Intentions
            </h4>
            <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--text-body)', lineHeight: 1.55 }}>
              Seeking slow-burn, emotionally secure connection rooted in shared ethics, intellectual stimulation, and creative pursuits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
