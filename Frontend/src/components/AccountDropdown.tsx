
import { User } from 'lucide-react';
import { Link } from 'react-router-dom';

const AccountDropdown = () => {
  return (
    <Link to="/settings">
      <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
        <User className="w-6 h-6 text-white" />
      </div>
    </Link>
  );
};

export default AccountDropdown;
