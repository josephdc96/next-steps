import type { NextApiRequest, NextApiResponse } from 'next';
import type { UsrSession } from '#/lib/auth/contract';

import { getSession } from 'next-auth/react';

import { getAssignees } from '#/lib/assignments/getAssignees';

const assignees = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id, team } = req.query;

  if (req.method !== 'GET') {
    res.status(404);
    return;
  }

  const session = await getSession({ req });
  if (!session || !(session as UsrSession).teams.includes(team as string)) {
    res.status(404).end();
    return;
  }

  const people = await getAssignees(id as string, team as string);

  res.status(200).json(people);
};

export default assignees;
