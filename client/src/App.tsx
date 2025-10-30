import { useState, useEffect } from 'react';
import { useSocket } from './hooks/useSocket';
import { Home } from './pages/Home';
import { Session } from './pages/Session';

function App() {
  const { socket, isConnected } = useSocket();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [mySocketId, setMySocketId] = useState<string>('');

  useEffect(() => {
    if (!socket) return;

    socket.on('session-created', (id: string) => {
      setSessionId(id);
    });

    socket.on('session-joined', (id: string) => {
      setSessionId(id);
    });

    socket.on('connect', () => {
      setMySocketId(socket.id || '');
    });

    socket.on('error', (message: string) => {
      alert(message);
    });

    return () => {
      socket.off('session-created');
      socket.off('session-joined');
      socket.off('error');
    };
  }, [socket]);

  const handleCreateSession = (nickname: string, avatar: string) => {
    if (socket) {
      socket.emit('create-session', { nickname, avatar });
    }
  };

  const handleJoinSession = (sessionId: string, nickname: string, avatar: string) => {
    if (socket) {
      socket.emit('join-session', { sessionId, nickname, avatar });
    }
  };

  if (!isConnected) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        fontSize: '1.5rem',
        color: '#718096'
      }}>
        Conectando ao servidor...
      </div>
    );
  }

  if (!sessionId || !socket) {
    return (
      <Home
        onCreateSession={handleCreateSession}
        onJoinSession={handleJoinSession}
      />
    );
  }

  return (
    <Session
      socket={socket}
      sessionId={sessionId}
      mySocketId={mySocketId}
    />
  );
}

export default App;
