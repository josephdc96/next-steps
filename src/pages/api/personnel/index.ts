import type { NextApiRequest, NextApiResponse } from 'next';

import { Firestore } from '@google-cloud/firestore';

const createPersonnel = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (req.method !== 'POST' && req.method !== 'PUT') {
    res.status(404);
    return;
  }

  const db = new Firestore({
    projectId: 'next-steps-350612',
  });

  const body = JSON.parse(req.body);
  body.signedCommitment = new Date(body.signedCommitment);
  body.ltClass = new Date(body.ltClass);
  body.commitedThru = new Date(body.commitedThru);
  body.birthday = new Date(body.birthday);

  if (req.method === 'POST') {
    await db.collection('personnel').add(body);
    res.status(200).end();
  }

  if (req.method === 'PUT') {
    const doc = db.collection('personnel').doc(id as string);
    await doc.update(body);
    res.status(200).end();
  }

  res.status(418).end();
};

export default createPersonnel;
