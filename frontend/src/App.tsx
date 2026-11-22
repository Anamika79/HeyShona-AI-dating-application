import React, { useEffect, useState, useCallback } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Sidebar, PrimaryDestination } from './components/layout/Sidebar';
import { StatusVariant } from './components/common/StatusBadge';
import { CompatibilityEngineSection } from './components/features/CompatibilityEngineSection';
import { ConnectionsHub } from './components/features/ConnectionsHub';
import { AIInsightsHub } from './components/features/AIInsightsHub';
import { ShonaAISection } from './components/features/ShonaAISection';
import { ProfileHub } from './components/features/ProfileHub';
import { SettingsPrivacySection } from './components/features/SettingsPrivacySection';
import { LandingSection } from './components/features/LandingSection';
import { ProfileModal } from './components/features/ProfileModal';
import { BasicProfileSetupModal } from './components/features/BasicProfileSetupModal';
import { BasicProfile, ProfileIntelligenceData } from './types/profile';
import { Connection } from './types/chat';
import { UserProfileSummary } from './types/compatibility';
import { fetchHealth } from './api/health';
import { HealthCheckResponse } from './types/api';
import { Compass, HeartHandshake, Sparkles, Bot, User as UserIcon } from 'lucide-react';
import './App.css';
import './theme.css';

const LOCAL_STORAGE_KEY = 'hey_shona_basic_profile';
const CONNECTIONS_STORAGE_KEY = 'hey_shona_connections';
const THEME_STORAGE_KEY = 'hey_shona_theme';

const DEFAULT_BASIC_PROFILE: BasicProfile = {
  name: 'Anamika',
  age: 26,
  gender: 'Female',
  location: 'Bengaluru, India',
  job: 'Product Designer & Art Enthusiast',
  looking_for: 'Male',
  bio: 'Passionate about art, typography, and specialty coffee. Looking for genuine empathy, intellectual banter, and mindful weekend trail walks.',
};

const DEFAULT_INITIAL_CONNECTIONS: Connection[] = [
  {
    id: 'conn_maya',
    user: {
      id: 'user_3',
      name: 'Dr. Maya Alva',
      age: 30,
      gender: 'Female',
      occupation: 'Pediatric Resident & Marathoner',
      location: 'Delhi NCR, India',
      avatar_url:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
      bio:
        'Pediatric resident fueled by black coffee and 5 AM runs. Compassion and resilience are my north star. Looking for genuine empathy and low-stress quality time.',
      profile_data: {
        personality_insights: [],
        core_values: [
          { value: 'Compassion & Service', evidence: 'Pediatric resident', is_explicit: true },
          { value: 'Resilience & Dedication', evidence: '5 AM runs', is_explicit: true },
        ],
        interests_and_lifestyle: [
          { interest: 'Marathon Training', category: 'Fitness', evidence: 'Marathoner' },
          { interest: 'Home Cooking', category: 'Culinary', evidence: 'comfort food' },
        ],
        relationship_expectations: [
          {
            expectation: 'Emotionally secure partner who understands demanding shift hours',
            evidence: 'demanding schedule',
          },
        ],
        communication_preferences: [
          {
            preference: 'Warm voice notes and intentional presence',
            evidence: 'low-stress quality time',
          },
        ],
        personal_boundaries: [
          { boundary: 'Patience required regarding hospital on-call hours', evidence: 'hospital shifts' },
        ],
        missing_information: { unknown_aspects: [], recommended_follow_up_questions: [] },
      },
    },
    connectedAt: 'Yesterday',
  },
  {
    id: 'conn_rohan',
    user: {
      id: 'user_2',
      name: 'Rohan Verma',
      age: 28,
      gender: 'Male',
      occupation: 'Fintech Product Designer & Jazz Pianist',
      location: 'Mumbai, India',
      avatar_url:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      bio:
        'Creating clean design systems by day, jamming bebop on piano by night. I value intellectual curiosity, design aesthetics, and healthy discipline.',
      profile_data: {
        personality_insights: [],
        core_values: [
          { value: 'Intellectual Curiosity', evidence: 'value intellectual curiosity', is_explicit: true },
          { value: 'Creativity & Craftsmanship', evidence: 'jazz piano', is_explicit: true },
        ],
        interests_and_lifestyle: [
          { interest: 'Jazz Piano & Vinyl Records', category: 'Music', evidence: 'bebop on piano' },
          { interest: 'Art Galleries', category: 'Culture', evidence: 'gallery walks' },
        ],
        relationship_expectations: [
          {
            expectation: 'Slow-burn partnership rooted in mutual inspiration',
            evidence: 'gallery walks',
          },
        ],
        communication_preferences: [
          { preference: 'Playful wit, banter, and deep conversations', evidence: 'jamming bebop' },
        ],
        personal_boundaries: [
          { boundary: 'Needs solitary creative time for piano practice', evidence: 'deep focus' },
        ],
        missing_information: { unknown_aspects: [], recommended_follow_up_questions: [] },
      },
    },
    connectedAt: 'Today',
  },
];

interface DiagnosticState {
  data: HealthCheckResponse | null;
  loading: boolean;
  error: string | null;
  latencyMs: number | null;
}

export const App: React.FC = () => {
  // Theme state: defaults to 'light' per requirements, persists to localStorage
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return saved === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Ignore write errors
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const [basicProfile, setBasicProfile] = useState<BasicProfile>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return DEFAULT_BASIC_PROFILE;
  });

  const [isProfileConfigured, setIsProfileConfigured] = useState<boolean>(() => {
    return localStorage.getItem('hey_shona_profile_configured') === 'true';
  });

  const [connections, setConnections] = useState<Connection[]>(() => {
    try {
      const saved = localStorage.getItem(CONNECTIONS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return DEFAULT_INITIAL_CONNECTIONS;
  });

  // Primary destinations: Discover, Connections, AI Insights, Shona AI, Profile, Settings
  const [activeDestination, setActiveDestination] = useState<PrimaryDestination>('discover');
  const [activeChatCandidateId, setActiveChatCandidateId] = useState<string | null>('user_3');
  const [showLanding, setShowLanding] = useState<boolean>(false);

  // Modals
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isSetupModalOpen, setIsSetupModalOpen] = useState<boolean>(false);
  const [extractedData, setExtractedData] = useState<ProfileIntelligenceData | null>(null);

  const [diagnostics, setDiagnostics] = useState<DiagnosticState>({
    data: null,
    loading: true,
    error: null,
    latencyMs: null,
  });

  const checkSystemHealth = useCallback(async () => {
    setDiagnostics((prev) => ({ ...prev, loading: true, error: null }));
    const startTime = performance.now();

    try {
      const response = await fetchHealth();
      const endTime = performance.now();
      setDiagnostics({
        data: response,
        loading: false,
        error: null,
        latencyMs: Math.round(endTime - startTime),
      });
    } catch (err) {
      const endTime = performance.now();
      const message =
        err instanceof Error ? err.message : 'Unable to connect to the backend API.';
      setDiagnostics({
        data: null,
        loading: false,
        error: message,
        latencyMs: Math.round(endTime - startTime),
      });
    }
  }, []);

  useEffect(() => {
    checkSystemHealth();
  }, [checkSystemHealth]);

  const handleProfileIconClick = () => {
    if (!isProfileConfigured) {
      setIsSetupModalOpen(true);
    } else {
      setActiveDestination('profile');
    }
  };

  const handleSaveBasicProfile = (newProfile: BasicProfile) => {
    setBasicProfile(newProfile);
    setIsProfileConfigured(true);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newProfile));
      localStorage.setItem('hey_shona_profile_configured', 'true');
    } catch {
      // Ignore write error
    }
  };

  const handleConnectCandidate = (candidate: UserProfileSummary) => {
    if (connections.some((c) => c.user.id === candidate.id)) return;

    const newConnection: Connection = {
      id: `conn_${Date.now()}`,
      user: candidate,
      connectedAt: 'Just now',
    };
    const updated = [newConnection, ...connections];
    setConnections(updated);
    try {
      localStorage.setItem(CONNECTIONS_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore write error
    }
  };

  const handleOpenChatWithConnection = (candidateId: string) => {
    setActiveChatCandidateId(candidateId);
    setActiveDestination('connections');
  };

  const handleClearAllData = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem(CONNECTIONS_STORAGE_KEY);
    localStorage.removeItem('hey_shona_profile_configured');
    setBasicProfile(DEFAULT_BASIC_PROFILE);
    setConnections(DEFAULT_INITIAL_CONNECTIONS);
    setIsProfileConfigured(false);
  };

  const getSystemStatus = (): { label: string; variant: StatusVariant } => {
    if (diagnostics.loading) {
      return { label: 'Checking Health...', variant: 'neutral' };
    }
    if (diagnostics.error) {
      return { label: 'Backend Offline', variant: 'error' };
    }
    if (diagnostics.data?.status === 'healthy') {
      return { label: 'System Operational', variant: 'success' };
    }
    return { label: 'System Degraded', variant: 'warning' };
  };

  return (
    <div className="app-shell">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar
        activeDestination={activeDestination}
        onSelectDestination={(dest) => {
          setShowLanding(false);
          setActiveDestination(dest);
        }}
        connectionsCount={connections.length}
        basicProfile={basicProfile}
        currentTheme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* 2. Main Application Pane */}
      <div className="app-main-pane">
        <Header
          systemStatus={getSystemStatus()}
          basicProfile={basicProfile}
          onOpenProfile={handleProfileIconClick}
          onGoHome={() => {
            setShowLanding(false);
            setActiveDestination('discover');
          }}
        />

        <main className="app-main-content">
          {/* Landing Mode Toggle Banner */}
          {showLanding ? (
            <LandingSection
              onStartDiscovery={() => setShowLanding(false)}
              onOpenOnboarding={() => {
                setShowLanding(false);
                setIsSetupModalOpen(true);
              }}
            />
          ) : (
            <>
              {/* Destination 1: Discover Matches */}
              {activeDestination === 'discover' && (
                <CompatibilityEngineSection
                  basicProfile={basicProfile}
                  currentUserData={extractedData}
                  connections={connections}
                  onConnectCandidate={handleConnectCandidate}
                  onOpenChat={handleOpenChatWithConnection}
                />
              )}

              {/* Destination 2: Connections & Date Planner */}
              {activeDestination === 'connections' && (
                <ConnectionsHub
                  connections={connections}
                  initialActiveId={activeChatCandidateId}
                  currentUserName={basicProfile.name}
                  onExploreDiscovery={() => setActiveDestination('discover')}
                />
              )}

              {/* Destination 3: AI Insights */}
              {activeDestination === 'ai-insights' && (
                <AIInsightsHub
                  basicProfile={basicProfile}
                  connections={connections}
                  onUpdateExtractedData={(data) => setExtractedData(data)}
                  onConnectCandidate={handleConnectCandidate}
                  onOpenChat={handleOpenChatWithConnection}
                />
              )}

              {/* Destination 4: Shona AI Assistant */}
              {activeDestination === 'shona-ai' && (
                <ShonaAISection
                  currentUserName={basicProfile.name}
                  connections={connections}
                  onOpenChat={handleOpenChatWithConnection}
                />
              )}

              {/* Destination 5: My Profile & Relationship Blueprint */}
              {activeDestination === 'profile' && (
                <ProfileHub
                  basicProfile={basicProfile}
                  intelligenceData={extractedData}
                  onEditProfile={() => setIsSetupModalOpen(true)}
                  onAnalyzeWithAI={() => setActiveDestination('ai-insights')}
                />
              )}

              {/* Destination 6: Settings, Privacy & Safety */}
              {activeDestination === 'settings' && (
                <SettingsPrivacySection
                  currentTheme={theme}
                  onToggleTheme={toggleTheme}
                  onClearData={handleClearAllData}
                />
              )}
            </>
          )}
        </main>

        <Footer />
      </div>

      {/* Mobile Bottom Navigation Bar (< 768px) */}
      <nav className="mobile-bottom-nav">
        <button
          type="button"
          className={`mobile-nav-btn ${activeDestination === 'discover' ? 'active' : ''}`}
          onClick={() => {
            setShowLanding(false);
            setActiveDestination('discover');
          }}
        >
          <Compass size={18} />
          <span>Discover</span>
        </button>

        <button
          type="button"
          className={`mobile-nav-btn ${activeDestination === 'connections' ? 'active' : ''}`}
          onClick={() => {
            setShowLanding(false);
            setActiveDestination('connections');
          }}
        >
          <HeartHandshake size={18} />
          <span>Connect</span>
        </button>

        <button
          type="button"
          className={`mobile-nav-btn ${activeDestination === 'ai-insights' ? 'active' : ''}`}
          onClick={() => {
            setShowLanding(false);
            setActiveDestination('ai-insights');
          }}
        >
          <Sparkles size={18} />
          <span>Insights</span>
        </button>

        <button
          type="button"
          className={`mobile-nav-btn ${activeDestination === 'shona-ai' ? 'active' : ''}`}
          onClick={() => {
            setShowLanding(false);
            setActiveDestination('shona-ai');
          }}
        >
          <Bot size={18} />
          <span>Shona AI</span>
        </button>

        <button
          type="button"
          className={`mobile-nav-btn ${activeDestination === 'profile' ? 'active' : ''}`}
          onClick={() => {
            setShowLanding(false);
            setActiveDestination('profile');
          }}
        >
          <UserIcon size={18} />
          <span>Profile</span>
        </button>
      </nav>

      {/* Public Profile Preview Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        basicProfile={basicProfile}
        intelligenceData={extractedData}
        onEditBasicProfile={() => setIsSetupModalOpen(true)}
        onElaborateWithAI={() => {
          setIsProfileOpen(false);
          setActiveDestination('ai-insights');
        }}
      />

      {/* Basic Profile Setup / Edit Modal */}
      <BasicProfileSetupModal
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
        currentProfile={basicProfile}
        onSaveProfile={handleSaveBasicProfile}
      />
    </div>
  );
};
