import React, { useState } from 'react';
import '../styles/Home.css';

interface HomeProps {
  onCreateSession: (nickname: string) => void;
  onJoinSession: (sessionId: string, nickname: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onCreateSession, onJoinSession }) => {
  const [nickname, setNickname] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [mode, setMode] = useState<'menu' | 'create' | 'join'>('menu');

  const handleCreate = () => {
    if (nickname.trim()) {
      onCreateSession(nickname.trim());
    }
  };

  const handleJoin = () => {
    if (nickname.trim() && sessionId.trim()) {
      onJoinSession(sessionId.trim(), nickname.trim());
    }
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">🎲 Virtual Dice</h1>
        <p className="home-subtitle">Roll together, see together</p>

        {mode === 'menu' && (
          <div className="home-menu">
            <button
              className="button button-primary home-button"
              onClick={() => setMode('create')}
            >
              Create Session
            </button>
            <button
              className="button button-secondary home-button"
              onClick={() => setMode('join')}
            >
              Join Session
            </button>
          </div>
        )}

        {mode === 'create' && (
          <div className="home-form card">
            <h2 className="form-title">Create Session</h2>
            <input
              type="text"
              className="input mb-3"
              placeholder="Enter your nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={20}
              onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
            />
            <button
              className="button button-primary mb-2"
              onClick={handleCreate}
              disabled={!nickname.trim()}
              style={{ width: '100%' }}
            >
              Create & Host
            </button>
            <button
              className="button-link"
              onClick={() => setMode('menu')}
            >
              ← Back
            </button>
          </div>
        )}

        {mode === 'join' && (
          <div className="home-form card">
            <h2 className="form-title">Join Session</h2>
            <input
              type="text"
              className="input mb-2"
              placeholder="Session ID"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
            />
            <input
              type="text"
              className="input mb-3"
              placeholder="Your nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={20}
              onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
            />
            <button
              className="button button-primary mb-2"
              onClick={handleJoin}
              disabled={!nickname.trim() || !sessionId.trim()}
              style={{ width: '100%' }}
            >
              Join Session
            </button>
            <button
              className="button-link"
              onClick={() => setMode('menu')}
            >
              ← Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
