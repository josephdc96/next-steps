import type { Position } from '../../types/position';
import { connectToDatabase } from '#/lib/mongo/conn';

export const getPositions = async (): Promise<Position[]> => {
  const { db } = await connectToDatabase();

  const docs = db.collection('positions').find({});

  const positions: Position[] = [];

  await docs.forEach((data) => {
    const p: Position = {
      ...(data as any),
      id: data._id,
    } as Position;
    positions.push(p);
  });

  return positions;
};

export const getTeamPositions = async (team: string): Promise<Position[]> => {
  const { db } = await connectToDatabase();

  const docs = db.collection('positions').find({ teams: team });

  const positions: Position[] = [];

  await docs.forEach((data) => {
    const p: Position = {
      ...(data as any),
      id: data._id,
    } as Position;
    positions.push(p);
  });

  return positions;
};

export const getPosition = async (id: string): Promise<Position> => {
  const { db } = await connectToDatabase();

  const doc = await db.collection('positions').findOne({ _id: id });

  if (!doc) throw Error('Position not found');
  return {
    ...(doc as any),
    id: doc._id,
  } as Position;
};
