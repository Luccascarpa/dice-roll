export interface Participant {
  id: string;
  nickname: string;
  isHost: boolean;
  rollCount: number;
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
  rollHistory: DiceRoll[];
  totalRollCount: number;
  host: string;
}
