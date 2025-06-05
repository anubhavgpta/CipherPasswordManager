
import Layout from '@/components/Layout';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-bold text-black">Welcome to CIPHER</h1>
          <p className="text-xl text-gray-600 max-w-md mx-auto">
            You have successfully logged into your dashboard. This is where your journey begins.
          </p>
          <div className="pt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <Link to="/passwords" className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-semibold text-black mb-2">Passwords</h3>
                <p className="text-gray-600">Securely manage all your passwords.</p>
              </Link>
              <Link to="/settings" className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-semibold text-black mb-2">Settings</h3>
                <p className="text-gray-600">Customize your account and preferences.</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
