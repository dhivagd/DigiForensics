
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authenticateUser } from '../../utils/authentication';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Shield, LogIn, User } from 'lucide-react';
import { toast } from '../../hooks/use-toast';

const InvestigatorLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = authenticateUser(username, password);
      
      if (user && user.role === 'investigator') {
        toast({
          title: "Login Successful",
          description: "Welcome to the DigiForensics Investigator Dashboard.",
        });
        
        // Ensure the user is properly redirected
        setTimeout(() => {
          navigate('/investigator/dashboard');
        }, 100);
      } else if (user && user.role === 'admin') {
        setError('Please use the Admin login portal');
        toast({
          variant: "destructive",
          title: "Wrong Login Portal",
          description: "Please use the Admin login portal for administrative access.",
        });
      } else {
        setError('Invalid username or password');
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Please check your credentials and try again.",
        });
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <Card className="border-2 border-blue-100 shadow-lg">
          <CardHeader className="space-y-1 text-center bg-gradient-to-r from-blue-700 to-blue-900 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold flex justify-center items-center gap-2">
              <Shield className="h-6 w-6" />
              DigiForensics Investigator Access
            </CardTitle>
            <CardDescription className="text-blue-100">
              Secure Digital Evidence Management
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleLogin}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <User className="absolute left-2.5 top-2.5 h-5 w-5 text-gray-500" />
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      placeholder="Enter your username"
                      className="border-blue-200 focus:border-blue-500 pl-9"
                      autoComplete="username"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="border-blue-200 focus:border-blue-500"
                    autoComplete="current-password"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 w-full"
                  disabled={loading}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  {loading ? 'Logging in...' : 'Sign In'}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-center w-full text-sm">
              Need an investigator account?{' '}
              <a href="/register" className="text-blue-600 hover:underline">
                Register here
              </a>
            </div>
            <div className="text-center w-full text-sm">
              <a href="/admin/login" className="text-blue-600 hover:underline mr-4">
                Admin Login
              </a>
              <a href="/" className="text-gray-500 hover:underline">
                Return to Homepage
              </a>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default InvestigatorLogin;
