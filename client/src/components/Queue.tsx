import React from 'react';
import { Participant } from '../types';
import '../styles/Queue.css';

interface QueueProps {
  participants: Participant[];
  currentRollerIndex: number;
  lastRollerNickname?: string;
}

export const Queue: React.FC<QueueProps> = ({
  participants,
  currentRollerIndex,
  lastRollerNickname
}) => {
  const currentRoller = participants[currentRollerIndex];
  const nextRollers = [
    ...participants.slice(currentRollerIndex + 1),
    ...participants.slice(0, currentRollerIndex)
  ].slice(0, 5);

  return (
    <div className="queue-container card">
      <h3 className="queue-title">Roll Queue</h3>

      {lastRollerNickname && (
        <div className="last-roller">
          <span className="last-roller-label">Last roll:</span>
          <span className="last-roller-name">{lastRollerNickname}</span>
        </div>
      )}

      <div className="current-roller">
        <div className="roller-badge current">Current</div>
        <div className="roller-name">{currentRoller?.nickname || 'Waiting...'}</div>
      </div>

      {nextRollers.length > 0 && (
        <div className="next-rollers">
          <div className="next-label">Up Next:</div>
          {nextRollers.map((participant, idx) => (
            <div key={participant.id} className="next-roller">
              <span className="next-position">{idx + 1}</span>
              <span className="next-name">{participant.nickname}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
