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
      <h3 className="controls-title">Controles do Anfitrião</h3>
      <div className="controls-buttons">
        <button
          className="button button-primary"
          onClick={onAdvanceRound}
          disabled={disabled}
        >
          Avançar para Próximo
        </button>
        <button
          className="button button-secondary"
          onClick={onResetCounter}
          disabled={disabled}
        >
          Resetar Contador
        </button>
      </div>
    </div>
  );
};
