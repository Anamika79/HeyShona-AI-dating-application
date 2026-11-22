import React from 'react';
import { Compass, Shield, HeartHandshake, ArrowRight } from 'lucide-react';

interface LandingSectionProps {
  onStartDiscovery: () => void;
  onOpenOnboarding: () => void;
}

export const LandingSection: React.FC<LandingSectionProps> = ({
  onStartDiscovery,
  onOpenOnboarding,
}) => {
  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Hero Section */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-light)',
        borderRadius: '24px',
        padding: '56px 48px',
        boxShadow: 'var(--shadow-card)',
        textAlign: 'center',
        marginBottom: '36px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'var(--color-rose-light)',
          color: 'var(--color-rose)',
          border: '1px solid var(--color-rose-border)',
          padding: '5px 14px',
          borderRadius: '20px',
          fontSize: '12.5px',
          fontWeight: 600,
          marginBottom: '18px'
        }}>
          ✨ Intentional Dating & Emotional Intelligence
        </span>

        <h1 style={{
          fontSize: '44px',
          fontWeight: 800,
          lineHeight: 1.18,
          margin: '0 auto 18px',
          maxWidth: '780px',
          color: 'var(--text-main)',
          letterSpacing: '-0.02em'
        }}>
          Understand compatibility <br />
          <span style={{ color: 'var(--color-rose)' }}>before</span> you pursue a connection.
        </h1>

        <p style={{
          fontSize: '17px',
          lineHeight: 1.6,
          color: 'var(--text-muted)',
          maxWidth: '640px',
          margin: '0 auto 32px'
        }}>
          Hey Shona replaces mindless swipe mechanics with explainable 5-dimensional compatibility, values-first alignment, and respect for your emotional boundaries.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="card-connect-btn"
            onClick={onStartDiscovery}
            style={{
              padding: '13px 28px',
              fontSize: '15px',
              borderRadius: '30px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>Explore Compatible Profiles</span>
            <ArrowRight size={17} />
          </button>

          <button
            type="button"
            className="card-cupid-btn"
            onClick={onOpenOnboarding}
            style={{
              padding: '13px 24px',
              fontSize: '15px',
              borderRadius: '30px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>Review Relationship Blueprint</span>
          </button>
        </div>
      </div>

      {/* 3 Core Pillars */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
        gap: '24px',
        marginBottom: '36px'
      }}>
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-light)',
          borderRadius: '16px',
          padding: '28px',
          boxShadow: 'var(--shadow-card)'
        }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--color-rose-light)', color: 'var(--color-rose)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <Compass size={22} />
          </div>
          <h3 style={{ fontSize: '18px', margin: '0 0 8px' }}>5D Compatibility Engine</h3>
          <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text-body)', margin: 0 }}>
            Analyzes core values, communication pacing, lifestyle rhythms, emotional intelligence, and optional astrological harmony.
          </p>
        </div>

        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-light)',
          borderRadius: '16px',
          padding: '28px',
          boxShadow: 'var(--shadow-card)'
        }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--color-sage-light)', color: 'var(--color-sage)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <Shield size={22} />
          </div>
          <h3 style={{ fontSize: '18px', margin: '0 0 8px' }}>Privacy & Autonomy First</h3>
          <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text-body)', margin: 0 }}>
            Raw onboarding responses are strictly private. No unconsented chat surveillance, no attractiveness scoring, zero gamified traps.
          </p>
        </div>

        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-light)',
          borderRadius: '16px',
          padding: '28px',
          boxShadow: 'var(--shadow-card)'
        }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--color-soft-mauve-light)', color: 'var(--color-deep-plum)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <HeartHandshake size={22} />
          </div>
          <h3 style={{ fontSize: '18px', margin: '0 0 8px' }}>Intentional Date Planning</h3>
          <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text-body)', margin: 0 }}>
            Curates verified public date venues tailored to mutual interests, bridging online resonance with safe real-world connection.
          </p>
        </div>
      </div>
    </div>
  );
};
