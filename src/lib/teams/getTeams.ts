import type { Team } from '#/types/team';
import { connectToDatabase } from '#/lib/mongo/conn';

export const getTeams = async (): Promise<Team[]> => {
  const { db } = await connectToDatabase();
  const docs = db.collection('teams').find({});

  const teams: Team[] = [];
  await docs.forEach((doc) => {
    teams.push({
      id: doc._id.toString(),
      ...(doc as any),
    });
  });
  return teams;
};

export const getMyTeams = async (_teams: string[]): Promise<Team[]> => {
  const { db } = await connectToDatabase();
  const docs = db.collection('teams').find();

  const teams: Team[] = [];
  await docs.forEach((doc) => {
    if (!_teams.includes(doc._id.toString())) return;
    teams.push({
      id: doc._id.toString(),
      ...(doc as any),
    });
  });
  return teams;
}