import type { NextApiRequest, NextApiResponse } from 'next';
import type { Personnel } from '../../../../types/personnel';
import type { Position } from '../../../../types/position';

import { Firestore } from '@google-cloud/firestore';

const activePersonnel = async (req: NextApiRequest, res: NextApiResponse) => {
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
    .where('onBreak', '==', false)
    .get();

  const people: Personnel[] = [];

  snapshot.forEach((person) => {
    const data = person.data();
    const p: Personnel = {
      ...data,
      id: person.id,
      commitedThru: data.commitedThru.toDate(),
      signedCommitment: data.signedCommitment.toDate(),
      ltClass: data.ltClass.toDate(),
      birthday: data.birthday.toDate(),
      leader: data.leader,
    } as Personnel;
    people.push(p);
  });

  res.status(200).json(people);
};

export default activePersonnel;
