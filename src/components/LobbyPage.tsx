'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import type { Lobby } from './Lobbies';

export default function LobbyPage({ lobbyId }: { lobbyId: string }) {
  const [lobbyData, setLobbyData] = useState<Lobby | null>(null);
  const isAdmin = useSession().data?.user?.id === lobbyData?.owner;
  console.log(lobbyData);

  useEffect(() => {
    const fetchUser = async () => {
      const data = await fetchLobbyData(lobbyId);
      setLobbyData(data);
    };
    fetchUser();
  }, []);

  if (!lobbyData) return <></>;

  return (
    <>
      {isAdmin && <p>{lobbyData.createdAt._seconds}</p>}
      <p>{lobbyData.id}</p>
    </>
  );
}

async function fetchLobbyData(lobbyId: string) {
  try {
    const response = await fetch(`/api/lobbies/lobby/${lobbyId}`);
    if (!response.ok) {
      console.error(`Error fetching lobby data: ${response.statusText}`);
      return null;
    }

    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}
