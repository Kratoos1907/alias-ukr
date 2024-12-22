'use client';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from '../ui/button';

export default function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className='flex justify-between w-full items-center'>
        <code className='bg-white/5 p-2 border rounded-[8px] shadow'>
          {session.user?.name}
        </code>
        <Button onClick={() => signOut()}>Sign out</Button>
      </div>
    );
  }

  return <Button onClick={() => signIn('google')}>Sign in with Google</Button>;
}
