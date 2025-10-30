# 🎲 Virtual Dice

A real-time multiplayer dice rolling application built for organizational games and activities. Perfect for team building, training sessions, and interactive games with up to 40 participants.

## Features

- **Real-time Synchronization**: Everyone sees the same dice roll results instantly
- **Session Management**: Create or join sessions with simple session codes
- **Queue System**: Organized turn-based rolling with clear visual queue
- **Host Controls**: Session creator can advance rounds and reset counters
- **Roll Counter**: Track total number of rolls in the session
- **Last Roll Display**: Shows the last rolled number and who rolled it
- **Responsive Design**: Works on desktop and mobile devices
- **AutoU Branding**: Matches your organizational visual identity

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express + Socket.io
- **Real-time**: WebSocket communication
- **Styling**: Custom CSS with Montserrat font

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone or navigate to the project directory**

```bash
cd DadoVirtual
```

2. **Install server dependencies**

```bash
cd server
npm install
```

3. **Install client dependencies**

```bash
cd ../client
npm install
```

### Running the Application

You need to run both the server and client:

**Terminal 1 - Start the Server:**

```bash
cd server
npm run dev
```

The server will start on `http://localhost:3001`

**Terminal 2 - Start the Client:**

```bash
cd client
npm run dev
```

The client will start on `http://localhost:3000`

### Building for Production

**Build the server:**

```bash
cd server
npm run build
npm start
```

**Build the client:**

```bash
cd client
npm run build
npm run preview
```

## How to Use

### For Hosts (Session Creators)

1. Open the application at `http://localhost:3000`
2. Click **"Create Session"**
3. Enter your nickname
4. Share the **Session ID** with participants
5. Wait for participants to join
6. Use **Host Controls** to:
   - Advance to the next roller after each turn
   - Reset the counter when starting a new game

### For Participants

1. Open the application at `http://localhost:3000`
2. Click **"Join Session"**
3. Enter the **Session ID** provided by the host
4. Enter your nickname
5. Wait for your turn in the queue
6. Click **"Roll Dice"** when it's your turn

## Features in Detail

### Session Management
- Unique 6-character session codes
- Support for up to 40 participants
- Automatic session cleanup after 24 hours of inactivity

### Dice Rolling
- Animated dice roll with realistic physics
- Values from 1 to 6
- Real-time synchronization across all participants
- Visual feedback during rolling

### Queue System
- Shows current roller
- Displays last roller
- Lists next 5 rollers in queue
- Circular queue (automatically cycles back to start)

### Host Controls
- **Advance Round**: Move to the next person in the queue
- **Reset Counter**: Set roll count back to 0

### Visual Design
- **Colors**: Blue (primary), Orange (accents), Purple (gradients)
- **Font**: Montserrat (300, 400, 500, 600, 700 weights)
- Clean, modern interface with smooth animations

## Project Structure

```
DadoVirtual/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Dice, Counter, Queue, etc.
│   │   ├── pages/         # Home, Session
│   │   ├── hooks/         # useSocket
│   │   ├── styles/        # CSS files
│   │   ├── types/         # TypeScript types
│   │   ├── App.tsx        # Main app component
│   │   └── main.tsx       # Entry point
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
├── server/                # Node.js backend
│   ├── src/
│   │   ├── server.ts      # Express + Socket.io server
│   │   ├── SessionManager.ts  # Session logic
│   │   └── types.ts       # TypeScript types
│   ├── tsconfig.json
│   └── package.json
│
└── README.md
```

## Customization

### Change Colors

Edit the CSS variables in [client/src/styles/index.css](client/src/styles/index.css):

```css
:root {
  --primary-blue: #4A90E2;
  --accent-orange: #FF8C61;
  --accent-purple: #A78BFA;
  /* ... */
}
```

### Change Port Numbers

- **Server**: Edit `PORT` in [server/src/server.ts](server/src/server.ts#L126)
- **Client**: Edit `server.port` in [client/vite.config.ts](client/vite.config.ts#L7)

### Adjust Participant Limit

The application supports up to 40 participants by default. No code changes needed, but you can monitor server performance if you need more.

## Troubleshooting

### "Cannot connect to server"

- Make sure the server is running on port 3001
- Check if the CORS settings in [server/src/server.ts](server/src/server.ts) match your client URL

### "Session not found"

- Session IDs are case-sensitive
- Sessions are deleted after 24 hours or when all participants leave

### Dice not rolling

- Make sure it's your turn (check the queue)
- Refresh the page if the connection was lost

## Development

### Running Tests

Tests are not included in the initial version. To add tests:

- Frontend: Jest + React Testing Library
- Backend: Jest + Supertest

### Code Style

- TypeScript strict mode enabled
- ESLint and Prettier recommended

## License

This project is for internal use within the organization.

## Support

For issues or questions, contact your internal development team.

---

**Built with ❤️ for AutoU**
