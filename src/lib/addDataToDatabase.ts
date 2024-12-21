import { ref, push, set } from 'firebase/database';
import { database } from './firebase';

export const addDataToDatabase = async (lobbyData: any) => {
  try {
    // Use push to generate a unique id
    const lobbiesRef = ref(database, 'lobbies');
    const newLobbyRef = push(lobbiesRef);

    // Add a timestamp
    const dataWithTimestamp = {
      ...lobbyData,
      createdAt: new Date().toISOString(),
    };

    await set(newLobbyRef, dataWithTimestamp);

    console.log('Lobby data added successfully with id:', newLobbyRef.key);
  } catch (error) {
    console.error('Error adding lobby to database:', error);
  }
};
