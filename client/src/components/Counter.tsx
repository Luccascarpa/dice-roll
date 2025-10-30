import React from 'react';
import '../styles/Counter.css';

interface CounterProps {
  totalCount: number;
  personalCount: number;
}

export const Counter: React.FC<CounterProps> = ({ totalCount, personalCount }) => {
  return (
    <div className="counters-container">
      <div className="counter-box total">
        <div className="counter-label">Total de Lançamentos</div>
        <div className="counter-value">{totalCount}</div>
      </div>
      <div className="counter-box personal">
        <div className="counter-label">Meus Lançamentos</div>
        <div className="counter-value">{personalCount}</div>
      </div>
    </div>
  );
};
