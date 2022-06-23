import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { hasRoles } from '#/lib/auth/authn';
import {
  getSingleUserByAuth0,
  getSingleUserById,
} from '#/lib/personnel/single';
import type { UsrSession } from '#/lib/auth/contract';
import { getCardsFromDb } from '#/lib/cards/getCards';
import { getPosition } from '#/lib/positions/positions';
import type { Homepage } from '#/types/homepage';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (hasRoles(session)) {
    const user = await getSingleUserByAuth0(
      (session as UsrSession).id as string,
    );
    const leader = user.leader
      ? await getSingleUserById(user.leader)
      : undefined;
    const assignment = user.currentMonthAssign
      ? await getPosition(user.currentMonthAssign)
      : undefined;
    const recentCards = await getCardsFromDb({
      sort: 'name',
      sortDirection: 'ascending',
      startDate: new Date(
        new Date().setDate(new Date().getDate() - 30),
      ).toISOString(),
      endDate: new Date().toISOString(),
      host: user.id,
    });
    const page: Homepage = {
      user,
      leader,
      assignment,
      recentCards,
    };
    res.status(200).send(page);
  }
  res.status(403).end();
};

export default handler;
