import React from 'react';
import { Participant } from '../types';
import '../styles/ParticipantList.css';

interface ParticipantListProps {
  participants: Participant[];
}

export const ParticipantList: React.FC<ParticipantListProps> = ({ participants }) => {
  return (
    <div className="participant-list card">
      <h3 className="participant-title">
        Participantes ({participants.length})
      </h3>
      <div className="participant-grid">
        {participants.map((participant) => (
          <div key={participant.id} className="participant-item">
            <img
              src={`/avatars/${participant.avatar}`}
              alt={participant.nickname}
              className="participant-avatar"
            />
            <div className="participant-info">
              <span className="participant-name">{participant.nickname}</span>
              {participant.isHost && <span className="host-badge">Anfitrião</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
