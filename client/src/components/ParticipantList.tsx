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
        Participants ({participants.length})
      </h3>
      <div className="participant-grid">
        {participants.map((participant) => (
          <div key={participant.id} className="participant-item">
            <span className="participant-name">{participant.nickname}</span>
            {participant.isHost && <span className="host-badge">Host</span>}
          </div>
        ))}
      </div>
    </div>
  );
};
