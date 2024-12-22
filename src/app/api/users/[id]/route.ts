// app/api/users/[id]/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { admin } from '@/lib/firebase-admin';

const firestore = admin.firestore();

export async function GET(
  request: Request,
  { params: { id: userId } }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      console.log('No session found');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (!session.user?.id) {
      console.log('User ID is missing in session');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userDocRef = firestore.collection('userProfiles').doc(userId);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const userData = userDoc.data();

    return NextResponse.json(userData, { status: 200 });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json(
      { message: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}
