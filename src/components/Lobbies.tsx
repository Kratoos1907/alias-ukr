'use client';

import { useEffect, useState } from 'react';

export interface Team {
  name: string;
  members?: { memberId: string }[];
}

export interface Lobby {
  id: string;
  owner: string;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  members: string[];
  isOpen: boolean;
  teams?: Team[];
}

export interface UserProfile {
  users: string[];
  email: string;
  name: string;
  image: string;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
}
import UserCard from './global/UserCard';
import Lobby from './Lobby';

export default function Lobbies() {
  const [lobbies, setLobbies] = useState<Lobby[]>([]);

  useEffect(() => {
    const fetchLobbies = async () => {
      try {
        const response = await fetch('/api/lobbies');
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `HTTP error! status: ${response.status} - ${errorText}`
          );
        }
        const data = await response.json();
        setLobbies(data);
      } catch (error) {
        console.error('Error fetching lobbies:', error);
      }
    };

    fetchLobbies();
  }, []);

  return (
    <div className='grid gap-2'>
      {lobbies.length > 0 ? (
        lobbies.map((lobby, index) => <Lobby key={lobby.id} {...lobby} />)
      ) : (
        <p>No lobbies available</p>
      )}
    </div>
  );
}
