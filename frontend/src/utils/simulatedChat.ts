import { ChatMessage } from '../types/chat';

export const INITIAL_SIMULATED_CHATS: Record<string, ChatMessage[]> = {
  // Dr. Maya Alva (user_3) - Rich multi-turn conversation demonstrating depth progression
  user_3: [
    {
      id: 'm1',
      sender: 'match',
      text: 'Hey Anamika! Saw on your profile that you value authenticity and intentional conversations 💕. Also noticed you love coffee—have you tried any good pour-overs lately?',
      timestamp: 'Yesterday 7:42 PM',
    },
    {
      id: 'm2',
      sender: 'user',
      text: 'Hey Maya! Yes, absolutely! I’ve been brewing light roast Ethiopian beans every morning. How are your hospital rounds going?',
      timestamp: 'Yesterday 8:05 PM',
    },
    {
      id: 'm3',
      sender: 'match',
      text: 'Demanding shift today in pediatrics, but honestly the kids keep me smiling! Running a 10k this weekend to decompress. What’s your favorite way to unwind on Sundays?',
      timestamp: 'Yesterday 8:30 PM',
    },
    {
      id: 'm4',
      sender: 'user',
      text: 'For me, it’s quiet gallery walks followed by long sketch sessions without notifications. I really admire how you balance intense hospital shifts with endurance running!',
      timestamp: 'Yesterday 9:15 PM',
    },
    {
      id: 'm5',
      sender: 'match',
      text: 'Thank you! It took a lot of trial and error to protect my mental bandwidth. I’ve realized having an emotionally grounded partner who understands shift work is so key for me.',
      timestamp: 'Today 10:15 AM',
    },
  ],

  // Rohan Verma (user_2) - Pre-loaded balanced creative conversation
  user_2: [
    {
      id: 'r1',
      sender: 'match',
      text: 'Hey Anamika! Great connecting with you. I noticed our AI compatibility report scored high on creative craftsmanship and intellectual curiosity 🎹. What kind of design projects do you enjoy most?',
      timestamp: 'Yesterday 6:20 PM',
    },
    {
      id: 'r2',
      sender: 'user',
      text: 'Hey Rohan! I love crafting minimal design systems with strong typography. Also heard you play jazz piano—do you lean more toward classic standards or modern bebop?',
      timestamp: 'Yesterday 7:00 PM',
    },
    {
      id: 'r3',
      sender: 'match',
      text: 'Definitely classic bebop and Bill Evans modal harmonies! Playing after long product sprints is pure therapy. Do you listen to music while designing?',
      timestamp: 'Today 11:30 AM',
    },
  ],

  // Pooja Kulkarni (user_8)
  user_8: [
    {
      id: 'p1',
      sender: 'match',
      text: 'Hi Anamika! Loved seeing your profile highlights. Are you into strategy board games or sci-fi podcasts at all? Looking forward to chatting!',
      timestamp: 'Today 12:45 PM',
    },
  ],
};

const SIMULATED_RESPONSES: Record<string, string[]> = {
  // Maya Alva responses
  user_3: [
    "That sounds so relaxing! For me, a quiet evening with a home-cooked dinner and good conversation is the ultimate recharge after 12-hour hospital shifts.",
    "I completely agree! Real connection takes presence and vulnerability. What's a value you refuse to compromise on?",
    "Haha true! Balancing medicine and marathon training is tricky, but keeping intentional routines keeps me grounded. Do you prefer structured plans or spontaneous weekend outings?",
    "That's so thoughtful. I love people who speak their truth with warmth and empathy.",
  ],

  // Rohan Verma responses
  user_2: [
    "I love that perspective! In design and in jazz music, it's always about the rhythm and the spaces between notes. Have you been to any art galleries recently?",
    "Totally! Vinyl records and espresso are my ultimate winding-down ritual. Do you have a favorite genre or album you keep returning to?",
    "That resonates deeply. Mutual growth and inspiring each other is everything in a relationship.",
    "Haha yes! Let's definitely explore that. What's your go-to coffee order when you want to focus?",
  ],

  // Default fallback responses
  default: [
    "That's really interesting! I love that we share a similar outlook on this.",
    "That speaks so much to who you are. How did you get into that?",
    "I appreciate you sharing that! Honest, relaxed conversations like this make dating feel so much more meaningful.",
    "Haha so true! What are you most excited about this week?",
  ],
};

export function getSimulatedReply(candidateId: string, messageIndex: number): string {
  const pool = SIMULATED_RESPONSES[candidateId] || SIMULATED_RESPONSES.default;
  return pool[messageIndex % pool.length];
}
