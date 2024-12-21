import { database } from './firebase';
import { ref, set } from 'firebase/database';

export function createLobby(hostName: string) {
  const lobbyId = Math.random().toString(36).substring(2, 9); // Унікальний код
  const lobbyRef = ref(database, `lobbies/${lobbyId}`);
  set(lobbyRef, {
    host: hostName,
    players: [hostName], // Список гравців
    status: 'waiting', // Стан лобі
  });
  return lobbyId;
}
