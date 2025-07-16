import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useSocket } from '../contexts/SocketContext';
import type { AllowedSubmissions } from '../types/types';

export const Admin = () => {
    
  const { socket, isConnected } = useSocket();
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [roomId, setRoomId] = useState('');
  
  // Problem creation form
  const [problemTitle, setProblemTitle] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState<AllowedSubmissions>(0);

  const handleLogin = () => {
    if (socket && password.trim()) {
      socket.emit('joinAdmin', { password: password.trim() });
      // For demo purposes, we'll assume login is successful
      // In a real app, you'd wait for a server response
      if (password === 'ADMIN_PASSWORD') {
        setIsAuthenticated(true);
      }
    }
  };

  const handleCreateQuiz = () => {
    if (socket && roomId.trim()) {
      socket.emit('createQuiz', { roomId: roomId.trim() });
    }
  };

  const handleCreateProblem = () => {

    if (socket && roomId.trim() && problemTitle.trim() && problemDescription.trim()) {
      const problem = {
        title: problemTitle.trim(),
        description: problemDescription.trim(),
        options: options.map((option, index) => ({
          id: index,
          title: option.trim()
        })).filter(option => option.title !== ''),
        answer: correctAnswer
      };
      
      socket.emit('createProblem', { roomId: roomId.trim(), problem });
      
      // Reset form
      setProblemTitle('');
      setProblemDescription('');
      setOptions(['', '', '', '']);
      setCorrectAnswer(0);
    }
  };

  const handleNext = () => {
    if (socket && roomId.trim()) {
      socket.emit('next', { roomId: roomId.trim() });
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">Admin Login</CardTitle>
            <CardDescription>
              Enter admin password to access quiz management
            </CardDescription>
            <div className="flex items-center justify-center mt-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="ml-2 text-sm text-gray-600">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Admin Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              />
            </div>
            <Button
              onClick={handleLogin}
              className="w-full"
              disabled={!password.trim() || !isConnected}
            >
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Quiz Admin Panel</CardTitle>
            <CardDescription>Manage quizzes, problems, and control flow</CardDescription>
          </CardHeader>
        </Card>

        <Tabs defaultValue="quiz" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="quiz">Quiz Management</TabsTrigger>
            <TabsTrigger value="problems">Create Problems</TabsTrigger>
            <TabsTrigger value="control">Quiz Control</TabsTrigger>
          </TabsList>
          
          <TabsContent value="quiz" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Create Quiz</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="room-id">Room ID</Label>
                  <Input
                    id="room-id"
                    placeholder="Enter room ID"
                    value={roomId}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRoomId(e.target.value)}
                  />
                </div>
                <Button onClick={handleCreateQuiz} disabled={!roomId.trim()}>
                  Create Quiz Room
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="problems" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Create Problem</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="problem-title">Problem Title</Label>
                  <Input
                    id="problem-title"
                    placeholder="Enter problem title"
                    value={problemTitle}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProblemTitle(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="problem-description">Problem Description</Label>
                  <Input
                    id="problem-description"
                    placeholder="Enter problem description"
                    value={problemDescription}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProblemDescription(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Options</Label>
                  {options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="w-8 text-sm font-medium">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <Input
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateOption(index, e.target.value)}
                      />
                      <Button
                        variant={correctAnswer === index ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCorrectAnswer(index as AllowedSubmissions)}
                      >
                        Correct
                      </Button>
                    </div>
                  ))}
                </div>

                <Button 
                  onClick={handleCreateProblem} 
                  disabled={!roomId.trim() || !problemTitle.trim() || !problemDescription.trim()}
                  className="w-full"
                >
                  Add Problem to Quiz
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="control" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Quiz Control</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={handleNext} 
                  disabled={!roomId.trim()}
                  size="lg"
                  className="w-full"
                >
                  Next Question / Start Quiz
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
