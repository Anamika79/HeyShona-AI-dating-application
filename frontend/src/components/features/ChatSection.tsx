import React, { useState, useEffect, useRef } from 'react';
import { Connection, ChatMessage } from '../../types/chat';
import { INITIAL_SIMULATED_CHATS, getSimulatedReply } from '../../utils/simulatedChat';
import { ProfileHoverCard } from '../common/ProfileHoverCard';
import { CupidAssistantModal } from './CupidAssistantModal';
import { ConnectionInsightsModal } from './ConnectionInsightsModal';

interface ChatSectionProps {
  connections: Connection[];
  initialActiveId?: string | null;
  onBackToDiscovery?: () => void;
}

export const ChatSection: React.FC<ChatSectionProps> = ({
  connections,
  initialActiveId,
  onBackToDiscovery,
}) => {
  const [activeConnectionId, setActiveConnectionId] = useState<string>(() => {
    if (initialActiveId && connections.some((c) => c.user.id === initialActiveId)) {
      return initialActiveId;
    }
    return connections.length > 0 ? connections[0].user.id : '';
  });

  const [isCupidOpen, setIsCupidOpen] = useState<boolean>(false);
  const [isInsightsOpen, setIsInsightsOpen] = useState<boolean>(false);

  // Local chat message state mapped by connection id
  const [chatHistories, setChatHistories] = useState<Record<string, ChatMessage[]>>(() => {
    try {
      const saved = localStorage.getItem('hey_shona_chat_histories');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_SIMULATED_CHATS;
  });

  const [inputMessage, setInputMessage] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesStreamRef = useRef<HTMLDivElement | null>(null);

  // Sync active connection when initialActiveId changes
  useEffect(() => {
    if (initialActiveId && connections.some((c) => c.user.id === initialActiveId)) {
      setActiveConnectionId(initialActiveId);
      setIsInsightsOpen(false);
      setIsCupidOpen(false);
    }
  }, [initialActiveId, connections]);

  // Persist chat histories to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hey_shona_chat_histories', JSON.stringify(chatHistories));
    } catch {
      // ignore
    }
  }, [chatHistories]);

  // Auto-scroll only the inner chat messages stream without scrolling the outer page/window
  useEffect(() => {
    if (messagesStreamRef.current) {
      messagesStreamRef.current.scrollTop = messagesStreamRef.current.scrollHeight;
    }
  }, [chatHistories, activeConnectionId, isTyping]);

  const activeConnection = connections.find((c) => c.user.id === activeConnectionId) || connections[0];
  const activeMessages = activeConnection ? chatHistories[activeConnection.user.id] || [] : [];

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend !== undefined ? textToSend : inputMessage).trim();
    if (!text || !activeConnection) return;

    const newMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Just now',
    };

    const updated = {
      ...chatHistories,
      [activeConnection.user.id]: [...activeMessages, newMsg],
    };
    setChatHistories(updated);
    setInputMessage('');

    // Simulate match typing and responding
    setIsTyping(true);
    const replyDelay = 1300 + Math.random() * 800;

    setTimeout(() => {
      const replyText = getSimulatedReply(
        activeConnection.user.id,
        updated[activeConnection.user.id].length
      );
      const matchMsg: ChatMessage = {
        id: `m_${Date.now()}`,
        sender: 'match',
        text: replyText,
        timestamp: 'Just now',
      };

      setChatHistories((prev) => ({
        ...prev,
        [activeConnection.user.id]: [...(prev[activeConnection.user.id] || []), matchMsg],
      }));
      setIsTyping(false);
    }, replyDelay);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (connections.length === 0) {
    return (
      <div className="chat-empty-view">
        <div className="empty-chat-graphic">💬</div>
        <h3>No Connections Yet</h3>
        <p>
          Discover profiles using the AI Compatibility Engine and click <strong>"Connect 💕"</strong> to start conversing!
        </p>
        {onBackToDiscovery && (
          <button className="primary-discovery-btn" onClick={onBackToDiscovery}>
            🔍 Go to Compatibility Discovery
          </button>
        )}
      </div>
    );
  }

  // Quick conversation starters for active match
  const conversationStarters = [
    `What's your favorite spot in the city to recharge?`,
    `Saw your profile values! What kind of projects are you most passionate about right now?`,
    `Would you rather have a quiet cozy evening or an impromptu road trip?`,
  ];

  return (
    <div className="chat-container">
      {/* Left Conversations Sidebar */}
      <div className="chat-sidebar">
        <div className="chat-sidebar-header">
          <h3 className="chat-sidebar-title">My Connections ({connections.length})</h3>
          <span className="chat-sidebar-badge">Live Chats</span>
        </div>

        <div className="chat-connections-list">
          {connections.map((conn) => {
            const isSelected = conn.user.id === activeConnectionId;
            const msgs = chatHistories[conn.user.id] || [];
            const lastMsg = msgs.length > 0 ? msgs[msgs.length - 1].text : 'Connected! Start chatting...';
            const lastTime = msgs.length > 0 ? msgs[msgs.length - 1].timestamp : conn.connectedAt;

            return (
              <div
                key={conn.id}
                className={`chat-connection-item ${isSelected ? 'active' : ''}`}
                onClick={() => {
                  setActiveConnectionId(conn.user.id);
                  setIsInsightsOpen(false);
                  setIsCupidOpen(false);
                }}
              >
                <div className="chat-item-avatar-wrap">
                  <img
                    src={conn.user.avatar_url}
                    alt={conn.user.name}
                    className="chat-item-avatar"
                  />
                  <span className="chat-item-online-dot" />
                </div>

                <div className="chat-item-info">
                  <div className="chat-item-row-top">
                    <span className="chat-item-name">{conn.user.name}</span>
                    <span className="chat-item-time">{lastTime}</span>
                  </div>
                  <p className="chat-item-snippet">{lastMsg}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Chat Conversation Area */}
      {activeConnection ? (
        <div className="chat-main-window">
          {/* Chat Header */}
          <div className="chat-main-header">
            {/* Wrap in hover popover to show brief profile on hover */}
            <ProfileHoverCard user={activeConnection.user} compatibilityScore={88}>
              <div className="chat-header-user">
                <div className="chat-header-avatar-wrap">
                  <img
                    src={activeConnection.user.avatar_url}
                    alt={activeConnection.user.name}
                    className="chat-header-avatar"
                  />
                  <span className="chat-header-online-dot" />
                </div>
                <div className="chat-header-details">
                  <div className="chat-header-name-row">
                    <h4 className="chat-header-name">
                      {activeConnection.user.name}, {activeConnection.user.age}
                    </h4>
                    <span className="chat-header-compat-pill">
                      ★ Compatible Match (Hover for info)
                    </span>
                  </div>
                  <p className="chat-header-job">
                    {activeConnection.user.occupation} • {activeConnection.user.location}
                  </p>
                </div>
              </div>
            </ProfileHoverCard>

            {/* Header Right Actions Group */}
            <div className="chat-header-actions-group">
              {/* Connection Insights Button */}
              <button
                type="button"
                className="chat-insights-btn"
                onClick={() => setIsInsightsOpen(true)}
                title="View AI Chat Metrics & Connection Insights"
                aria-label="View Connection Insights"
              >
                <span className="insights-btn-icon">📊</span>
                <span className="insights-btn-text">Connection Insights</span>
              </button>

              {/* Cupid AI Assistant Icon Button on the right side of header */}
              <button
                type="button"
                className="chat-cupid-icon-btn"
                onClick={() => setIsCupidOpen(true)}
                title="Open Cupid AI Assistant"
                aria-label="Cupid AI Assistant"
              >
                <span className="cupid-icon-symbol">🏹</span>
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="chat-messages-stream" ref={messagesStreamRef}>
            <div className="chat-match-intro-card">
              <span className="intro-sparkle">✨</span>
              <p>
                You connected with <strong>{activeConnection.user.name}</strong> based on semantic values alignment and communication synergy!
              </p>
            </div>

            {activeMessages.map((msg) => {
              const isMe = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`chat-bubble-row ${isMe ? 'bubble-right' : 'bubble-left'}`}
                >
                  {!isMe && (
                    <img
                      src={activeConnection.user.avatar_url}
                      alt={activeConnection.user.name}
                      className="bubble-avatar"
                    />
                  )}
                  <div className={`chat-bubble ${isMe ? 'bubble-me' : 'bubble-match'}`}>
                    <p className="bubble-text">{msg.text}</p>
                    <span className="bubble-time">{msg.timestamp}</span>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="chat-bubble-row bubble-left">
                <img
                  src={activeConnection.user.avatar_url}
                  alt={activeConnection.user.name}
                  className="bubble-avatar"
                />
                <div className="chat-bubble bubble-match bubble-typing">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-label">{activeConnection.user.name} is typing...</span>
                </div>
              </div>
            )}

          </div>

          {/* AI Conversation Starters Suggestions - Only shown before conversation starts */}
          {activeMessages.length === 0 && (
            <div className="chat-starters-bar">
              <span className="starters-label">💡 AI Starters:</span>
              <div className="starters-chips">
                {conversationStarters.map((starter, i) => (
                  <button
                    key={i}
                    type="button"
                    className="starter-chip-btn"
                    onClick={() => handleSendMessage(starter)}
                  >
                    {starter}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat Input Footer */}
          <div className="chat-input-footer">
            <input
              type="text"
              className="chat-input-field"
              placeholder={`Send a thoughtful message to ${activeConnection.user.name}...`}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              type="button"
              className="chat-send-btn"
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim()}
            >
              <span>Send</span>
              <span>➤</span>
            </button>
          </div>

          {/* Cupid AI Assistant Modal */}
          {activeConnection && (
            <CupidAssistantModal
              isOpen={isCupidOpen}
              onClose={() => setIsCupidOpen(false)}
              match={activeConnection.user}
              onUseStarter={(starter) => handleSendMessage(starter)}
            />
          )}

          {/* Connection Insights Dashboard Modal */}
          {activeConnection && (
            <ConnectionInsightsModal
              isOpen={isInsightsOpen}
              onClose={() => setIsInsightsOpen(false)}
              match={activeConnection.user}
              messages={activeMessages}
              onUseStarter={(starter) => handleSendMessage(starter)}
            />
          )}
        </div>
      ) : null}
    </div>
  );
};
