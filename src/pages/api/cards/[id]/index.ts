import type { NextApiRequest, NextApiResponse } from 'next';
import { Firestore } from '@google-cloud/firestore';
import { NextStepsCard } from '#/types/new-here';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  if (req.method !== 'DELETE' && req.method !== 'PUT') {
    res.status(404).end();
  }

  const db = new Firestore({
    projectId: 'next-steps-350612',
  });

  if (req.method === 'DELETE') {
    await db.doc(`/cards/${id}`).delete();
    res.status(200).end();
    return;
  }

  if (req.method === 'PUT') {
    const body = JSON.parse(req.body);
    body.dob = new Date(body.dob);
    body.date = new Date(body.date);

    const doc = db.collection('cards').doc(id as string);
    await doc.update(body);
    res.status(200).end();
    return;
  }

  res.status(418).end();
};

export default handler;
