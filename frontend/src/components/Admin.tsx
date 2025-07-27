import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { useSocket } from '../contexts/SocketContext';
import type { AllowedSubmissions } from '../types/types';

export const Admin = () => {
    
  const { socket, isConnected } = useSocket();
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [currentQuizState, setCurrentQuizState] = useState<any>(null);
  const [activeQuizzes, setActiveQuizzes] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  
  // Problem creation form
  const [problemTitle, setProblemTitle] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState<AllowedSubmissions>(0);

  // Listen for authentication events (always active)
  useEffect(() => {
    if (socket) {
      socket.on('adminAuth', (data) => {
        if (data.success) {
          setIsAuthenticated(true);
          setError('');
        } else {
          setError('Invalid admin password');
          setIsAuthenticated(false);
        }
      });

      return () => {
        socket.off('adminAuth');
      };
    }
  }, [socket]);

  // Listen for admin events (only when authenticated)
  useEffect(() => {
    if (socket && isAuthenticated) {
      socket.on('quizCreated', (data) => {
        setSuccess(`Quiz room "${data.roomId}" created successfully!`);
        setActiveQuizzes(prev => [...prev, data.roomId]);
        setTimeout(() => setSuccess(''), 3000);
      });

      socket.on('problemAdded', () => {
        setSuccess('Problem added successfully!');
        setProblemTitle('');
        setProblemDescription('');
        setOptions(['', '', '', '']);
        setCorrectAnswer(0);
        setTimeout(() => setSuccess(''), 3000);
      });

      socket.on('quizStateUpdate', (data) => {
        setCurrentQuizState(data);
      });

      socket.on('error', (data) => {
        setError(data.message);
        setTimeout(() => setError(''), 5000);
      });

      return () => {
        socket.off('quizCreated');
        socket.off('problemAdded');
        socket.off('quizStateUpdate');
        socket.off('error');
      };
    }
  }, [socket, isAuthenticated]);  const handleLogin = () => {
    if (socket && password.trim()) {
      console.log('Attempting admin login with password:', password.trim());
      socket.emit('joinAdmin', { password: password.trim() });
      setError('');
      setSuccess('Authenticating...');
    } else if (!socket) {
      setError('Not connected to server');
    } else {
      setError('Please enter a password');
    }
  };

  const handleCreateQuiz = () => {
    if (socket && roomId.trim()) {
      socket.emit('createQuiz', { roomId: roomId.trim() });
      setError('');
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
      
      if (problem.options.length < 2) {
        setError('Please provide at least 2 options');
        return;
      }

      socket.emit('createProblem', { roomId: roomId.trim(), problem });
      setError('');
    }
  };

  const handleNext = () => {
    if (socket && roomId.trim()) {
      socket.emit('next', { roomId: roomId.trim() });
      setError('');
    }
  };

  const handleStartQuiz = () => {
    if (socket && roomId.trim()) {
      socket.emit('start', { roomId: roomId.trim() });
      setError('');
    }
  };

  const handleGetQuizState = () => {
    if (socket && roomId.trim()) {
      socket.emit('getQuizState', { roomId: roomId.trim() });
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
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="password">Admin Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
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
      <div className="max-w-6xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Quiz Admin Panel
              <Badge variant={isConnected ? "default" : "destructive"}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </Badge>
            </CardTitle>
            <CardDescription>Manage quizzes, problems, and control flow</CardDescription>
          </CardHeader>
        </Card>

        {error && (
          <Alert className="mb-4 border-red-200 bg-red-50">
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 border-green-200 bg-green-50">
            <AlertDescription className="text-green-700">{success}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="quiz" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="quiz">Quiz Management</TabsTrigger>
            <TabsTrigger value="problems">Create Problems</TabsTrigger>
            <TabsTrigger value="control">Quiz Control</TabsTrigger>
            <TabsTrigger value="monitor">Live Monitor</TabsTrigger>
          </TabsList>
          
          <TabsContent value="quiz" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Quiz</CardTitle>
                  <CardDescription>Set up a new quiz room</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="room-id">Room ID</Label>
                    <Input
                      id="room-id"
                      placeholder="Enter unique room ID (e.g., quiz-001)"
                      value={roomId}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRoomId(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={handleCreateQuiz} 
                    disabled={!roomId.trim()}
                    className="w-full"
                  >
                    Create Quiz Room
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Active Quizzes</CardTitle>
                  <CardDescription>Manage existing quiz rooms</CardDescription>
                </CardHeader>
                <CardContent>
                  {activeQuizzes.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No active quizzes</p>
                  ) : (
                    <div className="space-y-2">
                      {activeQuizzes.map((quiz) => (
                        <div key={quiz} className="flex items-center justify-between p-2 border rounded">
                          <span className="font-medium">{quiz}</span>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setRoomId(quiz)}
                          >
                            Select
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="problems" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Create Problem</CardTitle>
                <CardDescription>
                  {roomId ? `Adding to room: ${roomId}` : 'Select a room ID first'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!roomId && (
                  <Alert className="border-yellow-200 bg-yellow-50">
                    <AlertDescription className="text-yellow-700">
                      Please select or create a room first in the Quiz Management tab
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="problem-title">Problem Title</Label>
                  <Input
                    id="problem-title"
                    placeholder="Enter a clear, concise question title"
                    value={problemTitle}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProblemTitle(e.target.value)}
                    disabled={!roomId}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="problem-description">Problem Description</Label>
                  <Input
                    id="problem-description"
                    placeholder="Enter detailed question description"
                    value={problemDescription}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProblemDescription(e.target.value)}
                    disabled={!roomId}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Answer Options</Label>
                  {options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="w-8 text-sm font-medium">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <Input
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateOption(index, e.target.value)}
                        disabled={!roomId}
                      />
                      <Button
                        variant={correctAnswer === index ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCorrectAnswer(index as AllowedSubmissions)}
                        disabled={!roomId}
                      >
                        {correctAnswer === index ? '✓ Correct' : 'Mark Correct'}
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handleCreateProblem} 
                    disabled={!roomId.trim() || !problemTitle.trim() || !problemDescription.trim() || options.filter(o => o.trim()).length < 2}
                    className="flex-1"
                  >
                    Add Problem to Quiz
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="control" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Quiz Controls</CardTitle>
                  <CardDescription>
                    {roomId ? `Controlling room: ${roomId}` : 'Select a room to control'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!roomId && (
                    <Alert className="border-yellow-200 bg-yellow-50">
                      <AlertDescription className="text-yellow-700">
                        Please select a room first
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      onClick={handleStartQuiz} 
                      disabled={!roomId.trim()}
                      size="lg"
                      className="w-full"
                    >
                      Start Quiz
                    </Button>
                    
                    <Button 
                      onClick={handleNext} 
                      disabled={!roomId.trim()}
                      size="lg"
                      variant="outline"
                      className="w-full"
                    >
                      Next Question
                    </Button>
                  </div>
                  
                  <Button 
                    onClick={handleGetQuizState} 
                    disabled={!roomId.trim()}
                    variant="secondary"
                    className="w-full"
                  >
                    Refresh Quiz State
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Current Quiz State</CardTitle>
                </CardHeader>
                <CardContent>
                  {currentQuizState ? (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Status:</span>
                        <Badge variant={currentQuizState.type === 'question' ? 'default' : 'secondary'}>
                          {currentQuizState.type || 'Unknown'}
                        </Badge>
                      </div>
                      {currentQuizState.problem && (
                        <>
                          <div className="flex justify-between">
                            <span className="font-medium">Current Problem:</span>
                            <span>{currentQuizState.problem.title}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Options:</span>
                            <span>{currentQuizState.problem.options?.length || 0}</span>
                          </div>
                        </>
                      )}
                      {currentQuizState.leaderboard && (
                        <div className="flex justify-between">
                          <span className="font-medium">Players:</span>
                          <span>{currentQuizState.leaderboard.length}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No quiz state available</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="monitor" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Live Quiz Monitor</CardTitle>
                <CardDescription>
                  Real-time monitoring of quiz activity
                  {roomId && ` for room: ${roomId}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!roomId ? (
                  <Alert className="border-yellow-200 bg-yellow-50">
                    <AlertDescription className="text-yellow-700">
                      Please select a room to monitor
                    </AlertDescription>
                  </Alert>
                ) : currentQuizState ? (
                  <div className="space-y-4">
                    {currentQuizState.type === 'question' && currentQuizState.problem && (
                      <div className="border rounded p-4 bg-blue-50">
                        <h3 className="font-semibold text-lg mb-2">Active Question</h3>
                        <p className="font-medium">{currentQuizState.problem.title}</p>
                        <p className="text-gray-600 mb-3">{currentQuizState.problem.description}</p>
                        <div className="grid grid-cols-2 gap-2">
                          {currentQuizState.problem.options?.map((option: any, index: number) => (
                            <div key={index} className="flex items-center p-2 border rounded">
                              <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                              <span>{option.title}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 text-sm text-gray-600">
                          Correct Answer: {String.fromCharCode(65 + (currentQuizState.problem.answer || 0))}
                        </div>
                      </div>
                    )}

                    {currentQuizState.type === 'leaderboard' && currentQuizState.leaderboard && (
                      <div className="border rounded p-4 bg-green-50">
                        <h3 className="font-semibold text-lg mb-3">Current Leaderboard</h3>
                        <div className="space-y-2">
                          {currentQuizState.leaderboard
                            .sort((a: any, b: any) => b.points - a.points)
                            .map((player: any, index: number) => (
                            <div key={player.id} className="flex items-center justify-between p-2 border rounded bg-white">
                              <div className="flex items-center">
                                <Badge variant={index < 3 ? 'default' : 'secondary'} className="mr-2">
                                  #{index + 1}
                                </Badge>
                                <span className="font-medium">{player.name}</span>
                              </div>
                              <span className="font-bold">{player.points} pts</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {currentQuizState.type === 'not_started' && (
                      <div className="border rounded p-4 bg-gray-50 text-center">
                        <p className="text-gray-600">Quiz hasn't started yet</p>
                        <Button onClick={handleStartQuiz} className="mt-2">
                          Start Quiz
                        </Button>
                      </div>
                    )}

                    {currentQuizState.type === 'ended' && (
                      <div className="border rounded p-4 bg-red-50 text-center">
                        <p className="text-red-600 font-medium">Quiz has ended</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    Click "Refresh Quiz State" to load current status
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
