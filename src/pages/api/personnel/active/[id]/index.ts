import type { NextApiRequest, NextApiResponse } from 'next';
import type { Personnel } from '../../../../../types/personnel';
import type { Position } from '../../../../../types/position';

import { Firestore } from '@google-cloud/firestore';

const getPerson = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (req.method !== 'GET') {
    res.status(404);
    return;
  }

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
    res.status(404).end();
    return;
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

  res.status(200).json(p);
};

export default getPerson;
