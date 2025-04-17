
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Shield, LogIn, User } from 'lucide-react';
import { toast } from '../../hooks/use-toast';
import { addAuditLog, saveData } from '../../utils/fileStorage';

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // For admin, we check against fixed credentials
    if (username === 'admin' && password === 'admin123') {
      // Create admin user object
      const adminUser = {
        id: 'admin-001',
        username: 'admin',
        name: 'Administrator',
        password: '', // Don't store password in session
        role: 'admin' as const
      };
      
      // Save admin user to session storage
      saveData('currentUser', adminUser);
      
      // Log successful login
      addAuditLog('login', `Admin ${username} logged in successfully`);
      
      toast({
        title: "Admin Login Successful",
        description: "Welcome to the DigiForensics Admin Dashboard.",
      });
      
      navigate('/admin/dashboard');
    } else {
      setError('Invalid admin credentials');
      
      // Log failed login attempt
      addAuditLog('login_failed', `Failed admin login attempt for username: ${username}`);
      
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Please check your credentials and try again.",
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <Card className="border-2 border-red-100 shadow-lg">
          <CardHeader className="space-y-1 text-center bg-gradient-to-r from-red-700 to-red-900 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold flex justify-center items-center gap-2">
              <Shield className="h-6 w-6" />
              DigiForensics Admin Access
            </CardTitle>
            <CardDescription className="text-red-100">
              Restricted Administrative Portal
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
                  <Label htmlFor="username">Admin Username</Label>
                  <div className="relative">
                    <User className="absolute left-2.5 top-2.5 h-5 w-5 text-gray-500" />
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      placeholder="admin"
                      className="border-red-200 focus:border-red-500 pl-9"
                      autoComplete="username"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Admin Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter admin password"
                    className="border-red-200 focus:border-red-500"
                    autoComplete="current-password"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="bg-red-600 hover:bg-red-700 w-full"
                  disabled={loading}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  {loading ? 'Authenticating...' : 'Admin Sign In'}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-center w-full text-sm">
              Not an administrator?{' '}
              <a href="/investigator/login" className="text-red-600 hover:underline">
                Go to Investigator Login
              </a>
            </div>
            <div className="text-center w-full text-sm">
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

export default AdminLogin;
