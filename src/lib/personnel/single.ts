import type { Position } from '../../types/position';
import type { Personnel } from '../../types/personnel';

import { Firestore } from '@google-cloud/firestore';

export const getSingleUserByAuth0 = async (id: string): Promise<Personnel> => {
  const db = new Firestore({
    projectId: 'next-steps-350612',
  });

  const snapshot = await db
    .collection('personnel')
    .where('auth0Id', '==', id as string)
    .get();

  const positions: Map<string, Position> = new Map();

  const snap2 = await db.collection('positions').get();
  snap2.forEach((position) => {
    positions.set(position.id, { ...position.data() } as Position);
  });

  if (snapshot.docs.length < 1) {
    throw new Error('No users found');
  }

  const data = snapshot.docs[0].data();
  const p: Personnel = {
    ...data,
    id: snapshot.docs[0].id,
    commitedThru: data.commitedThru.toDate(),
    signedCommitment: data.signedCommitment.toDate(),
    ltClass: data.ltClass.toDate(),
    birthday: data.birthday.toDate(),
    currentMonthAssign: data.currentMonthAssign
      ? positions.get(data.currentMonthassign)
      : undefined,
    lastMonthAssign: data.lastMonthAssign
      ? positions.get(data.lastMonthAssign)
      : undefined,
    leader: data.leader,
  } as Personnel;

  return p;
};

export const getSingleUserById = async (id: string): Promise<Personnel> => {
  const db = new Firestore({
    projectId: 'next-steps-350612',
  });

  const snapshot = await db.doc(`/personnel/${id}`).get();

  const positions: Map<string, Position> = new Map();

  const snap2 = await db.collection('positions').get();
  snap2.forEach((position) => {
    positions.set(position.id, { ...position.data() } as Position);
  });

  const data = snapshot.data();
  if (!data) {
    throw new Error('User not found');
  }

  const p: Personnel = {
    ...data,
    id: snapshot.id,
    commitedThru: data.commitedThru.toDate(),
    signedCommitment: data.signedCommitment.toDate(),
    ltClass: data.ltClass.toDate(),
    birthday: data.birthday.toDate(),
    currentMonthAssign: data.currentMonthAssign
      ? positions.get(data.currentMonthassign)
      : undefined,
    lastMonthAssign: data.lastMonthAssign
      ? positions.get(data.lastMonthAssign)
      : undefined,
    leader: data.leader,
  } as Personnel;

  return p;
};
