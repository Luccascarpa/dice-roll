import React from 'react';
import { Participant } from '../types';
import '../styles/WaitingRoom.css';

interface WaitingRoomProps {
  waitingParticipants: Participant[];
  onAcceptParticipant: (participantId: string) => void;
  onAcceptAll: () => void;
}

export const WaitingRoom: React.FC<WaitingRoomProps> = ({
  waitingParticipants,
  onAcceptParticipant,
  onAcceptAll,
}) => {
  if (waitingParticipants.length === 0) {
    return null;
  }

  return (
    <div className="waiting-room card">
      <div className="waiting-room-header">
        <h3>🚪 Sala de Espera</h3>
        <span className="waiting-count">{waitingParticipants.length} aguardando</span>
      </div>

      <div className="waiting-list">
        {waitingParticipants.map((participant) => (
          <div key={participant.id} className="waiting-participant">
            <span className="waiting-nickname">👤 {participant.nickname}</span>
            <button
              className="button button-small button-primary"
              onClick={() => onAcceptParticipant(participant.id)}
            >
              Aceitar
            </button>
          </div>
        ))}
      </div>

      {waitingParticipants.length > 1 && (
        <button
          className="button button-primary accept-all-button"
          onClick={onAcceptAll}
        >
          ✅ Aceitar Todos ({waitingParticipants.length})
        </button>
      )}
    </div>
  );
};
