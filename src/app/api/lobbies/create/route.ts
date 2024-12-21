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

    const userId = session.user.id;

    if (!userId) {
      return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
    }

    const lobbyRef = firestore()?.collection('lobbies').doc();

    try {
      await lobbyRef?.set({
        owner: userId,
        createdAt: new Date(),
        members: [userId],
        isOpen: true,
      });
    } catch (firestoreError) {
      console.error('Firestore error: ', firestoreError);
      return NextResponse.json(
        { error: 'Error creating lobby in Firestore' },
        { status: 500 }
      );
    }

    return NextResponse.json({ lobbyId: lobbyRef?.id }, { status: 200 });
  } catch (error: any) {
    console.error('Error creating lobby:', error);
    return NextResponse.json(
      { error: 'Internal Server Error: ' + error.message },
      { status: 500 }
    );
  }
}

export { POST };
