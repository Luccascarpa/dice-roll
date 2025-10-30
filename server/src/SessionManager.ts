import { SessionData, SessionState, Participant, DiceRoll } from './types.js';

export class SessionManager {
  private sessions: Map<string, SessionData> = new Map();

  generateSessionId(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  createSession(hostId: string, hostNickname: string, hostAvatar: string): string {
    const sessionId = this.generateSessionId();

    const host: Participant = {
      id: hostId,
      nickname: hostNickname,
      avatar: hostAvatar,
      isHost: true,
      rollCount: 0,
      isAccepted: true,
    };

    const state: SessionState = {
      sessionId,
      participants: [host],
      waitingParticipants: [],
      rollHistory: [],
      totalRollCount: 0,
      host: hostId,
    };

    this.sessions.set(sessionId, {
      state,
      createdAt: Date.now(),
    });

    console.log(`Session ${sessionId} created by ${hostNickname}`);
    return sessionId;
  }

  joinSession(sessionId: string, participantId: string, nickname: string, avatar: string): boolean {
    const session = this.sessions.get(sessionId);

    if (!session) {
      return false;
    }

    // Check if participant already exists (reconnection)
    const existingParticipant = session.state.participants.find(
      p => p.id === participantId
    );
    const existingWaiting = session.state.waitingParticipants.find(
      p => p.id === participantId
    );

    if (!existingParticipant && !existingWaiting) {
      const participant: Participant = {
        id: participantId,
        nickname,
        avatar,
        isHost: false,
        rollCount: 0,
        isAccepted: false,
      };

      // Add to waiting list instead of participants
      session.state.waitingParticipants.push(participant);
      console.log(`${nickname} joined session ${sessionId} (waiting for approval)`);
    }

    return true;
  }

  acceptParticipant(sessionId: string, participantId: string, requesterId: string): boolean {
    const session = this.sessions.get(sessionId);

    if (!session) return false;

    // Only host can accept participants
    if (session.state.host !== requesterId) {
      return false;
    }

    const participantIndex = session.state.waitingParticipants.findIndex(
      p => p.id === participantId
    );

    if (participantIndex === -1) {
      return false;
    }

    // Move participant from waiting to active participants
    const participant = session.state.waitingParticipants[participantIndex];
    participant.isAccepted = true;
    session.state.waitingParticipants.splice(participantIndex, 1);
    session.state.participants.push(participant);

    console.log(`${participant.nickname} accepted into session ${sessionId}`);
    return true;
  }

  acceptAllParticipants(sessionId: string, requesterId: string): boolean {
    const session = this.sessions.get(sessionId);

    if (!session) return false;

    // Only host can accept participants
    if (session.state.host !== requesterId) {
      return false;
    }

    // Move all waiting participants to active participants
    session.state.waitingParticipants.forEach(participant => {
      participant.isAccepted = true;
      session.state.participants.push(participant);
    });

    console.log(`All ${session.state.waitingParticipants.length} waiting participants accepted into session ${sessionId}`);
    session.state.waitingParticipants = [];

    return true;
  }

  removeParticipant(sessionId: string, participantId: string): void {
    const session = this.sessions.get(sessionId);

    if (!session) return;

    session.state.participants = session.state.participants.filter(
      p => p.id !== participantId
    );
    session.state.waitingParticipants = session.state.waitingParticipants.filter(
      p => p.id !== participantId
    );

    // Delete session if empty
    if (session.state.participants.length === 0) {
      this.sessions.delete(sessionId);
      console.log(`Session ${sessionId} deleted (empty)`);
    }
  }

  rollDice(sessionId: string, rollerId: string): DiceRoll | null {
    const session = this.sessions.get(sessionId);

    if (!session) return null;

    const roller = session.state.participants.find(p => p.id === rollerId);

    if (!roller) {
      return null; // Participant not found
    }

    const value = Math.floor(Math.random() * 6) + 1;

    const roll: DiceRoll = {
      value,
      rollerId,
      rollerNickname: roller.nickname,
      rollerAvatar: roller.avatar,
      timestamp: Date.now(),
    };

    // Add to history
    session.state.rollHistory.push(roll);

    // Update counters
    session.state.totalRollCount++;
    roller.rollCount++;

    console.log(`${roller.nickname} rolled a ${value} in session ${sessionId}`);

    return roll;
  }

  resetCounter(sessionId: string, requesterId: string): boolean {
    const session = this.sessions.get(sessionId);

    if (!session) return false;

    // Only host can reset
    if (session.state.host !== requesterId) {
      return false;
    }

    session.state.totalRollCount = 0;
    session.state.rollHistory = [];

    // Reset all participants' roll counts
    session.state.participants.forEach(p => {
      p.rollCount = 0;
    });

    console.log(`Counter reset in session ${sessionId}`);
    return true;
  }

  getSessionState(sessionId: string): SessionState | null {
    const session = this.sessions.get(sessionId);
    return session ? session.state : null;
  }

  sessionExists(sessionId: string): boolean {
    return this.sessions.has(sessionId);
  }

  getAllSessions(): string[] {
    return Array.from(this.sessions.keys());
  }

  // Cleanup old sessions (optional - run periodically)
  cleanupOldSessions(maxAgeMs: number = 24 * 60 * 60 * 1000): void {
    const now = Date.now();

    for (const [sessionId, session] of this.sessions.entries()) {
      if (now - session.createdAt > maxAgeMs) {
        this.sessions.delete(sessionId);
        console.log(`Session ${sessionId} deleted (expired)`);
      }
    }
  }
}
