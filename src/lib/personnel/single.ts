import type { Position } from '#/types/position';
import type { Personnel } from '#/types/personnel';

import { connectToDatabase } from '#/lib/mongo/conn';

export const getSingleUserByAuth0 = async (id: string): Promise<Personnel> => {
  const { db } = await connectToDatabase();

  const doc = await db.collection('personnel').findOne({ auth0Id: id });
  const positions: Map<string, Position> = new Map();

  const snap2 = await db.collection('positions').find({});
  await snap2.forEach((position) => {
    positions.set(position._id.toString(), {
      ...(position as any),
    } as Position);
  });

  if (!doc) {
    throw new Error('User not found');
  }

  return {
    ...(doc as any),
    id: doc._id,
    commitedThru: doc.commitedThru,
    signedCommitment: doc.signedCommitment,
    ltClass: doc.ltClass,
    birthday: doc.birthday,
    currentMonthAssign: doc.currentMonthAssign
      ? positions.get(doc.currentMonthassign)
      : undefined,
    lastMonthAssign: doc.lastMonthAssign
      ? positions.get(doc.lastMonthAssign)
      : undefined,
    leader: doc.leader,
  } as Personnel;
};

export const getSingleUserById = async (id: string): Promise<Personnel> => {
  const { db } = await connectToDatabase();

  const doc = await db.collection('personnel').findOne({ _id: id });
  const positions: Map<string, Position> = new Map();

  const snap2 = await db.collection('positions').find({});
  await snap2.forEach((position) => {
    positions.set(position._id.toString(), {
      ...(position as any),
    } as Position);
  });

  if (!doc) {
    throw new Error('User not found');
  }

  return {
    ...(doc as any),
    id: doc._id,
    currentMonthAssign: doc.currentMonthAssign
      ? positions.get(doc.currentMonthassign)
      : undefined,
    lastMonthAssign: doc.lastMonthAssign
      ? positions.get(doc.lastMonthAssign)
      : undefined,
    leader: doc.leader,
  } as Personnel;
};
