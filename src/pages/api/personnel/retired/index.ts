import type { NextApiRequest, NextApiResponse } from 'next';
import type { Personnel } from '../../../../types/personnel';
import type { Assignment } from '../../../../types/assignment';

import { Firestore } from '@google-cloud/firestore';

const onBreakPersonnel = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  const db = new Firestore({
    projectId: 'next-steps-350612',
  });

  if (req.method === 'PUT') {
    const doc = db.collection('personnel').doc(id as string);
    await doc.update({ active: false, ...JSON.parse(req.body) });
    res.status(200).end();
  }

  if (req.method === 'GET') {
    const snapshot = await db
      .collection('personnel')
      .where('active', '==', false)
      .get();

    const people: Personnel[] = [];
    const positions: Map<string, Assignment> = new Map();

    const snap2 = await db.collection('positions').get();
    snap2.forEach((position) => {
      positions.set(position.id, { ...position.data() } as Assignment);
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
  }

  res.status(418).end();
};

export default onBreakPersonnel;
