import React from 'react';
import '../styles/HostControls.css';

interface HostControlsProps {
  onAdvanceRound: () => void;
  onResetCounter: () => void;
  disabled?: boolean;
}

export const HostControls: React.FC<HostControlsProps> = ({
  onAdvanceRound,
  onResetCounter,
  disabled = false
}) => {
  return (
    <div className="host-controls card">
      <h3 className="controls-title">Host Controls</h3>
      <div className="controls-buttons">
        <button
          className="button button-primary"
          onClick={onAdvanceRound}
          disabled={disabled}
        >
          Advance to Next Roller
        </button>
        <button
          className="button button-secondary"
          onClick={onResetCounter}
          disabled={disabled}
        >
          Reset Counter
        </button>
      </div>
    </div>
  );
};
