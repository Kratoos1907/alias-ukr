import { onValue, ref } from 'firebase/database';

export function listenToLobby(lobbyId: string, callback: (data: any) => void) {
  const lobbyRef = ref(database, `lobbies/${lobbyId}`);
  onValue(lobbyRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });
}
