import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

export const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <CardTitle className="text-4xl font-bold text-gray-800">404</CardTitle>
                    <CardDescription className="text-lg">
                        Page Not Found
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-gray-600">
                        The page you're looking for doesn't exist.
                    </p>
                    <Button 
                        onClick={() => navigate('/')}
                        className="w-full"
                    >
                        Go Back Home
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};
