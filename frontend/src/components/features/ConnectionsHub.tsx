import React, { useState } from 'react';
import { MessageSquare, Calendar } from 'lucide-react';
import { Connection } from '../../types/chat';
import { ChatSection } from './ChatSection';
import { DatePlannerSection } from './DatePlannerSection';

interface ConnectionsHubProps {
  connections: Connection[];
  initialActiveId: string | null;
  currentUserName: string;
  onExploreDiscovery: () => void;
  initialTab?: 'chats' | 'date-planner';
}

export const ConnectionsHub: React.FC<ConnectionsHubProps> = ({
  connections,
  initialActiveId,
  currentUserName,
  onExploreDiscovery,
  initialTab = 'chats',
}) => {
  const [activeTab, setActiveTab] = useState<'chats' | 'date-planner'>(initialTab);

  return (
    <div className="connections-hub-container">
      {/* Subsystem Sub-Tabs */}
      <div className="subsystem-tabs-bar">
        <button
          type="button"
          className={`subsystem-tab-btn ${activeTab === 'chats' ? 'active' : ''}`}
          onClick={() => setActiveTab('chats')}
        >
          <MessageSquare size={16} />
          <span>Active Connections & Chats ({connections.length})</span>
        </button>

        <button
          type="button"
          className={`subsystem-tab-btn ${activeTab === 'date-planner' ? 'active' : ''}`}
          onClick={() => setActiveTab('date-planner')}
        >
          <Calendar size={16} />
          <span>Curated Date Planner</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'chats' && (
        <ChatSection
          connections={connections}
          initialActiveId={initialActiveId}
          onBackToDiscovery={onExploreDiscovery}
        />
      )}

      {activeTab === 'date-planner' && (
        <DatePlannerSection
          connections={connections}
          currentUserName={currentUserName}
          onExploreConnections={onExploreDiscovery}
        />
      )}
    </div>
  );
};
