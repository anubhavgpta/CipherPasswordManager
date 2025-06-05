import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';

const Settings = () => {
  const [userEmail, setUserEmail] = useState<string>('');

  // Fetch user email from localStorage
  useEffect(() => {
    const email = localStorage.getItem('user_email');
    if (email) {
      setUserEmail(email);
    } else {
      // Fallback to check for username key
      const username = localStorage.getItem('username');
      if (username) setUserEmail(username);
    }
  }, []);

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your saved passwords.'
    );

    if (!confirmDelete) return;

    try {
      // You'll need to implement this endpoint in your backend
      const response = await fetch('http://localhost:5000/api/delete-account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: userEmail })
      });

      if (response.ok) {
        alert('Account deleted successfully');
        // Clear localStorage and redirect to login
        localStorage.removeItem('user_email');
        localStorage.removeItem('username');
        // Redirect to login page - adjust the path as needed
        window.location.href = '/login';
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete account');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account. Please try again.');
    }
  };

  const handleChangePassword = () => {
    // Redirect to forgot password page
    window.location.href = '/forgot-password';
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-bold text-black">Account Settings</h1>
          <div className="pt-8">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 max-w-md mx-auto">
              <div className="space-y-6">
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-black mb-2">Email</h3>
                  <p className="text-gray-600 bg-gray-300 p-3 rounded-lg">
                    {userEmail || 'No email found'}
                  </p>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={handleChangePassword}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 mb-4"
                  >
                    Change Password
                  </button>
                  
                  <button
                    onClick={handleDeleteAccount}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                  >
                    Delete Account
                  </button>
                  <p className="text-sm text-gray-500 mt-2">
                    This action cannot be undone
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;