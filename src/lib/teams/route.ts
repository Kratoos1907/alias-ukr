import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase-admin';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { doc, updateDoc } from 'firebase/firestore';

// Assuming you want to POST to set up teams
async function POST(req: Request, { params }: { params: { lobbyId: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    if (!userId) {
      return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
    }

    const { lobbyId } = params;
    if (!lobbyId) {
      return NextResponse.json({ error: 'Missing lobby ID' }, { status: 400 });
    }
    const { teams, assignmentType } = await req.json();

    if (!teams || !Array.isArray(teams)) {
      return NextResponse.json({ error: 'Invalid team data' }, { status: 400 });
    }
    if (!['random', 'custom'].includes(assignmentType)) {
      return NextResponse.json(
        { error: 'Invalid assignment type' },
        { status: 400 }
      );
    }
    const lobbyRef = firestore.collection('lobbies').doc(lobbyId);
    const lobbyDoc = await lobbyRef.get();

    if (!lobbyDoc.exists) {
      return NextResponse.json({ error: 'Lobby not found' }, { status: 404 });
    }

    const lobbyData = lobbyDoc.data();
    if (lobbyData?.owner !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized. You must be the lobby owner to create teams' },
        { status: 403 }
      );
    }

    let assignedTeams = teams.map((team) => ({ ...team, members: [] }));

    if (assignmentType === 'random') {
      const members = lobbyData?.members || [];
      const shuffledMembers = [...members].sort(() => Math.random() - 0.5);
      assignedTeams = shuffledMembers.reduce((teams, member, index) => {
        teams[index % teams.length].members.push(member);
        return teams;
      }, assignedTeams);
    }

    await lobbyRef.update({
      teams: assignedTeams,
      isTeamsSetup: true,
    });

    return NextResponse.json(
      { message: 'Teams created successfully', lobbyId },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error creating teams:', error, error.stack);
    return NextResponse.json(
      { error: 'Internal Server Error: ' + error.message },
      { status: 500 }
    );
  }
}

export { POST };
