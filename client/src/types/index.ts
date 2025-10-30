export interface Participant {
  id: string;
  nickname: string;
  isHost: boolean;
}

export interface DiceRoll {
  value: number;
  rollerId: string;
  rollerNickname: string;
  timestamp: number;
}

export interface SessionState {
  sessionId: string;
  participants: Participant[];
  currentRollerIndex: number;
  rollCount: number;
  lastRoll: DiceRoll | null;
  host: string; // host's socket id
}
