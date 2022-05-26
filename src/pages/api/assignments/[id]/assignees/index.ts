import type { NextApiRequest, NextApiResponse } from 'next';
import type { Personnel } from '../../../../../types/personnel';
import type { Position } from '../../../../../types/position';

import { Firestore } from '@google-cloud/firestore';
import { getSession } from 'next-auth/react';

const assignees = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (req.method !== 'GET') {
    res.status(404);
    return;
  }

  const session = await getSession({ req });
  if (!session) {
    res.status(404).end();
    return;
  }

  const db = new Firestore({
    projectId: 'next-steps-350612',
  });

  const snapshot = await db
    .collection('personnel')
    .where('active', '==', true)
    .where('onBreak', '==', false)
    .where('currentMonthAssign', '==', id as string)
    .get();

  const people: Personnel[] = [];
  const positions: Map<string, Position> = new Map();

  const snap2 = await db.collection('positions').get();
  snap2.forEach((position) => {
    positions.set(position.id, { ...position.data() } as Position);
  });

  snapshot.forEach((person) => {
    const data = person.data();
    const p: Personnel = {
      ...data,
      id: person.id,
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
    people.push(p);
  });

  res.status(200).json(people);
};

export default assignees;
