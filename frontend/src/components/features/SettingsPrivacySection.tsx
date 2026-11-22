import React, { useState } from 'react';
import { Shield, Lock, Trash2, Ban, Flag, Sun, Moon, CheckCircle2, AlertTriangle } from 'lucide-react';

interface SettingsPrivacySectionProps {
  currentTheme: 'light' | 'dark';
  onToggleTheme: () => void;
  onClearData: () => void;
}

export const SettingsPrivacySection: React.FC<SettingsPrivacySectionProps> = ({
  currentTheme,
  onToggleTheme,
  onClearData,
}) => {
  const [anonymousBrowsing, setAnonymousBrowsing] = useState<boolean>(true);
  const [allowAIAnalysis, setAllowAIAnalysis] = useState<boolean>(true);
  const [aiMessageApproval, setAiMessageApproval] = useState<boolean>(true);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const handleAction = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '28px', margin: '0 0 6px', color: 'var(--text-main)' }}>Settings, Privacy & Trust</h2>
        <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>
          Transparent user controls, uncompromised safety guardrails, and privacy protections.
        </p>
      </div>

      {actionNotice && (
        <div style={{
          background: 'var(--color-sage-light)',
          border: '1px solid var(--color-sage-border)',
          color: 'var(--color-sage)',
          borderRadius: '12px',
          padding: '12px 18px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '13.5px',
          fontWeight: 600
        }}>
          <CheckCircle2 size={16} />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* 1. Privacy & AI Principles Card */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-light)',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: 'var(--shadow-card)',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--color-rose-light)', color: 'var(--color-rose)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Lock size={18} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px' }}>Privacy & Data Autonomy</h3>
            <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>You own your data. We never sell or expose raw responses.</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '14px', borderBottom: '1px solid var(--border-subtle)' }}>
            <div>
              <strong style={{ fontSize: '14px', display: 'block', color: 'var(--text-main)' }}>Private Matching Preferences</strong>
              <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>Only show compatibility matches aligned with your chosen filter.</span>
            </div>
            <input
              type="checkbox"
              checked={anonymousBrowsing}
              onChange={(e) => {
                setAnonymousBrowsing(e.target.checked);
                handleAction('Privacy preference saved');
              }}
              style={{ width: '18px', height: '18px', accentColor: 'var(--color-rose)', cursor: 'pointer' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '14px', borderBottom: '1px solid var(--border-subtle)' }}>
            <div>
              <strong style={{ fontSize: '14px', display: 'block', color: 'var(--text-main)' }}>AI Message Approval Requirement</strong>
              <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>All Cupid AI-suggested icebreakers require explicit user approval before sending.</span>
            </div>
            <input
              type="checkbox"
              checked={aiMessageApproval}
              onChange={(e) => {
                setAiMessageApproval(e.target.checked);
                handleAction('AI safety rule enforced');
              }}
              style={{ width: '18px', height: '18px', accentColor: 'var(--color-rose)', cursor: 'pointer' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <strong style={{ fontSize: '14px', display: 'block', color: 'var(--text-main)' }}>AI Compatibility Extraction</strong>
              <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>Allow Gemini AI to extract values and communication style from your profile bio.</span>
            </div>
            <input
              type="checkbox"
              checked={allowAIAnalysis}
              onChange={(e) => {
                setAllowAIAnalysis(e.target.checked);
                handleAction('Profile extraction preference updated');
              }}
              style={{ width: '18px', height: '18px', accentColor: 'var(--color-rose)', cursor: 'pointer' }}
            />
          </div>
        </div>
      </div>

      {/* 2. Safety, Blocking & Reporting */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-light)',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: 'var(--shadow-card)',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--color-sage-light)', color: 'var(--color-sage)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={18} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px' }}>Safety, Blocking & Reporting</h3>
            <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>Zero tolerance for harassment, impersonation, or unwelcome behavior.</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="card-cupid-btn"
            onClick={() => handleAction('Blocklist opened: 0 active blocked profiles.')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <Ban size={15} /> Manage Blocked Profiles
          </button>
          <button
            type="button"
            className="card-cupid-btn"
            onClick={() => handleAction('Safety Report Form dispatched to Trust & Safety team.')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <Flag size={15} /> Report a User or Safety Concern
          </button>
        </div>
      </div>

      {/* 3. Appearance & Theme */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-light)',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: 'var(--shadow-card)',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px' }}>Visual Theme Preference</h3>
            <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>Choose between warm editorial Light theme or sleek Plum Dark theme.</span>
          </div>
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={onToggleTheme}
            style={{ width: 'auto', padding: '9px 18px', gap: '10px' }}
          >
            {currentTheme === 'light' ? <Sun size={16} color="#D9668D" /> : <Moon size={16} color="#E9D5DF" />}
            <strong>{currentTheme === 'light' ? 'Light Mode (Default)' : 'Dark Mode'}</strong>
          </button>
        </div>
      </div>

      {/* 4. Danger Zone: Data Reset & Account Deletion */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid rgba(239, 68, 68, 0.25)',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: 'var(--shadow-card)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
          <AlertTriangle size={20} color="#ef4444" />
          <h3 style={{ margin: 0, fontSize: '18px', color: '#ef4444' }}>Data Management & Account Deletion</h3>
        </div>
        <p style={{ margin: '0 0 16px', fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          In accordance with our user autonomy principles, you can permanently delete all local Relationship Blueprint data, conversations, and custom settings at any time.
        </p>
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Are you sure you want to delete your profile data and reset to default? This cannot be undone.')) {
              onClearData();
              handleAction('All profile data deleted and reset.');
            }
          }}
          style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            color: '#ef4444',
            padding: '9px 18px',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Trash2 size={15} /> Delete Account & Clear Data
        </button>
      </div>
    </div>
  );
};
