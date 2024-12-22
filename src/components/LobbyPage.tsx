'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import type { Lobby } from './Lobbies';
import UserCard from './global/UserCard';

import { Button } from './ui/button';
import { Input } from './ui/input';
import { Check, X, Pencil, Trash2 } from 'lucide-react';
import JoinLobbyButton from './global/JoinLobbyButton';
import Team from './Team';
import AddNewTeam from './AddNewTeam';

export default function LobbyPage({ lobbyId }: { lobbyId: string }) {
  const [lobbyData, setLobbyData] = useState<Lobby | null>(null);
  const isAdmin = useSession().data?.user?.id === lobbyData?.owner;

  const editLobbyName = (name: string) => {
    fetch('/api/lobbies/lobby/{lobbyId}', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });
  };

  useEffect(() => {
    const fetchUser = async () => {
      const data = await fetchLobbyData(lobbyId);
      setLobbyData(data);
    };
    fetchUser();
  }, []);

  const session = useSession();

  const isJoined = lobbyData?.members.includes(session?.data?.user?.id || '');

  const [isEditing, setIsEditing] = useState(false);

  const [lobbyName, setLobbyName] = useState(lobbyId || '');

  if (!lobbyData) return <></>;

  return (
    <div className='grid gap-6'>
      <div className='flex items-center justify-between gap-2'>
        {isEditing ? (
          <Input
            value={lobbyName}
            onChange={({ currentTarget: { value } }) => setLobbyName(value)}
            className='bg-white/5 h-[60px] text-lg placeholder:text-lg'
          />
        ) : (
          <h1 className='leading-[60px]'>Lobby: {lobbyId}</h1>
        )}

        {isAdmin && (
          <div className='flex gap-1'>
            {isEditing ? (
              <>
                <Button
                  onClick={() => editLobbyName(lobbyName)}
                  size='icon'
                  variant='ghost'
                >
                  <Check />
                </Button>
                <Button
                  onClick={() => setIsEditing(false)}
                  size='icon'
                  variant='ghost'
                >
                  <X />
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                size='icon'
                variant='ghost'
              >
                <Pencil />
              </Button>
            )}
            <Button size='icon' variant='ghost'>
              <Trash2 />
            </Button>
          </div>
        )}
      </div>

      {session.status === 'authenticated' && (
        <>
          <div className='grid gap-4'>
            <h2>Lobby members:</h2>

            <div className='flex gap-4 flex-wrap items-start'>
              {lobbyData.members.map((id) => (
                <UserCard key={id} userId={id}>
                  <p className='bg-white/10 px-2 leading-8 rounded-[8px] mt-2 text-center'>
                    {
                      lobbyData.teams?.find(({ members }) =>
                        members?.some(({ memberId }) => id === memberId)
                      )?.name
                    }
                  </p>
                </UserCard>
              ))}
            </div>
          </div>

          {isJoined && (
            <div className='grid gap-4'>
              <h2>Teams:</h2>

              <div className='grid gap-4'>
                {lobbyData?.teams?.map((team) => (
                  <Team key={team.name} {...{ lobbyData, team, isAdmin }} />
                ))}
              </div>
            </div>
          )}

          {isAdmin && <AddNewTeam {...{ lobbyId }} />}
        </>
      )}

      {!isAdmin && !isJoined && <JoinLobbyButton lobbyId={lobbyId} />}
    </div>
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
