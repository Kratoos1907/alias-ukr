import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase-admin';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
    }

    const { lobbyId } = await req.json();

    if (!lobbyId) {
      return NextResponse.json({ error: 'Missing lobby ID' }, { status: 400 });
    }

    const lobbyRef = firestore()?.collection('lobbies').doc(lobbyId);
    const lobbyDoc = await lobbyRef?.get();

    if (!lobbyDoc?.exists) {
      return NextResponse.json({ error: 'Lobby not found' }, { status: 404 });
    }

    const lobbyData = lobbyDoc.data();

    if (lobbyData?.members?.includes(userId)) {
      return NextResponse.json(
        { error: 'User already in the lobby' },
        { status: 409 }
      ); // Conflict status
    }
    if (lobbyData?.isOpen !== true) {
      return NextResponse.json({ error: 'Lobby is not open' }, { status: 403 });
    }

    await lobbyRef?.update({
      members: [...(lobbyData?.members || []), userId],
    });

    return NextResponse.json(
      { message: 'Joined lobby successfully', lobbyId, userId },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error joining lobby:', error, error.stack);
    return NextResponse.json(
      { error: 'Internal Server Error: ' + error.message },
      { status: 500 }
    );
  }
}

export { POST };
