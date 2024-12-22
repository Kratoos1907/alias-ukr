import { NextResponse } from 'next/server';
import { admin } from '@/lib/firebase-admin';

const firestore = admin.firestore();

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const lobbyId = params.id;

    if (!lobbyId) {
      return NextResponse.json(
        { message: 'Lobby ID is required' },
        { status: 400 }
      );
    }

    const lobbyDocRef = firestore.collection('lobbies').doc(lobbyId);
    const lobbyDoc = await lobbyDocRef.get();

    if (!lobbyDoc.exists) {
      return NextResponse.json({ message: 'Lobby not found' }, { status: 404 });
    }

    const { newTeam } = await request.json();

    if (!newTeam) {
      return NextResponse.json(
        { message: 'No team name provided' },
        { status: 400 }
      );
    }

    // Update the `teams` array in Firestore
    await lobbyDocRef.update({
      teams: admin.firestore.FieldValue.arrayUnion(newTeam),
    });

    return NextResponse.json(
      { message: `Team "${newTeam}" added successfully.` },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating teams:', error);
    return NextResponse.json(
      { message: 'Failed to update teams' },
      { status: 500 }
    );
  }
}
