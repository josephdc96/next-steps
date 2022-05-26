import type { NextApiRequest, NextApiResponse } from 'next';
import type { Document } from '../../../types/documents';

import { Firestore } from '@google-cloud/firestore';

const documents = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(404).end();
    return;
  }

  const db = new Firestore({
    projectId: 'next-steps-350612',
  });

  if (req.method === 'POST') {
    const body: Document = JSON.parse(req.body);

    res.status(200).end();
    return;
  }

  const snapshot = await db.collection('documents').get();

  const docs: Document[] = [];
  snapshot.forEach((document) => {
    const data = document.data();
    const newDoc = {
      ...data,
      id: document.id,
    } as Document;
    docs.push(newDoc);
  });
  res.status(200).send(docs);
};

export default documents;
