import Link from 'next/link';
import type { Lobby } from './Lobbies';
import JoinLobbyButton from './global/JoinLobbyButton';
import UserCard from './global/UserCard';

export default function Lobby(lobby: Lobby) {
  return (
    <div className='grid border p-2'>
      <p className='text-xl font-bold'>{lobby.id}</p>
      <Link href={`/lobbies/${lobby.id}`} className='text-cyan-200'>
        Lobby page
      </Link>

      <JoinLobbyButton lobbyId={lobby.id} />

      <div className='p-2 grid gap-2'>
        {lobby.members.map((id: string) => (
          <UserCard key={id} userId={id} />
        ))}
      </div>
    </div>
  );
}
