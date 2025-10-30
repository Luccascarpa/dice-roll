import React from 'react';
import '../styles/Dice.css';

interface DiceProps {
  value: number | null;
  isRolling: boolean;
}

export const Dice: React.FC<DiceProps> = ({ value, isRolling }) => {
  const renderDots = (num: number) => {
    const dots = [];
    const positions = [
      [], // 0 (not used)
      [[50, 50]], // 1
      [[25, 25], [75, 75]], // 2
      [[25, 25], [50, 50], [75, 75]], // 3
      [[25, 25], [25, 75], [75, 25], [75, 75]], // 4
      [[25, 25], [25, 75], [50, 50], [75, 25], [75, 75]], // 5
      [[25, 25], [25, 50], [25, 75], [75, 25], [75, 50], [75, 75]], // 6
    ];

    const dotPositions = positions[num] || [];

    return dotPositions.map((pos, idx) => (
      <div
        key={idx}
        className="dice-dot"
        style={{ left: `${pos[0]}%`, top: `${pos[1]}%` }}
      />
    ));
  };

  return (
    <div className="dice-container">
      <div className={`dice ${isRolling ? 'rolling' : ''}`}>
        {value && !isRolling ? renderDots(value) : null}
        {isRolling && <div className="dice-rolling-text">🎲</div>}
      </div>
    </div>
  );
};
