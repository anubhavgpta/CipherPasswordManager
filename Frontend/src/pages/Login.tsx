import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/AuthContext';
import Layout from '@/components/Layout';
import AuthInput from '@/components/AuthInput';
import AuthButton from '@/components/AuthButton';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Get the intended destination before login
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log("Login data being sent:", { username, password });

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (response.ok) {
        console.log('Login successful:', data);

        // Store username in localStorage for later use (if needed)
        localStorage.setItem('username', username);

        // Update auth context
        login(username);

        // Navigate to intended destination or dashboard
        navigate(from, { replace: true });
      } else {
        // Handle different error cases
        if (response.status === 404) {
          setError('User not found. Please check your username or sign up.');
        } else if (response.status === 401) {
          setError('Incorrect password. Please try again.');
        } else {
          setError(data.message || data.error || 'Login failed. Please try again.');
        }
      }

    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-start pl-16">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h1 className="text-5xl font-bold text-black mb-12">Login</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <AuthInput
              label="Email"
              type="text"
              placeholder="Enter your email address"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <AuthInput
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="space-y-4 pt-4">
              <div className="flex justify-between text-sm">
                <Link 
                  to="/signup" 
                  className="text-gray-600 hover:text-black transition-colors duration-200"
                >
                  New? Sign Up
                </Link>
                <Link 
                  to="/forgot-password" 
                  className="text-gray-600 hover:text-black transition-colors duration-200"
                >
                  Forgot Password?
                </Link>
              </div>

              <AuthButton type="submit" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </AuthButton>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Login;