import type { NextApiRequest, NextApiResponse } from 'next';

import { fmtCardsToCsv } from '#/lib/fmt/fmtCsv';
import { getCardsFromDb } from '#/lib/cards/getCards';

const generateCardCSV = async (req: NextApiRequest, res: NextApiResponse) => {
  const { sort, sortDirection, startDate, endDate, host, completed, boxes } =
    req.query;

  const cards = await getCardsFromDb({
    sort,
    sortDirection,
    startDate,
    endDate,
    host,
    completed,
    boxes,
  });

  const csv = await fmtCardsToCsv(cards);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader(
    'Content-Disposition',
    'attachment; filename="next-steps-cards.csv"',
  );
  res.status(200).send(csv);
};

export default generateCardCSV;
