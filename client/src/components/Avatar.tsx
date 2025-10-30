import React from 'react';

interface AvatarProps {
  src: string;
  alt: string;
  size?: number;
  borderColor?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = 40,
  borderColor = '#4A90E2'
}) => {
  return (
    <img
      src={`/avatars/${src}`}
      alt={alt}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        border: `2px solid ${borderColor}`,
        objectFit: 'cover',
        flexShrink: 0,
      }}
    />
  );
};
