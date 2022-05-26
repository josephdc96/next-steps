import type { NextApiRequest, NextApiResponse } from 'next';
import type { Document } from '../../../../types/documents';

import { Firestore } from '@google-cloud/firestore';

const document = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (req.method !== 'GET') {
    res.status(404).end();
    return;
  }

  const db = new Firestore({
    projectId: 'next-steps-350612',
  });

  const snapshot = await db.doc(`/documents/${id}`).get();

  const doc = {
    ...snapshot.data(),
    id: snapshot.id,
  };

  res.status(200).send(doc);
};

export default document;
