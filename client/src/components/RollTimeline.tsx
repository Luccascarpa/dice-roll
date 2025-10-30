import React from 'react';
import { DiceRoll } from '../types';
import '../styles/RollTimeline.css';

interface RollTimelineProps {
  rollHistory: DiceRoll[];
}

export const RollTimeline: React.FC<RollTimelineProps> = ({ rollHistory }) => {
  // Show most recent rolls first
  const sortedRolls = [...rollHistory].reverse();

  const renderDiceFace = (value: number) => {
    const positions = [
      [], // 0 (not used)
      [[50, 50]], // 1
      [[25, 25], [75, 75]], // 2
      [[25, 25], [50, 50], [75, 75]], // 3
      [[25, 25], [25, 75], [75, 25], [75, 75]], // 4
      [[25, 25], [25, 75], [50, 50], [75, 25], [75, 75]], // 5
      [[25, 25], [25, 50], [25, 75], [75, 25], [75, 50], [75, 75]], // 6
    ];

    const dotPositions = positions[value] || [];

    return (
      <div className="timeline-dice">
        {dotPositions.map((pos, idx) => (
          <div
            key={idx}
            className="timeline-dice-dot"
            style={{ left: `${pos[0]}%`, top: `${pos[1]}%` }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="roll-timeline card">
      <h3 className="timeline-title">Histórico de Lançamentos</h3>
      <div className="timeline-list">
        {sortedRolls.length === 0 ? (
          <div className="timeline-empty">Nenhum lançamento ainda</div>
        ) : (
          sortedRolls.map((roll, index) => (
            <div key={`${roll.timestamp}-${index}`} className="timeline-item">
              <img
                src={`/avatars/${roll.rollerAvatar}`}
                alt={roll.rollerNickname}
                className="timeline-avatar"
              />
              <div className="timeline-dice-container">
                {renderDiceFace(roll.value)}
              </div>
              <div className="timeline-info">
                <div className="timeline-nickname">{roll.rollerNickname}</div>
                <div className="timeline-time">
                  {new Date(roll.timestamp).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
