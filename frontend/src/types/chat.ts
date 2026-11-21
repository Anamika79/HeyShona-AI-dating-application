import { UserProfileSummary } from './compatibility';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'match';
  text: string;
  timestamp: string;
}

export interface Connection {
  id: string;
  user: UserProfileSummary;
  connectedAt: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}
