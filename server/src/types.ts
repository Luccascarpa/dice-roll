export interface Participant {
  id: string;
  nickname: string;
  isHost: boolean;
  rollCount: number;
  isAccepted: boolean;
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
  waitingParticipants: Participant[];
  rollHistory: DiceRoll[];
  totalRollCount: number;
  host: string;
}

export interface SessionData {
  state: SessionState;
  createdAt: number;
}
