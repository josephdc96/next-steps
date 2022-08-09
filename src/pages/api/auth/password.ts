import type { NextApiRequest, NextApiResponse } from 'next';

import { getSingleUserByEmail } from '#/lib/personnel/single';
import { connectToDatabase } from '#/lib/mongo/conn';

const passwordReset = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { email, code } = req.query;
    const p = await getSingleUserByEmail(email as string);
    if (
      !p.activationCode ||
      p.activationCode !== code ||
      (p.codeExpires && p.codeExpires < new Date())
    ) {
      res.status(403).end();
    } else {
      res.status(200).send(p);
    }
  } else if (req.method === 'POST') {
    const { email, code } = req.query;
    const p = await getSingleUserByEmail(email as string);
    if (
      !p.activationCode ||
      p.activationCode !== code ||
      (p.codeExpires && p.codeExpires < new Date())
    ) {
      res.status(403).end();
    } else {
      const passwd = req.body;
      const { db } = await connectToDatabase();

      const doc = await db
        .collection('personnel')
        .updateOne(
          { email },
          { $set: { password: passwd, activationCode: null } },
        );
      res.status(200).end();
    }
  } else {
    res.status(404).end();
  }
};

export default passwordReset;
