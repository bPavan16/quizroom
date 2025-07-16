import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useSocket } from '../contexts/SocketContext';

export const Welcome = () => {
    const [userName, setUserName] = useState('');
    const [roomId, setRoomId] = useState('');
    const { joinRoom, createRoom, isConnected } = useSocket();

    const handleJoinRoom = () => {
        if (userName.trim() && roomId.trim()) {
            joinRoom(roomId.trim(), userName.trim());
        }
    };

    const handleCreateRoom = () => {
        if (userName.trim()) {
            createRoom(userName.trim());
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
                                    placeholder="Enter your name"
                                    value={userName}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="room-id">Room ID</Label>
                                <Input
                                    id="room-id"
                                    placeholder="Enter room ID"
                                    value={roomId}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRoomId(e.target.value)}
                                />
                            </div>
                            <Button
                                onClick={handleJoinRoom}
                                className="w-full"
                                disabled={!userName.trim() || !roomId.trim() || !isConnected}
                            >
                                Join Quiz
                            </Button>
                        </TabsContent>

                        <TabsContent value="create" className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="create-name">Your Name</Label>
                                <Input
                                    id="create-name"
                                    placeholder="Enter your name"
                                    value={userName}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserName(e.target.value)}
                                />
                            </div>
                            <Button
                                onClick={handleCreateRoom}
                                className="w-full"
                                disabled={!userName.trim() || !isConnected}
                            >
                                Create Quiz Room
                            </Button>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};
