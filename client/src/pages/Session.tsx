import React, { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { SessionState, DiceRoll } from '../types';
import { Dice } from '../components/Dice';
import { Counter } from '../components/Counter';
import { RollTimeline } from '../components/RollTimeline';
import { ParticipantList } from '../components/ParticipantList';
import { WaitingRoom } from '../components/WaitingRoom';
import '../styles/Session.css';

interface SessionProps {
  socket: Socket;
  sessionId: string;
  mySocketId: string;
}

export const Session: React.FC<SessionProps> = ({ socket, sessionId, mySocketId }) => {
  const [sessionState, setSessionState] = useState<SessionState | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [showSessionId, setShowSessionId] = useState(false);
  const [lastRoll, setLastRoll] = useState<DiceRoll | null>(null);

  useEffect(() => {
    socket.on('session-state', (state: SessionState) => {
      setSessionState(state);
      // Update last roll from history
      if (state.rollHistory.length > 0) {
        setLastRoll(state.rollHistory[state.rollHistory.length - 1]);
      }
    });

    socket.on('dice-rolled', (roll: DiceRoll) => {
      // Show animation and update dice for all users
      setIsRolling(true);
      setLastRoll(roll);
      setTimeout(() => {
        setIsRolling(false);
      }, 500);
    });

    return () => {
      socket.off('session-state');
      socket.off('dice-rolled');
    };
  }, [socket, mySocketId]);

  const handleRollDice = () => {
    if (!isRolling) {
      socket.emit('roll-dice');
    }
  };

  const handleResetCounter = () => {
    if (window.confirm('Tem certeza que deseja resetar o contador para 0?')) {
      socket.emit('reset-counter');
      setLastRoll(null);
    }
  };

  const handleCopySessionId = () => {
    navigator.clipboard.writeText(sessionId);
    setShowSessionId(true);
    setTimeout(() => setShowSessionId(false), 2000);
  };

  const handleLeaveSession = () => {
    if (window.confirm('Tem certeza que deseja sair da sessão?')) {
      socket.disconnect();
      window.location.reload();
    }
  };

  const handleAcceptParticipant = (participantId: string) => {
    socket.emit('accept-participant', participantId);
  };

  const handleAcceptAll = () => {
    socket.emit('accept-all-participants');
  };

  if (!sessionState) {
    return (
      <div className="session-loading">
        <div className="loading-spinner">🎲</div>
        <p>Carregando sessão...</p>
      </div>
    );
  }

  const isHost = sessionState.host === mySocketId;
  const myParticipant = sessionState.participants.find(p => p.id === mySocketId);
  const isWaiting = sessionState.waitingParticipants.find(p => p.id === mySocketId);
  const myPersonalCount = myParticipant?.rollCount || 0;

  // If user is in waiting room (not host and not accepted)
  if (isWaiting && !isHost) {
    return (
      <div className="session-loading">
        <div className="loading-spinner">🎲</div>
        <p>Aguardando aprovação do anfitrião...</p>
        <p className="waiting-hint">O anfitrião precisa aceitar sua entrada na sessão</p>
      </div>
    );
  }

  return (
    <div className="session-container">
      <div className="session-header">
        <h1 className="session-title">
          <svg className="autou-logo-small" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 10 L90 85 Q50 70 10 85 Z" fill="#FF8C61"/>
          </svg>
          🎲 Dado Virtual
        </h1>
        <div className="session-header-actions">
          <button className="session-id-button" onClick={handleCopySessionId}>
            {showSessionId ? 'Copiado!' : `Sessão: ${sessionId}`}
          </button>
          <button className="leave-session-button" onClick={handleLeaveSession}>
            ← Sair
          </button>
        </div>
      </div>

      <div className="session-layout">
        <div className="main-area">
          {isHost && (
            <WaitingRoom
              waitingParticipants={sessionState.waitingParticipants}
              onAcceptParticipant={handleAcceptParticipant}
              onAcceptAll={handleAcceptAll}
            />
          )}

          <Counter
            totalCount={sessionState.totalRollCount}
            personalCount={myPersonalCount}
          />

          <div className="dice-section card">
            <Dice
              value={lastRoll?.value || null}
              isRolling={isRolling}
            />

            <button
              className="button button-primary roll-button"
              onClick={handleRollDice}
              disabled={isRolling}
            >
              {isRolling ? 'Lançando...' : '🎲 Lançar Dado'}
            </button>
          </div>

          <ParticipantList participants={sessionState.participants} />

          {isHost && (
            <div className="host-controls-inline">
              <button
                className="button button-secondary reset-button"
                onClick={handleResetCounter}
              >
                Resetar Contador
              </button>
            </div>
          )}
        </div>

        <div className="sidebar">
          <RollTimeline rollHistory={sessionState.rollHistory} />
        </div>
      </div>
    </div>
  );
};
