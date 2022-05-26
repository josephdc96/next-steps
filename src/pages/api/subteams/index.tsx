import type { NextApiRequest, NextApiResponse } from 'next';
import type { Subteam } from '../../../types/subteam';

import { Firestore } from '@google-cloud/firestore';
import { getSession } from 'next-auth/react';

const subteams = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  const session = await getSession({ req });
  if (!session) {
    res.status(401).end();
    return;
  }

  const db = new Firestore({
    projectId: 'next-steps-350612',
  });

  if (req.method === 'GET') {
    const snapshot = await db.collection('subteams').get();

    const sts: Subteam[] = [];
    snapshot.forEach((subteam) => {
      const data = subteam.data();
      const p: Subteam = {
        id: subteam.id,
        ...data,
      } as Subteam;
      sts.push(p);
    });

    res.status(200).json(sts);
    return;
  }

  const body = JSON.parse(req.body);
  if (req.method === 'POST') {
    await db.collection('subteams').add(body);
    res.status(200).end();
  }

  if (req.method === 'PUT') {
    const doc = db.collection('subteams').doc(id as string);
    await doc.update(body);
    res.status(200).end();
  }
  res.status(404).end();
};

export default subteams;
