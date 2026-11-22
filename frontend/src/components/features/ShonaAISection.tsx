import React, { useState } from 'react';
import { Send, Sparkles, Mic, Lightbulb, MessageCircle } from 'lucide-react';
import { Connection } from '../../types/chat';

interface ShonaAISectionProps {
  currentUserName: string;
  connections: Connection[];
  onOpenChat: (candidateId: string) => void;
}

interface Message {
  id: string;
  sender: 'shona' | 'user';
  text: string;
  timestamp: string;
}

export const ShonaAISection: React.FC<ShonaAISectionProps> = ({
  currentUserName,
  connections,
  onOpenChat,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'shona',
      text: `Hello ${currentUserName}! I'm Shona, your empathetic relationship companion. Whether you'd like advice on communication pacing, navigating personal boundaries, or crafting thoughtful conversation starters with your connections, I'm here for you.`,
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isVoiceActive, setIsVoiceActive] = useState<boolean>(false);
  const [isDeepThinking, setIsDeepThinking] = useState<boolean>(false);

  const quickPrompts = [
    'How do I express my need for independent creative space?',
    'Give me an authentic opener for someone who loves nature and books',
    'How do I know if our communication cadences align well?',
    'What are healthy boundary check-ins for a first date?',
  ];

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Empathetic response generation
    setTimeout(() => {
      let reply = `That's a thoughtful question, ${currentUserName}. In meaningful relationships, clarity around intentions is a strength, not a burden. Open with genuine curiosity about their day-to-day rhythm.`;
      const lower = text.toLowerCase();

      if (lower.includes('space') || lower.includes('boundary')) {
        reply = `Healthy relationships thrive on 'connected independence.' Frame boundaries positively: "I love having deep focused creative blocks on weekends, which makes me appreciate our shared time even more."`;
      } else if (lower.includes('opener') || lower.includes('starter') || lower.includes('icebreaker')) {
        reply = `Here is an authentic, non-generic opener: "I saw you're drawn to indie cinema and slow coffee mornings. What's one film that changed how you view everyday connections?"`;
      } else if (lower.includes('date') || lower.includes('first date')) {
        reply = `For first meetings, low-pressure public spaces with ambient movement (like an art gallery café or a tea house near a park) encourage effortless dialogue without rigid interview dynamics.`;
      }

      const botMsg: Message = {
        id: `shona_${Date.now()}`,
        sender: 'shona',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-light)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '20px',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'var(--color-rose-light)',
            color: 'var(--color-rose)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px'
          }}>
            🤖
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '22px' }}>Shona AI Assistant & Cupid Wingman</h2>
            <p style={{ margin: '3px 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
              Empathetic communication coaching, boundary reflection & thoughtful dating guidance
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setIsVoiceActive(!isVoiceActive)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '20px',
              border: '1px solid var(--border-light)',
              background: isVoiceActive ? 'var(--color-rose-light)' : 'transparent',
              color: isVoiceActive ? 'var(--color-rose)' : 'var(--text-body)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Mic size={14} />
            <span>{isVoiceActive ? 'Voice Mode: Active' : 'Voice Mode: Off'}</span>
          </button>
        </div>

        {connections.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', marginTop: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Wingman shortcuts:</span>
            {connections.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => onOpenChat(c.user.id)}
                style={{
                  background: 'var(--color-rose-light)',
                  border: '1px solid var(--color-rose-border)',
                  color: 'var(--color-rose)',
                  fontSize: '11.5px',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <MessageCircle size={11} /> Chat with {c.user.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Chat Interface */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-light)',
        borderRadius: '16px',
        boxShadow: 'var(--shadow-card)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '620px'
      }}>
        {/* Messages Scroll Area */}
        <div style={{
          flex: 1,
          padding: '24px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px'
        }}>
          {messages.map((m) => {
            const isMe = m.sender === 'user';
            return (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  alignSelf: isMe ? 'flex-end' : 'flex-start',
                  maxWidth: '75%',
                  flexDirection: isMe ? 'row-reverse' : 'row'
                }}
              >
                {!isMe ? (
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'var(--color-rose-light)',
                    color: 'var(--color-rose)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '15px',
                    flexShrink: 0
                  }}>
                    ✨
                  </div>
                ) : (
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'var(--color-deep-plum)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '13px',
                    fontWeight: 700,
                    flexShrink: 0
                  }}>
                    {currentUserName[0]}
                  </div>
                )}

                <div style={{
                  background: isMe ? 'var(--color-rose)' : 'var(--bg-surface-subtle)',
                  color: isMe ? '#ffffff' : 'var(--text-main)',
                  padding: '14px 18px',
                  borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  border: isMe ? 'none' : '1px solid var(--border-light)',
                  boxShadow: 'var(--shadow-subtle)',
                  fontSize: '14px',
                  lineHeight: 1.6
                }}>
                  {m.text}
                  <span style={{
                    display: 'block',
                    fontSize: '10.5px',
                    opacity: 0.7,
                    marginTop: '6px',
                    textAlign: isMe ? 'right' : 'left'
                  }}>
                    {m.timestamp}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Suggestion Pills */}
        <div style={{
          padding: '8px 20px',
          background: 'var(--bg-surface-subtle)',
          borderTop: '1px solid var(--border-light)',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          whiteSpace: 'nowrap'
        }}>
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(q)}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-light)',
                color: 'var(--text-body)',
                fontSize: '12px',
                padding: '6px 12px',
                borderRadius: '16px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease'
              }}
            >
              <Lightbulb size={12} color="#D9668D" />
              <span>{q}</span>
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div style={{
          padding: '16px 20px',
          background: 'var(--bg-surface)',
          borderTop: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <button
            type="button"
            onClick={() => setIsDeepThinking(!isDeepThinking)}
            style={{
              background: isDeepThinking ? 'var(--color-rose-light)' : 'transparent',
              border: '1px solid var(--border-light)',
              borderRadius: '8px',
              padding: '8px',
              color: isDeepThinking ? 'var(--color-rose)' : 'var(--text-muted)',
              cursor: 'pointer'
            }}
            title="Toggle Deep Psychological Reflection Mode"
          >
            <Sparkles size={18} />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask Shona for advice, relationship reflection, or conversation ideas..."
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '24px',
              border: '1px solid var(--border-light)',
              background: 'var(--bg-input)',
              color: 'var(--text-main)',
              fontSize: '14px',
              outline: 'none'
            }}
          />

          <button
            type="button"
            onClick={() => handleSendMessage()}
            className="card-connect-btn"
            style={{
              borderRadius: '50%',
              width: '42px',
              height: '42px',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
