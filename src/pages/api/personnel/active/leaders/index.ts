import type { NextApiRequest, NextApiResponse } from 'next';
import type { Personnel } from '../../../../../types/personnel';
import type { Position } from '../../../../../types/position';

import { Firestore } from '@google-cloud/firestore';
import { getSession } from 'next-auth/react';
import { UserRole } from '../../../../../types/personnel';

const activeLeaders = async (req: NextApiRequest, res: NextApiResponse) => {
  const { leaders } = req.query;

  const session = await getSession({ req });
  if (!session) {
    res.status(401).end();
    return;
  }

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

    if (
      !data.roles ||
      (!data.roles.includes(UserRole.Admin) &&
        !data.roles.includes(UserRole.TeamLeader) &&
        !data.roles.includes(UserRole.SubTeamLeader))
    ) {
      return;
    }

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

  const sorted = people.sort((a, b) => {
    if (a.firstName < b.firstName) return -1;
    if (a.firstName > b.firstName) return 1;
    if (a.firstName === b.firstName) {
      if (a.lastName < b.lastName) return -1;
      if (a.lastName > b.lastName) return 1;
      return 0;
    }
    return 0;
  });

  res.status(200).json(sorted);
};

export default activeLeaders;
