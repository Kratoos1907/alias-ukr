import { NextResponse } from 'next/server';
import { admin } from '@/lib/firebase-admin';

const firestore = admin.firestore();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id: lobbyId } = params;

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

    const lobbyData = lobbyDoc.data();
    return NextResponse.json(lobbyData, { status: 200 });
  } catch (error) {
    console.error('Error fetching lobby:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lobby' },
      { status: 500 }
    );
  }
}
