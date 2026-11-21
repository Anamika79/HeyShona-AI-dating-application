import React, { useEffect, useState, useCallback } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Sidebar, ActiveNavView } from './components/layout/Sidebar';
import { StatusVariant } from './components/common/StatusBadge';
import { HomeSection } from './components/features/HomeSection';
import { ProfileIntelligenceSection } from './components/features/ProfileIntelligenceSection';
import { DatePlannerSection } from './components/features/DatePlannerSection';
import { CompatibilityEngineSection } from './components/features/CompatibilityEngineSection';
import { ConnectionsSection } from './components/features/ConnectionsSection';
import { ChatSection } from './components/features/ChatSection';
import { HoroscopeMatchSection } from './components/features/HoroscopeMatchSection';
import { ProfileModal } from './components/features/ProfileModal';
import { BasicProfileSetupModal } from './components/features/BasicProfileSetupModal';
import { BasicProfile, ProfileIntelligenceData } from './types/profile';
import { Connection } from './types/chat';
import { UserProfileSummary } from './types/compatibility';
import { fetchHealth } from './api/health';
import { HealthCheckResponse } from './types/api';
import './App.css';

const LOCAL_STORAGE_KEY = 'hey_shona_basic_profile';
const CONNECTIONS_STORAGE_KEY = 'hey_shona_connections';

const DEFAULT_BASIC_PROFILE: BasicProfile = {
  name: 'Anamika',
  age: 26,
  gender: 'Female',
  location: 'Bengaluru, India',
  job: 'Product Designer & Art Enthusiast',
  looking_for: 'Male',
  bio: 'Passionate about art, typography, and specialty coffee. Looking for genuine empathy, intellectual banter, and mindful weekend trail walks.',
};

// Initial default connections with pre-loaded demo profiles
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

  // Connections list state
  const [connections, setConnections] = useState<Connection[]>(() => {
    try {
      const saved = localStorage.getItem(CONNECTIONS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return DEFAULT_INITIAL_CONNECTIONS;
  });

  // Active navigation view (sidebar task pane - defaults to Home entry)
  const [activeNavView, setActiveNavView] = useState<ActiveNavView>('home');
  const [activeChatCandidateId, setActiveChatCandidateId] = useState<string | null>('user_3');

  // Modals & intelligence state
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
        err instanceof Error
          ? err.message
          : 'Unable to connect to the backend API.';
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
      setIsProfileOpen(true);
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

  // Connect with a candidate from Discovery or Report
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

  // Launch chat directly with a specific connection
  const handleOpenChatWithConnection = (candidateId: string) => {
    setActiveChatCandidateId(candidateId);
    setActiveNavView('chat');
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
      {/* Left Sidebar Task Pane */}
      <Sidebar
        activeView={activeNavView}
        onSelectView={(view) => setActiveNavView(view)}
        connectionsCount={connections.length}
        basicProfile={basicProfile}
        onOpenProfile={handleProfileIconClick}
      />

      {/* Main Content Pane */}
      <div className="app-main-pane">
        <Header
          systemStatus={getSystemStatus()}
          basicProfile={basicProfile}
          onOpenProfile={handleProfileIconClick}
          onGoHome={() => setActiveNavView('home')}
        />

        <main className="app-main-content">
          {/* View 0: Home Platform Entry Hub */}
          {activeNavView === 'home' && (
            <HomeSection
              basicProfile={basicProfile}
              connectionsCount={connections.length}
              onNavigate={(view) => setActiveNavView(view)}
              onOpenProfile={handleProfileIconClick}
            />
          )}

          {/* View 1: Discover Matches (Compatibility Engine with Hover Profiles) */}
          {activeNavView === 'compat-engine' && (
            <CompatibilityEngineSection
              basicProfile={basicProfile}
              currentUserData={extractedData}
              connections={connections}
              onConnectCandidate={handleConnectCandidate}
              onOpenChat={handleOpenChatWithConnection}
            />
          )}

          {/* View 2: Connections List */}
          {activeNavView === 'connections' && (
            <ConnectionsSection
              connections={connections}
              onOpenChat={handleOpenChatWithConnection}
              onExploreDiscovery={() => setActiveNavView('compat-engine')}
            />
          )}

          {/* View 3: Live & Simulated Chat & Chat Metrics */}
          {(activeNavView === 'chat' || activeNavView === 'chat-intel') && (
            <ChatSection
              connections={connections}
              initialActiveId={activeChatCandidateId}
              onBackToDiscovery={() => setActiveNavView('compat-engine')}
            />
          )}

          {/* View 4: Profile Intelligence Analyzer */}
          {activeNavView === 'profile-intel' && (
            <ProfileIntelligenceSection
              basicProfile={basicProfile}
              onUpdateExtractedData={(data) => setExtractedData(data)}
            />
          )}

          {/* View 5: Cupid AI Dating Assistant Wingman */}
          {activeNavView === 'ai-assistant' && (
            <div className="cupid-hub-view">
              <div className="cupid-hub-card">
                <div className="cupid-hub-header">
                  <span className="cupid-wings-hero">🪽 🏹 🪽</span>
                  <h2>Cupid AI Dating Assistant</h2>
                  <p>
                    Your AI Dating Wingman is ready! Open any conversation in <strong>My Connections</strong> or candidate card and click <strong>"🏹 Cupid AI Assistant"</strong> to generate personalized icebreakers, revive topics, and receive communication guidance.
                  </p>
                  <div className="cupid-hub-actions">
                    <button
                      type="button"
                      className="cupid-hub-btn"
                      onClick={() => setActiveNavView('chat')}
                    >
                      💬 Open Chat with Cupid Wingman
                    </button>
                    <button
                      type="button"
                      className="cupid-hub-sec-btn"
                      onClick={() => setActiveNavView('compat-engine')}
                    >
                      🌟 Browse Profiles with Cupid Tips
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* View 6: AI-Powered Personalized Date Planner */}
          {activeNavView === 'date-planner' && (
            <DatePlannerSection
              connections={connections}
              currentUserName={basicProfile.name}
              onExploreConnections={() => setActiveNavView('compat-engine')}
            />
          )}

          {/* View 7: AI-Powered Horoscope Match – Cosmic Connections */}
          {activeNavView === 'horoscope-match' && (
            <HoroscopeMatchSection
              onConnectCandidate={handleConnectCandidate}
              connectedCandidateIds={connections.map((c) => c.user.id)}
              onOpenChat={handleOpenChatWithConnection}
            />
          )}

          {/* Other Planned Roadmap Subsystems */}
          {activeNavView !== 'home' &&
            activeNavView !== 'compat-engine' &&
            activeNavView !== 'connections' &&
            activeNavView !== 'chat' &&
            activeNavView !== 'profile-intel' &&
            activeNavView !== 'ai-assistant' &&
            activeNavView !== 'chat-intel' &&
            activeNavView !== 'date-planner' &&
            activeNavView !== 'horoscope-match' && (
              <div className="coming-soon-banner">
                <span className="banner-icon">🚀</span>
                <h3>Feature in Active Development</h3>
                <p>
                  This milestone capability is next on our platform roadmap. You can continue discovering matches, connecting, chatting, or analyzing your profile intelligence right now.
                </p>
                <button
                  type="button"
                  className="return-btn"
                  onClick={() => setActiveNavView('compat-engine')}
                >
                  Go to Discovery & Compatibility
                </button>
              </div>
            )}
        </main>

        <Footer />
      </div>

      {/* Public Profile Preview Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        basicProfile={basicProfile}
        intelligenceData={extractedData}
        onEditBasicProfile={() => setIsSetupModalOpen(true)}
        onElaborateWithAI={() => {
          setIsProfileOpen(false);
          setActiveNavView('profile-intel');
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
