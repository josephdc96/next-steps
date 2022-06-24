import type { Position } from '../../types/position';

import { Firestore } from '@google-cloud/firestore';

export const getPositions = async (): Promise<Position[]> => {
  const db = new Firestore({
    projectId: 'next-steps-350612',
  });

  const snapshot = await db.collection('positions').get();
  const positions: Position[] = [];

  snapshot.forEach((position) => {
    const data = position.data();
    const p: Position = {
      ...data,
      id: position.id,
    } as Position;
    positions.push(p);
  });

  return positions;
};

export const getPosition = async (id: string): Promise<Position> => {
  const db = new Firestore({
    projectId: 'next-steps-350612',
  });

  const snapshot = await db.doc(`/positions/${id}`).get();
  const data = snapshot.data();
  if (!data) throw Error('Position not found');
  const p: Position = {
    ...data,
    id: snapshot.id,
  } as Position;

  return p;
};
