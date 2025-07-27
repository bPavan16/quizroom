import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { useSocket } from '../contexts/SocketContext';
import type { AllowedSubmissions } from '../types/types';

export const Quiz = () => {
    const { roomId } = useParams<{ roomId: string }>();
    const navigate = useNavigate();
    const { quizState, submitAnswer, userId } = useSocket();
    const [selectedOption, setSelectedOption] = useState<AllowedSubmissions | null>(null);
    const [timeLeft, setTimeLeft] = useState(20);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [connectionTimeout, setConnectionTimeout] = useState(false);

    // Redirect if no roomId in URL
    useEffect(() => {
        if (!roomId) {
            navigate('/');
        }
    }, [roomId, navigate]);

    // Set a timeout to detect if room doesn't exist
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!quizState) {
                setConnectionTimeout(true);
            }
        }, 5000); // 5 second timeout

        if (quizState) {
            setConnectionTimeout(false);
            clearTimeout(timeout);
        }

        return () => clearTimeout(timeout);
    }, [quizState]);

    useEffect(() => {
        if (quizState?.type === 'question') {
            setTimeLeft(20); // Reset timer for new question
            setSelectedOption(null); // Reset selected option for new question
            setHasSubmitted(false); // Reset submission status for new question
            
            const timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        // Auto-submit if time runs out and user has selected an option
                        if (selectedOption !== null && quizState?.problem && roomId && !hasSubmitted) {
                            const currentProblem = quizState.problem;
                            submitAnswer(roomId, currentProblem.id, selectedOption);
                            setHasSubmitted(true);
                        }
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [quizState?.type, quizState?.problem?.id]); // Also depend on problem ID to reset when question changes

    const handleSubmit = () => {
        if (selectedOption !== null && quizState?.problem && roomId && !hasSubmitted) {
            const currentProblem = quizState.problem;
            submitAnswer(roomId, currentProblem.id, selectedOption);
            setHasSubmitted(true);
        }
    };

    if (!quizState) {
        if (connectionTimeout) {
            return (
                <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                    <Card className="w-full max-w-2xl">
                        <CardHeader className="text-center">
                            <CardTitle>Room Not Found</CardTitle>
                            <CardDescription>Room ID: {roomId}</CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                            <div className="space-y-4">
                                <p className="text-red-600 font-medium">
                                    ⚠️ This room doesn't exist or isn't available.
                                </p>
                                <p className="text-gray-600">
                                    Please check your room ID or ask the instructor to create the room first.
                                </p>
                                <div className="flex gap-2 justify-center">
                                    <Button
                                        onClick={() => window.location.reload()}
                                        variant="outline"
                                    >
                                        Try Again
                                    </Button>
                                    <Button
                                        onClick={() => navigate('/')}
                                    >
                                        Go Back Home
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            );
        }

        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <Card className="w-full max-w-2xl">
                    <CardHeader className="text-center">
                        <CardTitle>Connecting to Quiz...</CardTitle>
                        <CardDescription>Room ID: {roomId}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        <div className="space-y-4">
                            <div className="animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                            </div>
                            <p className="text-gray-600">
                                Connecting to room... Please wait.
                            </p>
                            <Button
                                onClick={() => navigate('/')}
                                variant="outline"
                            >
                                Go Back Home
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Handle case where quiz doesn't exist yet
    if (quizState.type === 'room_not_found') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <Card className="w-full max-w-2xl">
                    <CardHeader className="text-center">
                        <CardTitle>Room Not Found</CardTitle>
                        <CardDescription>
                            Room ID: {roomId} - This room doesn't exist yet. Ask the admin to create it first.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-gray-600 mb-4">
                            Make sure you have the correct room ID, or ask the quiz administrator to create the room.
                        </p>
                        <Button
                            onClick={() => window.location.reload()}
                            variant="outline"
                        >
                            Try Again
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (quizState.type === 'not_started') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <Card className="w-full max-w-2xl">
                    <CardHeader className="text-center">
                        <CardTitle>Waiting for Quiz to Start</CardTitle>
                        <CardDescription>Room ID: {roomId}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-gray-600">
                            Waiting for admin to start the quiz...
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (quizState.type === 'question' && quizState.problem) {
        const currentProblem = quizState.problem;
        const progress = ((20 - timeLeft) / 20) * 100;

        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
                <div className="max-w-4xl mx-auto">
                    <Card className="mb-6">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>Current Question</CardTitle>
                                <Badge variant={timeLeft > 10 ? "default" : "destructive"}>
                                    {timeLeft}s
                                </Badge>
                            </div>
                            <Progress value={progress} className="w-full" />
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">{currentProblem.title}</CardTitle>
                            <CardDescription>{currentProblem.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {hasSubmitted && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                                    <p className="text-green-700 text-center font-medium">
                                        ✓ Answer submitted! Waiting for other players...
                                    </p>
                                </div>
                            )}
                            
                            {currentProblem.options.map((option: any) => (
                                <Button
                                    key={option.id}
                                    variant={selectedOption === option.id ? "default" : "outline"}
                                    className="w-full text-left justify-start h-auto p-4"
                                    onClick={() => !hasSubmitted && setSelectedOption(option.id as AllowedSubmissions)}
                                    disabled={hasSubmitted}
                                >
                                    <span className="font-medium mr-2">{String.fromCharCode(65 + option.id)}.</span>
                                    {option.title}
                                    {hasSubmitted && selectedOption === option.id && (
                                        <span className="ml-auto text-sm">✓ Selected</span>
                                    )}
                                </Button>
                            ))}

                            <Button
                                onClick={handleSubmit}
                                disabled={selectedOption === null || timeLeft === 0 || hasSubmitted}
                                className="w-full mt-6"
                                size="lg"
                            >
                                {hasSubmitted ? 'Answer Submitted' : timeLeft === 0 ? 'Time\'s Up!' : 'Submit Answer'}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (quizState.type === 'leaderboard') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <Card className="w-full max-w-2xl">
                    <CardHeader className="text-center">
                        <CardTitle>Leaderboard</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {quizState.leaderboard
                                ?.sort((a: any, b: any) => b.points - a.points)
                                .map((user: any, index: number) => (
                                    <div
                                        key={user.id}
                                        className={`flex justify-between items-center p-3 rounded-lg ${user.id === userId ? 'bg-blue-100 border-2 border-blue-300' : 'bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <Badge variant={index < 3 ? "default" : "secondary"}>
                                                #{index + 1}
                                            </Badge>
                                            <span className="font-medium">{user.name}</span>
                                        </div>
                                        <span className="font-bold text-lg">{user.points}</span>
                                    </div>
                                ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (quizState.type === 'ended') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <Card className="w-full max-w-2xl">
                    <CardHeader className="text-center">
                        <CardTitle>Quiz Ended</CardTitle>
                        <CardDescription>Thank you for participating!</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-center mb-4">Final Results</h3>
                            {quizState.leaderboard
                                ?.sort((a: any, b: any) => b.points - a.points)
                                .map((user: any, index: number) => (
                                    <div
                                        key={user.id}
                                        className={`flex justify-between items-center p-3 rounded-lg ${user.id === userId ? 'bg-blue-100 border-2 border-blue-300' : 'bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <Badge variant={index < 3 ? "default" : "secondary"}>
                                                #{index + 1}
                                            </Badge>
                                            <span className="font-medium">{user.name}</span>
                                        </div>
                                        <span className="font-bold text-lg">{user.points}</span>
                                    </div>
                                ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Fallback for unknown state
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader className="text-center">
                    <CardTitle>Unknown State</CardTitle>
                    <CardDescription>Room ID: {roomId}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-gray-600">
                        Current state: {quizState.type || 'undefined'}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        Please contact the admin if this persists.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};
