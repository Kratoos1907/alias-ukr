import { get, remove, update } from 'firebase/database';
import { ref } from 'firebase/database';
import { database } from './firebase';

export async function leaveLobby(lobbyId: string, playerName: string) {
  const lobbyRef = ref(database, `lobbies/${lobbyId}`);
  const lobbySnapshot = await get(lobbyRef);

  if (lobbySnapshot.exists()) {
    const lobbyData = lobbySnapshot.val();
    const updatedPlayers = lobbyData.players.filter(
      (player: string) => player !== playerName
    );
    update(lobbyRef, { players: updatedPlayers });

    // Якщо всі пішли, видалити лобі
    if (updatedPlayers.length === 0) {
      remove(lobbyRef);
    }
  }
}
