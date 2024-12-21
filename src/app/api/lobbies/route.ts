import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase-admin';

export async function GET() {
  const db = firestore();

  if (!db) {
    console.error('Firebase not initialized correctly!');
    return NextResponse.json(
      {
        error: 'Failed to fetch lobbies due to firebase initialization failure',
      },
      { status: 500 }
    );
  }

  try {
    const snapshot = await db.collection('lobbies').get();
    const lobbies: any[] = [];

    snapshot.forEach((doc) => {
      lobbies.push({ id: doc.id, ...doc.data() });
    });

    return NextResponse.json(lobbies);
  } catch (error) {
    console.error('Error fetching lobbies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lobbies' },
      { status: 500 }
    );
  }
}
