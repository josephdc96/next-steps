import { NextApiRequest, NextApiResponse } from 'next';

const getCards = async (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).send([]);
}

export default getCards;