import { PlusIcon } from 'lucide-react';

import { Trash2 } from 'lucide-react';
import type { Lobby, Team } from './Lobbies';
import { Button } from './ui/button';
import UserCard from './global/UserCard';

export default function Team({
  lobbyData,
  team,
  isAdmin = false,
}: {
  lobbyData: Lobby;
  team: Team;
  isAdmin: boolean;
}) {
  const addMemberToTeam = async (
    lobbyId: string,
    teamName: string,
    memberId: string
  ) => {
    try {
      const response = await fetch(
        `/api/lobbies/lobby/${lobbyId}/teams/team/${teamName}`,
        {
          method: 'POST',
          body: JSON.stringify({ memberId }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add team.');
      }

      const result = await response.json();
      console.log(result.message);
    } catch (error) {
      console.error('Error adding team:', error);
    }
  };
  return (
    <div className='flex flex-col gap-4 border p-4 relative bg-white/5 rounded-[8px] shadow'>
      <h3>{team.name}</h3>

      {isAdmin && (
        <div className='absolute top-2 right-2'>
          <Button size='icon' variant='ghost'>
            <Trash2 />
          </Button>
        </div>
      )}

      <div className='grid gap-2'>
        <h4>Team members:</h4>

        {team.members?.map(({ memberId }) => (
          <UserCard simple key={memberId} userId={memberId} />
        ))}
      </div>

      {isAdmin && (
        <div className='grid gap-2'>
          <h4>Add new member:</h4>

          {lobbyData.members
            .filter((id) =>
              lobbyData?.teams?.every(
                ({ members }) =>
                  !members?.some(({ memberId }) => memberId === id)
              )
            )
            .map((id) => (
              <UserCard simple key={id} userId={id}>
                <Button
                  size='icon'
                  variant='ghost'
                  onClick={() => addMemberToTeam(lobbyData.id, team.name, id)}
                >
                  <PlusIcon />
                </Button>
              </UserCard>
            ))}
        </div>
      )}
    </div>
  );
}
