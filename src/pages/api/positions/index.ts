import type { NextApiRequest, NextApiResponse } from 'next';

import { Firestore } from '@google-cloud/firestore';

import { getPositions } from '#/lib/positions/positions';

const apiPositions = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  const db = new Firestore({
    projectId: 'next-steps-350612',
  });

  if (req.method === 'GET') {
    const positions = await getPositions();

    res.status(200).send(JSON.stringify(positions));
    return;
  }

  if (req.method === 'POST') {
    await db.collection('positions').add({ name: req.body });
    res.status(200).end();
    return;
  }

  if (req.method === 'PUT') {
    const doc = db.collection('positions').doc(id as string);
    await doc.update({ name: req.body });
    res.status(200).end();
    return;
  }

  res.status(404).end();
};

export default apiPositions;
