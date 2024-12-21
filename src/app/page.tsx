import CreateLobbyButton from '@/components/global/CreateLobbyButton';
import Lobbies from '@/components/Lobbies';

export default function Home() {
  return (
    <main className='grid gap-4 p-4'>
      <CreateLobbyButton />

      <div className='grid gap-4'>
        <h1 className='text-xl font-semibold'>Lobbies</h1>
        <Lobbies />
      </div>
    </main>
  );
}
