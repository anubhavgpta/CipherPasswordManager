
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import AuthButton from '@/components/AuthButton';

const Index = () => {
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-start pl-16">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h1 className="text-6xl font-bold text-black mb-6">Welcome to</h1>
            <h2 className="text-6xl font-bold text-black mb-8">CIPHER</h2>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              A modern authentication platform designed for simplicity and security.
            </p>
          </div>

          <div className="space-y-4">
            <Link to="/login">
              <AuthButton>Sign In</AuthButton>
            </Link>
            <Link to="/signup">
              <AuthButton variant="secondary">Create Account</AuthButton>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
