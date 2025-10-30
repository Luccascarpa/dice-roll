import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { SessionManager } from './SessionManager.js';

const app = express();
const httpServer = createServer(app);

app.use(cors());

const io = new Server(httpServer, {
  cors: {
    origin: '*', // Allow all origins for ngrok testing
    methods: ['GET', 'POST'],
  },
});

const sessionManager = new SessionManager();

// Store socket to session mapping
const socketToSession = new Map<string, string>();

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Create Session
  socket.on('create-session', (nickname: string) => {
    const sessionId = sessionManager.createSession(socket.id, nickname);
    socketToSession.set(socket.id, sessionId);

    socket.join(sessionId);
    socket.emit('session-created', sessionId);

    const state = sessionManager.getSessionState(sessionId);
    if (state) {
      io.to(sessionId).emit('session-state', state);
    }
  });

  // Join Session
  socket.on('join-session', ({ sessionId, nickname }: { sessionId: string; nickname: string }) => {
    if (!sessionManager.sessionExists(sessionId)) {
      socket.emit('error', 'Session not found');
      return;
    }

    const success = sessionManager.joinSession(sessionId, socket.id, nickname);

    if (success) {
      socketToSession.set(socket.id, sessionId);
      socket.join(sessionId);
      socket.emit('session-joined', sessionId);

      const state = sessionManager.getSessionState(sessionId);
      if (state) {
        io.to(sessionId).emit('session-state', state);
      }
    } else {
      socket.emit('error', 'Failed to join session');
    }
  });

  // Roll Dice
  socket.on('roll-dice', () => {
    const sessionId = socketToSession.get(socket.id);
    if (!sessionId) return;

    const roll = sessionManager.rollDice(sessionId, socket.id);

    if (roll) {
      io.to(sessionId).emit('dice-rolled', roll);

      const state = sessionManager.getSessionState(sessionId);
      if (state) {
        io.to(sessionId).emit('session-state', state);
      }
    } else {
      socket.emit('error', 'Not your turn or invalid session');
    }
  });

  // Advance Round
  socket.on('advance-round', () => {
    const sessionId = socketToSession.get(socket.id);
    if (!sessionId) return;

    const success = sessionManager.advanceRound(sessionId, socket.id);

    if (success) {
      const state = sessionManager.getSessionState(sessionId);
      if (state) {
        io.to(sessionId).emit('session-state', state);
      }
    } else {
      socket.emit('error', 'Only host can advance round');
    }
  });

  // Reset Counter
  socket.on('reset-counter', () => {
    const sessionId = socketToSession.get(socket.id);
    if (!sessionId) return;

    const success = sessionManager.resetCounter(sessionId, socket.id);

    if (success) {
      const state = sessionManager.getSessionState(sessionId);
      if (state) {
        io.to(sessionId).emit('session-state', state);
      }
    } else {
      socket.emit('error', 'Only host can reset counter');
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);

    const sessionId = socketToSession.get(socket.id);
    if (sessionId) {
      sessionManager.removeParticipant(sessionId, socket.id);
      socketToSession.delete(socket.id);

      const state = sessionManager.getSessionState(sessionId);
      if (state) {
        io.to(sessionId).emit('session-state', state);
      }
    }
  });
});

// Cleanup old sessions every hour
setInterval(() => {
  sessionManager.cleanupOldSessions();
}, 60 * 60 * 1000);

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`🎲 Virtual Dice Server running on port ${PORT}`);
});
