'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Lobby } from '../Lobbies';

interface Team {
  name: string;
  color: string;
  members?: string[];
}
interface TeamSetupProps {
  lobby: Lobby;
  onTeamsCreated?: () => void;
}
// const CREATE_TEAMS_ROUTE = (lobbyId: string) => `/api/lobbies/${lobbyId}/teams`;

export default function TeamSetup({ lobby, onTeamsCreated }: TeamSetupProps) {
  const { data: session } = useSession();
  const [teams, setTeams] = useState<Team[]>([
    { name: 'Team 1', color: '#ff0000' },
    { name: 'Team 2', color: '#0000ff' },
  ]);
  const [assignmentType, setAssignmentType] = useState<'random' | 'custom'>(
    'random'
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!session) return <p>Please sign in first.</p>;

  const addTeam = () => {
    setTeams([
      ...teams,
      { name: `Team ${teams.length + 1}`, color: '#00ff00' },
    ]);
  };

  const removeTeam = (index: number) => {
    setTeams(teams.filter((_, i) => i !== index));
  };

  const handleTeamChange = (
    index: number,
    field: 'name' | 'color',
    value: string
  ) => {
    const newTeams = [...teams];
    newTeams[index] = { ...newTeams[index], [field]: value };
    setTeams(newTeams);
  };

  //   const handleSubmit = async () => {
  //     setLoading(true);
  //     setError('');
  //     try {
  //       const res = await fetch(CREATE_TEAMS_ROUTE(lobby.id), {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({ teams, assignmentType }),
  //       });

  //       if (!res.ok) {
  //         const errorText = await res.text();
  //         setError(`Error creating teams: ${errorText}`);
  //         return;
  //       }
  //       const data = await res.json();
  //       if (onTeamsCreated) onTeamsCreated();
  //       console.log('Teams Created successfully!', data);
  //     } catch (error: any) {
  //       setError(`Error creating teams: ${error.message}`);
  //       console.error('Error creating teams:', error, error.stack);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  return (
    <div>
      <h2>Create Teams</h2>
      {teams.map((team, index) => (
        <div key={index} style={{ marginBottom: '10px' }}>
          <input
            type='text'
            placeholder='Team Name'
            value={team.name}
            onChange={(e) => handleTeamChange(index, 'name', e.target.value)}
            style={{ marginRight: '10px' }}
          />
          <input
            type='color'
            value={team.color}
            onChange={(e) => handleTeamChange(index, 'color', e.target.value)}
          />
          <button
            onClick={() => removeTeam(index)}
            style={{ marginLeft: '10px' }}
          >
            Remove
          </button>
        </div>
      ))}
      <button onClick={addTeam}>Add Team</button>

      <div>
        <label>
          Assignment Type:
          <select
            value={assignmentType}
            onChange={(e) =>
              setAssignmentType(e.target.value as 'random' | 'custom')
            }
          >
            <option value='random'>Random</option>
            <option value='custom'>Custom</option>
          </select>
        </label>
      </div>

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Creating teams...' : 'Create Teams'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
