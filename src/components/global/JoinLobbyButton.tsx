'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Button from './Button';

interface JoinLobbyButtonProps {
  lobbyId: string;
  onJoined?: () => void;
}

export default function JoinLobbyButton({
  lobbyId,
  onJoined,
}: JoinLobbyButtonProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  if (!session) return <p>Please sign in first.</p>;

  async function joinLobby() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/lobbies/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lobbyId }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        if (res.status === 409) {
          router.push(`/lobbies/${lobbyId}`);
        }
        setError(`Error joining lobby: ${errorText}`);
        return;
      }

      const data = await res.json();

      if (onJoined) onJoined();
      console.log('Joined lobby successfully:', data);
    } catch (error) {
      setError(`Error joining lobby: ${error}`);
      console.error('Error joining lobby:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button onClick={joinLobby} disabled={loading}>
        {loading ? 'Joining...' : 'Join Lobby'}
      </Button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </>
  );
}
