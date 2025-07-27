import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { SocketProvider, useSocket } from './contexts/SocketContext';
import { Home } from './components/Home';
import { Quiz } from './components/Quiz';
import { Admin } from './components/Admin';
import { NotFound } from './components/NotFound';
import { Button } from './components/ui/button';
import './App.css';

function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { leaveRoom } = useSocket();

  const isAdminRoute = location.pathname === '/admin';
  const isQuizRoute = location.pathname.startsWith('/quiz');

  const handleGoHome = () => {
    if (isQuizRoute) {
      leaveRoom();
    }
    navigate('/');
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2">
      {!isAdminRoute && (
        <Button 
          variant="outline" 
          onClick={() => navigate('/admin')}
        >
          Admin Mode
        </Button>
      )}
      
      {isAdminRoute && (
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
        >
          Switch to User Mode
        </Button>
      )}
      
      {(isQuizRoute || isAdminRoute) && (
        <Button 
          variant="outline" 
          onClick={handleGoHome}
        >
          Home
        </Button>
      )}
    </div>
  );
}

function AppContent() {
  const { userId, currentRoomId } = useSocket();

  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route 
          path="/quiz/:roomId" 
          element={
            userId && currentRoomId ? (
              <Quiz />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <SocketProvider>
      <Router>
        <AppContent />
      </Router>
    </SocketProvider>
  );
}

export default App;
