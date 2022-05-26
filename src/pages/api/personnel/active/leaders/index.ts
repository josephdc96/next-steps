import type { NextApiRequest, NextApiResponse } from 'next';
import type { Personnel } from '../../../../../types/personnel';
import type { Position } from '../../../../../types/position';

import { Firestore } from '@google-cloud/firestore';

const activeLeaders = async (req: NextApiRequest, res: NextApiResponse) => {
  const { leaders } = req.query

  if (req.method !== 'GET') {
    res.status(404);
    return;
  }

  const db = new Firestore({
    projectId: 'next-steps-350612',
  });

  const snapshot = await db
    .collection('personnel')
    .where('active', '==', true)
    .get();

  const people: Personnel[] = [];
  const positions: Map<string, Position> = new Map();

  const snap2 = await db.collection('positions').get();
  snap2.forEach((position) => {
    positions.set(position.id, { ...position.data() } as Position);
  });

  snapshot.forEach((person) => {
    const data = person.data();
    if (!data.subteamLead && !data.teamLead) return;
    if (leaders && !(leaders as string[]).includes(person.id)) return;

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

export default activeLeaders;
