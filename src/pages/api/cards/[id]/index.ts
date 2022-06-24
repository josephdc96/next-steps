import { NextApiRequest, NextApiResponse } from 'next';
import { Firestore } from '@google-cloud/firestore';
import { NextStepsCard } from '#/types/new-here';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  if (req.method !== 'DELETE') {
    res.status(404).end();
  }

  const db = new Firestore({
    projectId: 'next-steps-350612',
  });

  await db.doc(`/cards/${id}`).delete();
  res.status(200).end();
};

export default handler;
