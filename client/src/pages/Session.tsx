import React, { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { SessionState } from '../types';
import { Dice } from '../components/Dice';
import { Counter } from '../components/Counter';
import { Queue } from '../components/Queue';
import { HostControls } from '../components/HostControls';
import { ParticipantList } from '../components/ParticipantList';
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

  useEffect(() => {
    socket.on('session-state', (state: SessionState) => {
      setSessionState(state);
    });

    socket.on('dice-rolled', () => {
      setIsRolling(true);
      setTimeout(() => {
        setIsRolling(false);
      }, 500);
    });

    return () => {
      socket.off('session-state');
      socket.off('dice-rolled');
    };
  }, [socket]);

  const handleRollDice = () => {
    if (!isRolling) {
      socket.emit('roll-dice');
    }
  };

  const handleAdvanceRound = () => {
    socket.emit('advance-round');
  };

  const handleResetCounter = () => {
    if (window.confirm('Tem certeza que deseja resetar o contador para 0?')) {
      socket.emit('reset-counter');
    }
  };

  const handleCopySessionId = () => {
    navigator.clipboard.writeText(sessionId);
    setShowSessionId(true);
    setTimeout(() => setShowSessionId(false), 2000);
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
  const currentRoller = sessionState.participants[sessionState.currentRollerIndex];
  const isMyTurn = currentRoller?.id === mySocketId;

  return (
    <div className="session-container">
      <div className="session-header">
        <h1 className="session-title">
          <svg className="autou-logo-small" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 10 L90 85 Q50 70 10 85 Z" fill="#FF8C61"/>
          </svg>
          🎲 Dado Virtual
        </h1>
        <button className="session-id-button" onClick={handleCopySessionId}>
          {showSessionId ? 'Copiado!' : `Sessão: ${sessionId}`}
        </button>
      </div>

      <div className="session-layout">
        <div className="main-area">
          <Counter count={sessionState.rollCount} />

          <div className="dice-section card">
            {sessionState.lastRoll && (
              <div className="last-roll-display">
                Último Lançamento: <strong>{sessionState.lastRoll.value}</strong> por{' '}
                <strong>{sessionState.lastRoll.rollerNickname}</strong>
              </div>
            )}

            <Dice
              value={sessionState.lastRoll?.value || null}
              isRolling={isRolling}
            />

            {isMyTurn && (
              <button
                className="button button-primary roll-button"
                onClick={handleRollDice}
                disabled={isRolling}
              >
                {isRolling ? 'Lançando...' : '🎲 Lançar Dado'}
              </button>
            )}

            {!isMyTurn && (
              <div className="waiting-message">
                Aguardando <strong>{currentRoller?.nickname}</strong> lançar...
              </div>
            )}
          </div>

          <ParticipantList participants={sessionState.participants} />
        </div>

        <div className="sidebar">
          <Queue
            participants={sessionState.participants}
            currentRollerIndex={sessionState.currentRollerIndex}
            lastRollerNickname={sessionState.lastRoll?.rollerNickname}
          />

          {isHost && (
            <HostControls
              onAdvanceRound={handleAdvanceRound}
              onResetCounter={handleResetCounter}
            />
          )}
        </div>
      </div>
    </div>
  );
};
