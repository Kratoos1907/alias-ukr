import Image from 'next/image';
import { useState } from 'react';
import { useEffect } from 'react';
import { UserProfile } from './Lobbies';

export default function UserCard({ userId }: { userId: string }) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const data = await fetchUserProfile(userId);
      setUserProfile(data);
    };
    fetchUser();
  }, []);

  return (
    <div className='flex gap-2'>
      {userProfile?.image ? (
        <Image
          src={userProfile.image || ''}
          alt='Avatar'
          width={48}
          height={48}
          className='rounded-full'
        />
      ) : (
        <div className='w-12 aspect-square rounded-full bg-cyan-200' />
      )}
      <div className='grid'>
        <p className='text-lg'>{userProfile?.name}</p>
        <p className='text-sm'>{userProfile?.email}</p>
      </div>
    </div>
  );
}

async function fetchUserProfile(userId: string) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) {
      console.error(`Error fetching user profile: ${response.statusText}`);
      return null;
    }

    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}
