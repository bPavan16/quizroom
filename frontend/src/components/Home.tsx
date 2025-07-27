import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useSocket } from '../contexts/SocketContext';

export const Home = () => {
    const [userName, setUserName] = useState('');
    const [roomId, setRoomId] = useState('');
    const { joinRoom, isConnected } = useSocket();
    const navigate = useNavigate();

    const handleJoinRoom = () => {
        if (userName.trim() && roomId.trim()) {
            joinRoom(roomId.trim(), userName.trim());
            navigate(`/quiz/${roomId.trim()}`);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-gray-800">Quiz App</CardTitle>
                    <CardDescription>
                        Join an existing quiz or create a new one
                    </CardDescription>
                    <div className="flex items-center justify-center mt-2">
                        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className="ml-2 text-sm text-gray-600">
                            {isConnected ? 'Connected' : 'Disconnected'}
                        </span>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="join" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="join">Join Quiz</TabsTrigger>
                            <TabsTrigger value="create">Create Quiz</TabsTrigger>
                        </TabsList>

                        <TabsContent value="join" className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="join-name">Your Name</Label>
                                <Input
                                    id="join-name"
                                    placeholder="Enter your display name"
                                    value={userName}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="room-id">Room ID</Label>
                                <Input
                                    id="room-id"
                                    placeholder="Ask your instructor for the room ID"
                                    value={roomId}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRoomId(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && userName.trim() && roomId.trim() && handleJoinRoom()}
                                />
                            </div>
                            <Button
                                onClick={handleJoinRoom}
                                className="w-full"
                                disabled={!userName.trim() || !roomId.trim() || !isConnected}
                            >
                                {!isConnected ? 'Connecting...' : 'Join Quiz'}
                            </Button>
                        </TabsContent>

                        <TabsContent value="create" className="space-y-4">
                            <div className="space-y-2 flex flex-col items-center p-10">
                                <div className="text-center space-y-4">
                                    <h3 className="font-semibold text-lg">Create Your Own Quiz</h3>
                                    <p className="text-gray-600 text-sm">
                                        To create and manage quizzes, switch to Admin Mode using the button in the top-right corner.
                                    </p>
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <p className="text-blue-800 text-sm">
                                            <strong>Admin Features:</strong>
                                            <br />• Create quiz rooms
                                            <br />• Add questions and answers
                                            <br />• Control quiz flow
                                            <br />• Monitor live results
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};
