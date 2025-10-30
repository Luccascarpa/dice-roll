import React, { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { SessionState, DiceRoll } from '../types';
import { Dice } from '../components/Dice';
import { Counter } from '../components/Counter';
import { RollTimeline } from '../components/RollTimeline';
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
  const [myLastRoll, setMyLastRoll] = useState<DiceRoll | null>(null);

  useEffect(() => {
    socket.on('session-state', (state: SessionState) => {
      setSessionState(state);
    });

    socket.on('dice-rolled', (roll: DiceRoll) => {
      // Only animate if it's my roll
      if (roll.rollerId === mySocketId) {
        setIsRolling(true);
        setMyLastRoll(roll);
        setTimeout(() => {
          setIsRolling(false);
        }, 500);
      }
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
      setMyLastRoll(null);
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
  const myParticipant = sessionState.participants.find(p => p.id === mySocketId);
  const myPersonalCount = myParticipant?.rollCount || 0;

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
          <Counter
            totalCount={sessionState.totalRollCount}
            personalCount={myPersonalCount}
          />

          <div className="dice-section card">
            <Dice
              value={myLastRoll?.value || null}
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
