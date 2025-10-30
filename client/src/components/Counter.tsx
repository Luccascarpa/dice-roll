import React from 'react';
import '../styles/Counter.css';

interface CounterProps {
  count: number;
}

export const Counter: React.FC<CounterProps> = ({ count }) => {
  return (
    <div className="counter-container">
      <div className="counter-label">Total de Lançamentos</div>
      <div className="counter-value">{count}</div>
    </div>
  );
};
