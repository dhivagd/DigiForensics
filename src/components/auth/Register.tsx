
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerInvestigator } from '../../utils/authentication';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Shield, UserPlus } from 'lucide-react';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
    email: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...userData } = formData;
      registerInvestigator(userData);
      
      // Registration successful, navigate to login
      navigate('/login', { state: { message: 'Registration successful! You can now login.' } });
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 py-8">
      <div className="w-full max-w-md">
        <Card className="border-2 border-blue-100 shadow-lg">
          <CardHeader className="space-y-1 text-center bg-gradient-to-r from-blue-700 to-blue-900 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold flex justify-center items-center gap-2">
              <Shield className="h-6 w-6" />
              Investigator Registration
            </CardTitle>
            <CardDescription className="text-blue-100">
              Create your DigiForensics investigator account
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleRegister}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    placeholder="Choose a username"
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Create a password"
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Confirm your password"
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 w-full"
                  disabled={loading}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  {loading ? 'Registering...' : 'Register as Investigator'}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <div className="text-center w-full text-sm">
              Already have an account?{' '}
              <a href="/login" className="text-blue-600 hover:underline">
                Sign in here
              </a>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
