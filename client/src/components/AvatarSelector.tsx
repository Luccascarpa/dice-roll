import React from 'react';
import '../styles/AvatarSelector.css';

const AVATARS = [
  'bear.png',
  'cat.png',
  'chicken.png',
  'dog.png',
  'dog2.png',
  'duck.png',
  'giraffe.png',
  'gorilla.png',
  'koala.png',
  'lion.png',
  'meerkat.png',
  'owl.png',
  'panda.png',
  'penguin.png',
  'rabbit.png',
  'sea-lion.png',
  'sloth.png',
];

interface AvatarSelectorProps {
  selectedAvatar: string;
  onSelect: (avatar: string) => void;
}

export const AvatarSelector: React.FC<AvatarSelectorProps> = ({ selectedAvatar, onSelect }) => {
  return (
    <div className="avatar-selector">
      <label className="avatar-label">Escolha seu avatar:</label>
      <div className="avatar-grid">
        {AVATARS.map((avatar) => (
          <div
            key={avatar}
            className={`avatar-option ${selectedAvatar === avatar ? 'selected' : ''}`}
            onClick={() => onSelect(avatar)}
          >
            <img src={`/avatars/${avatar}`} alt={avatar.replace('.png', '')} />
          </div>
        ))}
      </div>
    </div>
  );
};
