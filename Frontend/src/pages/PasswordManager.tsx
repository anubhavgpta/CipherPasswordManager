import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Layout from '@/components/Layout';
import AuthButton from '@/components/AuthButton';
import { Search } from "lucide-react"; // <-- Importing the search icon

interface Password {
  id: number;
  site: string;
  username: string;
  password: string;
}

const getFaviconUrl = (site: string): string => {
  try {
    const url = new URL(site.startsWith('http') ? site : `https://${site}`);
    return `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=64`;
  } catch {
    return '';
  }
};

const PasswordManager = () => {
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newWebsite, setNewWebsite] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [visiblePasswords, setVisiblePasswords] = useState<Set<number>>(new Set());
  const [userEmail, setUserEmail] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>(''); // <-- Added search query state

  useEffect(() => {
    const email = localStorage.getItem('user_email');
    if (email) setUserEmail(email);
    if (!email) {
      const username = localStorage.getItem('username');
      if (username) setUserEmail(username);
    }
  }, []);

  const fetchPasswords = async () => {
    if (!userEmail) return;

    try {
      const res = await fetch(`http://localhost:5000/api/get?username=${encodeURIComponent(userEmail)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      setPasswords(data);
    } catch (err) {
      console.error('Error fetching passwords:', err);
    }
  };

  useEffect(() => {
    if (userEmail) {
      fetchPasswords();
    }
  }, [userEmail]);

  const handleAddPassword = async () => {
    if (!newWebsite || !newUsername || !newPassword || !userEmail) {
      alert(`Please fill in all fields. Missing: ${[
        !newWebsite && 'Website',
        !newUsername && 'Username',
        !newPassword && 'Password',
        !userEmail && 'User Email'
      ].filter(Boolean).join(', ')}`);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          site: newWebsite,
          username: newUsername,
          password: newPassword,
          owner_username: userEmail
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Failed to save password');
        return;
      }

      await fetchPasswords();
      setNewWebsite('');
      setNewUsername('');
      setNewPassword('');
      setIsDialogOpen(false);
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to save password');
    }
  };

  const togglePasswordVisibility = (id: number) => {
    const updated = new Set(visiblePasswords);
    updated.has(id) ? updated.delete(id) : updated.add(id);
    setVisiblePasswords(updated);
  };

  const handleDeletePassword = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/delete/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        await fetchPasswords();
      } else {
        console.error('Failed to delete password');
      }
    } catch (error) {
      console.error('Error deleting password:', error);
    }
  };

  const filteredPasswords = passwords.filter((item) =>
    item.site.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="min-h-screen py-16 px-8 md:px-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-5xl font-bold text-black">Passwords</h1>
            <AuthButton
              onClick={() => setIsDialogOpen(true)}
              className="bg-black hover:bg-gray-800 text-white font-semibold"
            >
              + Add Password
            </AuthButton>
          </div>

          {/* Search Bar with Icon */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <Input type="text" placeholder="Search" value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 rounded-3xl bg-gray-200 border-0 py-4 text-base w-full"/>
          </div>

          <div className="space-y-4">
            {filteredPasswords.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex justify-between items-center hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={getFaviconUrl(item.site)}
                    alt="favicon"
                    className="w-6 h-6"
                    onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
                  />
                  <div>
                    <span className="text-xl font-medium">{item.site}</span>
                    <div className="text-sm text-gray-600">Username: {item.username}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div
                    className="flex space-x-1 cursor-pointer hover:opacity-70 transition-opacity"
                    onClick={() => togglePasswordVisibility(item.id)}
                  >
                    {visiblePasswords.has(item.id) ? (
                      <span className="text-xl font-mono">{item.password}</span>
                    ) : (
                      Array(8)
                        .fill(0)
                        .map((_, i) => (
                          <div key={i} className="w-2 h-2 bg-black rounded-full"></div>
                        ))
                    )}
                  </div>

                  <button
                    onClick={() => handleDeletePassword(item.id)}
                    className="text-red-600 font-semibold text-sm hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold">Add Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <label className="text-xl font-medium">Website</label>
              <Input
                placeholder="Enter website (e.g., gmail.com)"
                value={newWebsite}
                onChange={(e) => setNewWebsite(e.target.value)}
                className="rounded-xl bg-gray-200 border-0 py-5 px-4 text-base"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xl font-medium">Username</label>
              <Input
                placeholder="Enter username/email for this site"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="rounded-xl bg-gray-200 border-0 py-5 px-4 text-base"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xl font-medium">Password</label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="rounded-xl bg-gray-200 border-0 py-5 px-4 text-base"
              />
            </div>
            <AuthButton
              onClick={handleAddPassword}
              className="bg-black hover:bg-gray-800 text-white font-semibold w-full mt-6"
            >
              + Add Password
            </AuthButton>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default PasswordManager;
