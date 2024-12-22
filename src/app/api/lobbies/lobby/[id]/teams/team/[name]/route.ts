import { NextResponse } from 'next/server';
import { admin } from '@/lib/firebase-admin';

const firestore = admin.firestore();

export async function POST(
  request: Request,
  { params }: { params: { id: string; name: string } }
) {
  try {
    const { id: lobbyId, name } = params;

    if (!lobbyId || !name) {
      return NextResponse.json(
        { message: 'Lobby ID and Team ID are required' },
        { status: 400 }
      );
    }

    const lobbyDocRef = firestore.collection('lobbies').doc(lobbyId);
    const lobbyDoc = await lobbyDocRef.get();

    if (!lobbyDoc.exists) {
      return NextResponse.json({ message: 'Lobby not found' }, { status: 404 });
    }

    const lobbyData = lobbyDoc.data();

    if (!lobbyData?.teams || !Array.isArray(lobbyData.teams)) {
      return NextResponse.json(
        { message: 'Teams data is missing or invalid in lobby' },
        { status: 400 }
      );
    }

    // Find the specific team by name (assume name as the unique identifier for the team)
    const teamIndex = lobbyData.teams.findIndex(
      (team: any) => team.name === name
    );
    const team = lobbyData.teams.find((team: any) => team.name === name);

    const { memberId } = await request.json();

    if (!memberId || typeof memberId !== 'string') {
      return NextResponse.json(
        { message: 'Invalid memberId in request body' },
        { status: 400 }
      );
    }

    // Initialize members array if not present
    if (!Array.isArray(team.members)) {
      team.members = [];
    }

    // Add member to the team if not already present
    if (!team.members.includes(memberId)) {
      team.members.push({ memberId });

      // Update the lobby's teams data in Firestore
      const updatedTeams = [...lobbyData.teams];
      updatedTeams[teamIndex] = team;

      await lobbyDocRef.update({ teams: updatedTeams });
    }

    return NextResponse.json(
      { message: `Member "${memberId}" added to team "${team.name}"` },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error adding member to team:', error);
    return NextResponse.json(
      { message: 'Failed to add member to team' },
      { status: 500 }
    );
  }
}
