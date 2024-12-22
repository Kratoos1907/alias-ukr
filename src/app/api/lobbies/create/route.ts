import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase-admin';

async function POST(req: Request) {
  try {
    const lobbyRef = firestore()?.collection('lobbies').doc();

    const { name } = await req.json();

    try {
      await lobbyRef?.set({
        name,
        owner: name,
        createdAt: new Date(),
        members: [name],
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
