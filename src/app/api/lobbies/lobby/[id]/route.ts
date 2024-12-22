import { NextResponse } from 'next/server';
import { admin } from '@/lib/firebase-admin';

const firestore = admin.firestore();

export async function GET(
  request: Request,
  { params: { id: lobbyId } }: { params: { id: string } }
) {
  try {
    if (!lobbyId)
      return NextResponse.json(
        { message: 'Lobby ID is required' },
        { status: 400 }
      );

    const lobbyDocRef = firestore.collection('lobbies').doc(lobbyId);
    const lobbyDoc = await lobbyDocRef.get();

    if (!lobbyDoc.exists)
      return NextResponse.json({ message: 'Lobby not found' }, { status: 404 });

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

export async function PATCH(
  request: Request,
  { params: { id: lobbyId } }: { params: { id: string } }
) {
  try {
    if (!lobbyId) {
      return NextResponse.json(
        { message: 'Lobby ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { message: 'Invalid or missing name' },
        { status: 400 }
      );
    }

    const lobbyDocRef = firestore.collection('lobbies').doc(lobbyId);
    const lobbyDoc = await lobbyDocRef.get();

    if (!lobbyDoc.exists) {
      return NextResponse.json({ message: 'Lobby not found' }, { status: 404 });
    }

    // Update the lobby name
    await lobbyDocRef.update({ name });

    return NextResponse.json(
      { message: 'Lobby name updated successfully', name },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating lobby name:', error);
    return NextResponse.json(
      { error: 'Failed to update lobby name' },
      { status: 500 }
    );
  }
}
