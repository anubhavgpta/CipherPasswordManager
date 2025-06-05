import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import AuthInput from '@/components/AuthInput';
import AuthButton from '@/components/AuthButton';
import { useAuth } from '@/AuthContext';

const ForgotPassword = () => {
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

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
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match');
      setLoading(false);
      return;
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    console.log("Forgot password data being sent:", { 
      username, 
      new_password: newPassword,
      confirm_password: confirmPassword
    });

    try {
      const response = await fetch('http://localhost:5000/api/forgot-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username,
          new_password: newPassword,
          confirm_password: confirmPassword
        }),
      });

      const data = await response.json();
      console.log('Forgot password response:', data);

      if (response.ok) {
        console.log('Password reset successfully:', data);
        setSuccess('Password reset successfully! You can now login with your new password.');
        
        // Clear form
        setUsername('');
        setNewPassword('');
        setConfirmPassword('');
        
        // Redirect based on authentication status
        setTimeout(() => {
          if (isAuthenticated) {
            navigate('/dashboard');
          } else {
            navigate('/login');
          }
        }, 3000);
      } else {
        setError(data.error || 'Failed to reset password');
      }

    } catch (error) {
      console.error('Forgot password error:', error);
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
            <h1 className="text-5xl font-bold text-black mb-4">Forgot Password</h1>
            <p className="text-gray-600 text-lg mb-8">
              Enter your username and create a new password
            </p>
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
                <br />
                <span className="text-sm">
                  Redirecting to {isAuthenticated ? 'dashboard' : 'login'} in 3 seconds...
                </span>
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
              label="New Password"
              type="password"
              placeholder="Enter your new password (min 8 characters)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <AuthInput
              label="Confirm New Password"
              type="password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <div className="space-y-4 pt-4">
              {/* Only show login/signup links when NOT authenticated */}
              {!isAuthenticated && (
                <div className="flex justify-between text-sm">
                  <Link 
                    to="/login" 
                    className="text-gray-600 hover:text-black transition-colors duration-200"
                  >
                    Back to Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className="text-gray-600 hover:text-black transition-colors duration-200"
                  >
                    Need an Account?
                  </Link>
                </div>
              )}

              <AuthButton type="submit" disabled={loading}>
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </AuthButton>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;