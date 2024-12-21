import { database } from './firebase';
import { ref, get, update } from 'firebase/database';

export async function joinLobby(lobbyId: string, playerName: string) {
  const lobbyRef = ref(database, `lobbies/${lobbyId}`);
  const lobbySnapshot = await get(lobbyRef);

  if (lobbySnapshot.exists()) {
    const lobbyData = lobbySnapshot.val();
    if (lobbyData.players.includes(playerName)) {
      throw new Error('Player already in the lobby');
    }

    const updatedPlayers = [...lobbyData.players, playerName];
    update(lobbyRef, { players: updatedPlayers });
  } else {
    throw new Error('Lobby not found');
  }
}
