import { SessionData, SessionState, Participant, DiceRoll } from './types.js';

export class SessionManager {
  private sessions: Map<string, SessionData> = new Map();

  generateSessionId(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  createSession(hostId: string, hostNickname: string): string {
    const sessionId = this.generateSessionId();

    const host: Participant = {
      id: hostId,
      nickname: hostNickname,
      isHost: true,
    };

    const state: SessionState = {
      sessionId,
      participants: [host],
      currentRollerIndex: 0,
      rollCount: 0,
      lastRoll: null,
      host: hostId,
    };

    this.sessions.set(sessionId, {
      state,
      createdAt: Date.now(),
    });

    console.log(`Session ${sessionId} created by ${hostNickname}`);
    return sessionId;
  }

  joinSession(sessionId: string, participantId: string, nickname: string): boolean {
    const session = this.sessions.get(sessionId);

    if (!session) {
      return false;
    }

    // Check if participant already exists (reconnection)
    const existingParticipant = session.state.participants.find(
      p => p.id === participantId
    );

    if (!existingParticipant) {
      const participant: Participant = {
        id: participantId,
        nickname,
        isHost: false,
      };

      session.state.participants.push(participant);
      console.log(`${nickname} joined session ${sessionId}`);
    }

    return true;
  }

  removeParticipant(sessionId: string, participantId: string): void {
    const session = this.sessions.get(sessionId);

    if (!session) return;

    session.state.participants = session.state.participants.filter(
      p => p.id !== participantId
    );

    // Adjust current roller index if needed
    if (session.state.currentRollerIndex >= session.state.participants.length) {
      session.state.currentRollerIndex = 0;
    }

    // Delete session if empty
    if (session.state.participants.length === 0) {
      this.sessions.delete(sessionId);
      console.log(`Session ${sessionId} deleted (empty)`);
    }
  }

  rollDice(sessionId: string, rollerId: string): DiceRoll | null {
    const session = this.sessions.get(sessionId);

    if (!session) return null;

    const currentRoller = session.state.participants[session.state.currentRollerIndex];

    if (!currentRoller || currentRoller.id !== rollerId) {
      return null; // Not the roller's turn
    }

    const value = Math.floor(Math.random() * 6) + 1;

    const roll: DiceRoll = {
      value,
      rollerId,
      rollerNickname: currentRoller.nickname,
      timestamp: Date.now(),
    };

    session.state.lastRoll = roll;
    session.state.rollCount++;

    console.log(`${currentRoller.nickname} rolled a ${value} in session ${sessionId}`);

    return roll;
  }

  advanceRound(sessionId: string, requesterId: string): boolean {
    const session = this.sessions.get(sessionId);

    if (!session) return false;

    // Only host can advance
    if (session.state.host !== requesterId) {
      return false;
    }

    session.state.currentRollerIndex =
      (session.state.currentRollerIndex + 1) % session.state.participants.length;

    console.log(`Round advanced in session ${sessionId}`);
    return true;
  }

  resetCounter(sessionId: string, requesterId: string): boolean {
    const session = this.sessions.get(sessionId);

    if (!session) return false;

    // Only host can reset
    if (session.state.host !== requesterId) {
      return false;
    }

    session.state.rollCount = 0;
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
