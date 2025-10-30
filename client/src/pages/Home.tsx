import React, { useState } from 'react';
import { AvatarSelector } from '../components/AvatarSelector';
import '../styles/Home.css';

interface HomeProps {
  onCreateSession: (nickname: string, avatar: string) => void;
  onJoinSession: (sessionId: string, nickname: string, avatar: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onCreateSession, onJoinSession }) => {
  const [nickname, setNickname] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [avatar, setAvatar] = useState('panda.png');
  const [mode, setMode] = useState<'menu' | 'create' | 'join'>('menu');

  const handleCreate = () => {
    if (nickname.trim()) {
      onCreateSession(nickname.trim(), avatar);
    }
  };

  const handleJoin = () => {
    if (nickname.trim() && sessionId.trim()) {
      onJoinSession(sessionId.trim(), nickname.trim(), avatar);
    }
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="logo-container">
          <svg className="autou-logo" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 10 L90 85 Q50 70 10 85 Z" fill="#FF8C61"/>
          </svg>
        </div>
        <h1 className="home-title">🎲 Dado Virtual</h1>
        <p className="home-subtitle">Jogue junto, veja junto</p>

        {mode === 'menu' && (
          <div className="home-menu">
            <button
              className="button button-primary home-button"
              onClick={() => setMode('create')}
            >
              Criar Sessão
            </button>
            <button
              className="button button-secondary home-button"
              onClick={() => setMode('join')}
            >
              Entrar na Sessão
            </button>
          </div>
        )}

        {mode === 'create' && (
          <div className="home-form card">
            <h2 className="form-title">Criar Sessão</h2>
            <input
              type="text"
              className="input mb-2"
              placeholder="Digite seu apelido"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={20}
              onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
            />
            <AvatarSelector selectedAvatar={avatar} onSelect={setAvatar} />
            <button
              className="button button-primary mb-2"
              onClick={handleCreate}
              disabled={!nickname.trim()}
              style={{ width: '100%' }}
            >
              Criar e Hospedar
            </button>
            <button
              className="button-link"
              onClick={() => setMode('menu')}
            >
              ← Voltar
            </button>
          </div>
        )}

        {mode === 'join' && (
          <div className="home-form card">
            <h2 className="form-title">Entrar na Sessão</h2>
            <input
              type="text"
              className="input mb-2"
              placeholder="ID da Sessão"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
            />
            <input
              type="text"
              className="input mb-2"
              placeholder="Seu apelido"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={20}
              onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
            />
            <AvatarSelector selectedAvatar={avatar} onSelect={setAvatar} />
            <button
              className="button button-primary mb-2"
              onClick={handleJoin}
              disabled={!nickname.trim() || !sessionId.trim()}
              style={{ width: '100%' }}
            >
              Entrar na Sessão
            </button>
            <button
              className="button-link"
              onClick={() => setMode('menu')}
            >
              ← Voltar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
