import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import AuthInput from '@/components/AuthInput';
import AuthButton from '@/components/AuthButton';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Client-side validation
    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      setLoading(false);
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    if (!username.trim()) {
      setError('Username is required');
      setLoading(false);
      return;
    }

    console.log("Signup data being sent:", { username, password });

    try {
      const response = await fetch('http://127.0.0.1:5000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = await response.json();
      console.log('Signup response:', data);

      if (response.ok) {
        console.log('Account created successfully:', data);
        setSuccess('Account created successfully! Redirecting to login...');
        
        // Clear form
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        // Handle different error cases
        if (response.status === 409) {
          setError('Username already exists. Please choose a different username.');
        } else if (response.status === 400) {
          setError(data.error || 'Please fill in all required fields.');
        } else {
          setError(data.error || 'Signup failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-start pl-16">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h1 className="text-5xl font-bold text-black mb-12">Sign Up</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                {success}
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
              placeholder="Enter your password (min 8 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <AuthInput
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <div className="space-y-4 pt-4">
              <div className="flex justify-between text-sm">
                <Link 
                  to="/login" 
                  className="text-gray-600 hover:text-black transition-colors duration-200"
                >
                  Already have an account? Login
                </Link>
                <Link 
                  to="/forgot-password" 
                  className="text-gray-600 hover:text-black transition-colors duration-200"
                >
                  Forgot Password?
                </Link>
              </div>

              <AuthButton type="submit" disabled={loading}>
                {loading ? 'Creating Account...' : 'Sign Up'}
              </AuthButton>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default SignUp;