import type { NextApiRequest, NextApiResponse } from 'next';
import getMonth from '#/lib/cards/getMonth';

const weeksCardData = async (req: NextApiRequest, res: NextApiResponse) => {
  const { year, month } = req.query;

  if (req.method !== 'GET') {
    res.status(404).end();
    return;
  }

  const monthMeta = await getMonth(
    parseInt(year as string, 10),
    parseInt(month as string, 10),
  );

  res.status(200).json(monthMeta);
};

export default weeksCardData;
