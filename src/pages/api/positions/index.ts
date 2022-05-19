import type { NextApiRequest, NextApiResponse } from 'next';
import type { Position } from '../../../types/position';

import { Firestore } from '@google-cloud/firestore';


const getPositions = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  const db = new Firestore({
    projectId: 'next-steps-350612',
  });

  if (req.method === 'GET') {
    const snapshot = await db.collection('positions').get();
    const positions: Position[] = [];

    snapshot.forEach((position) => {
      const data = position.data();
      const p: Position = {
        ...data,
        id: position.id,
      } as Position;
      positions.push(p);
    });

    res.status(200).json(positions);
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

export default getPositions;
