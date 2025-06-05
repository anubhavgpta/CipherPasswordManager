// Layout.tsx
import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import AccountDropdown from './AccountDropdown';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const { logout, isAuthenticated } = useAuth();

  const hideAccount = ['/signup', '/login', '/', '/about'].includes(location.pathname);
  const isDashboardOrPasswordManager = ['/dashboard', '/passwords', '/settings'].includes(location.pathname);
  
  // Determine redirect path for CIPHER logo
  const getCipherRedirectPath = () => {
    // If on forgot password page, redirect based on auth status
    if (location.pathname === '/forgot-password') {
      return isAuthenticated ? '/dashboard' : '/';
    }
    // For dashboard/password manager pages, always go to dashboard
    if (isDashboardOrPasswordManager) {
      return '/dashboard';
    }
    // For all other pages, go to home
    return '/';
  };

  const handleSignOut = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
  };

  return (
    <div className="min-h-screen bg-white font-helvetica relative overflow-hidden">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20 p-8">
        <div className="flex justify-between items-center">
          {/* Redirect logo based on route and auth status */}
          <Link 
            to={getCipherRedirectPath()} 
            className="block"
          >
            <img 
              src="/public/logo.png" 
              alt="CIPHER" 
              className="h-8 w-auto"
            />
          </Link>

          <div className="flex items-center space-x-4">
            {/* Show About Us only if NOT on dashboard or password-manager */}
            {!isDashboardOrPasswordManager && (
              <Link 
                to="/about" 
                className="text-gray-600 hover:text-black transition-colors duration-200"
              >
                About Us
              </Link>
            )}

            {/* Show AccountDropdown only if not hidden and authenticated */}
            {!hideAccount && isAuthenticated && <AccountDropdown />}

            {/* Show Sign Out link only on dashboard or password-manager and authenticated */}
            {isDashboardOrPasswordManager && isAuthenticated && (
              <button
                onClick={handleSignOut}
                className="text-gray-600 hover:text-black transition-colors duration-200 cursor-pointer"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Background concentric circles */}
      <div className="absolute right-0 bottom-0 w-full h-full overflow-hidden pointer-events-none z-0">
        {/* Outermost circle - largest */}
        <div className="absolute right-[-675px] bottom-[-675px] w-[1350px] h-[1350px] rounded-full opacity-90 rounded-full opacity-90" style={{backgroundColor: '#4E71FF'}}></div>
        {/* Middle circle */}
        <div className="absolute right-[-547px] bottom-[-547px] w-[1094px] h-[1094px] rounded-full opacity-80" style={{backgroundColor: '#8DD8FF'}}></div>
        {/* Innermost circle - smallest */}
        <div className="absolute right-[-339px] bottom-[-339px] w-[678px] h-[678px] rounded-full opacity-70" style={{backgroundColor: '#BBFBFF'}}></div>
      </div>

      {/* Main content */}
      <main className="relative z-10 pt-[120px]">
        {children}
      </main>
    </div>
  );
};

export default Layout;