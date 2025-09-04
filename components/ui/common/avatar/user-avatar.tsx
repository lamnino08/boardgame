'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Avatar from '@/components/ui/common/avatar/avatar';
import { Card} from '@/components/ui/Card';
import { AuthCheck } from '@/lib/auth';
import { LogOutIcon, SettingsIcon, UserIcon } from 'lucide-react';
import Button from '../button/button';
import { logout } from '@/actions/user';

interface UserDropdownProps {
  user: AuthCheck['user']; // user có { username, email, ... }
}

const UserDropdown: React.FC<UserDropdownProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  if (!user) return null;

  const handleLogout = async () => {
    await await logout();
    router.push('/auth/sign-in');
  };

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 focus:outline-none"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <Avatar name={user.username} size={36} />
        <span className="hidden md:inline text-sm font-medium">{user.username}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className='absolute right-0 mt-2 w-60 z-50'>
          <Card className="p-4">
            <Button
              onClick={() => router.push('/profile')}
              variant='inverse'
            >
              <UserIcon className="w-4 h-4" />
              My Profile
            </Button>

            <Button
              onClick={() => router.push('/settings')}
              variant='inverse'
            >
              <SettingsIcon className="w-4 h-4" />
              Settings
            </Button>

            <Button
              onClick={handleLogout}
              className="!text-danger"
              variant='inverse'
            >
              <LogOutIcon className="w-4 h-4" />
              Logout
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
