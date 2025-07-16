import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import type { QuizState, User, Problem, AllowedSubmissions } from '../types/types';

interface SocketContextType {
  socket: Socket | null;
  quizState: any | null;
  user: User | null;
  userId: string | null;
  currentRoomId: string | null;
  isConnected: boolean;
  joinRoom: (roomId: string, userName: string) => void;
  submitAnswer: (roomId: string, problemId: string, optionSelected: AllowedSubmissions) => void;
  createRoom: (userName: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [quizState, setQuizState] = useState<any | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    // Listen for initial state when joining
    newSocket.on('init', (data) => {
      if (data.userId && data.state !== null) {
        setUserId(data.userId);
        setQuizState(data.state);
      } else {
        // Room doesn't exist or couldn't join
        setQuizState({ type: 'room_not_found' });
      }
    });

    // Listen for problem updates
    newSocket.on('problem', (data) => {
      setQuizState({
        type: 'question',
        problem: data.problem
      });
    });

    // Listen for leaderboard updates
    newSocket.on('leaderboard', (data) => {
      setQuizState({
        type: 'leaderboard',
        leaderboard: data.leaderboard
      });
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const joinRoom = (roomId: string, userName: string) => {
    if (socket) {
      socket.emit('join', { roomId, name: userName });
      setCurrentRoomId(roomId);
    }
  };

  const createRoom = (userName: string) => {
    // Generate a random room ID for the user
    const roomId = Math.random().toString(36).substring(2, 15);
    if (socket) {
      socket.emit('join', { roomId, name: userName });
      setCurrentRoomId(roomId);
    }
  };

  const submitAnswer = (roomId: string, problemId: string, optionSelected: AllowedSubmissions) => {
    if (socket && userId) {
      socket.emit('submit', {
        roomId,
        problemId,
        userId,
        submission: optionSelected,
      });
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        quizState,
        user,
        userId,
        currentRoomId,
        isConnected,
        joinRoom,
        submitAnswer,
        createRoom,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
