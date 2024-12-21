import LobbyPage from '@/components/LobbyPage';
interface LobbyPageProps {
  params: Promise<{ lobbyId: string }>;
}

export const generateMetadata = ({ params }: LobbyPageProps) =>
  params.then(({ lobbyId: title }) => ({ title }));

export default async function Page({ params }: LobbyPageProps) {
  return params.then(({ lobbyId }) => (
    <main className='grid gap-4 p-4'>
      <LobbyPage lobbyId={lobbyId} />
    </main>
  ));
}
