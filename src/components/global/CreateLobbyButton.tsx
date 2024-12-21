'use client';
import { useSession } from 'next-auth/react';
import Button from './Button';

export default function CreateLobbyButton() {
  const { data: session } = useSession();

  // If the user is not logged in, show a prompt to log in
  if (!session) return <p>Please sign in first.</p>;

  async function createLobby() {
    try {
      const res = await fetch('/api/lobbies/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Error response from lobby creation:', errorText);
        return;
      }

      const data = await res.json();
      console.log('Lobby created successfully:', data);
    } catch (error) {
      console.error('Error creating lobby:', error);
    }
  }

  return <Button onClick={createLobby}>Create New Lobby</Button>;
}
