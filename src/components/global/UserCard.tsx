import Image from 'next/image';
import { useEffect } from 'react';
import { UserProfile } from '../Lobbies';
import { DetailedHTMLProps, HTMLAttributes, useState } from 'react';
import { cn } from '@/lib/utils';

export default function UserCard({
  userId,
  simple = false,
  ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
  userId: string;
  simple?: boolean;
}) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const data = await fetchUserProfile(userId);
      setUserProfile(data);
    };
    fetchUser();
  }, []);

  return (
    <code
      className={cn(
        'bg-white/10 p-2 border rounded-[8px] shadow flex gap-4 items-center w-fit',
        simple && 'p-0 bg-white/0 border-none'
      )}
    >
      {userProfile?.image ? (
        <Image
          src={userProfile.image || ''}
          alt='Avatar'
          width={simple ? 36 : 48}
          height={simple ? 36 : 48}
          className='rounded-full'
        />
      ) : (
        <div className='w-12 aspect-square rounded-full bg-cyan-200' />
      )}

      <div className='grid'>
        {!simple && (
          <>
            <p className='text-lg'>{userProfile?.name}</p>
            <p className='text-sm'>{userProfile?.email}</p>
          </>
        )}
        {props.children}
      </div>
    </code>
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
