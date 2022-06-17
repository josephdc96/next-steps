import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { Firestore } from '@google-cloud/firestore';

const completeCard = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id, status } = req.query;

  const session = await getSession({ req });
  if (!session) {
    res.status(401).end();
    return;
  }

  if (req.method !== 'PUT') {
    res.status(404).end();
    return;
  }

  const db = new Firestore({
    projectId: 'next-steps-350612',
  });

  const doc = db.collection('cards').doc(id as string);
  await doc.update({ completed: status === 'true' });
  res.status(200).end();
};

export default completeCard;
