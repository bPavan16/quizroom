import { useState } from 'react';
import { SocketProvider, useSocket } from './contexts/SocketContext';
import { Home } from './components/Home';
import { Quiz } from './components/Quiz';
import { Admin } from './components/Admin';
import { Button } from './components/ui/button';
import './App.css';

function AppContent() {
  const { userId, currentRoomId } = useSocket();
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Admin mode to crreate quizzes and problems
  if (isAdminMode) {
    return (
      <div>
        <div className="fixed top-4 right-4 z-50">
          <Button 
            variant="outline" 
            onClick={() => setIsAdminMode(false)}
          >
            Switch to User Mode
          </Button>
        </div>
        <Admin />
      </div>
    );
  }

  // Show quiz interface if user has joined
  if (userId && currentRoomId) {
    return (
      <div>
        <div className="fixed top-4 right-4 z-50">
          <Button 
            variant="outline" 
            onClick={() => setIsAdminMode(true)}
          >
            Admin Mode
          </Button>
        </div>
        <Quiz roomId={currentRoomId} />
      </div>
    );
  }

  // Show Home screen
  return (
    <div>
      <div className="fixed top-4 right-4 z-50">
        <Button 
          variant="outline" 
          onClick={() => setIsAdminMode(true)}
        >
          Admin Mode
        </Button>
      </div>
      <Home />
    </div>
  );
}

function App() {
  return (
    <SocketProvider>
      <AppContent />
    </SocketProvider>
  );
}

export default App;
