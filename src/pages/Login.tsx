
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to investigator login by default
    navigate('/investigator/login');
  }, [navigate]);

  // This won't really render as we're redirecting immediately
  return <div>Redirecting to login page...</div>;
};

export default Login;
