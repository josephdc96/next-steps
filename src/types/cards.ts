export interface Cards {
  date: Date;
  total: number;
  male: number;
  female: number;
  baptism: number;
  discipleship: number;
  firstTime: number;
  followJesus: number;
  groupConnect: number;
  membership: number;
  serve: number;
  unmarked: number;
}

export interface Card {
  date: Date;
  total: number;
  male: number;
  female: number;
  baptism: number;
  discipleship: number;
  firstTime: number;
  followJesus: number;
  groupConnect: number;
  membership: number;
  serve: number;
  unmarked: number;
}

export interface MonthMeta {
  total: CardCategoryMeta;
  average: CardCategoryMeta;
  male: CardCategoryMeta;
  female: CardCategoryMeta;
  baptism: CardCategoryMeta;
  discipleship: CardCategoryMeta;
  firstTime: CardCategoryMeta;
  followJesus: CardCategoryMeta;
  groupConnect: CardCategoryMeta;
  membership: CardCategoryMeta;
  serve: CardCategoryMeta;
  unmarked: CardCategoryMeta;
}

export interface CardCategoryMeta {
  total: number;
  increase: number;
}

export function initializeMeta(): MonthMeta {
  return {
    total: {
      total: 0,
      increase: 0,
    },
    average: {
      total: 0,
      increase: 0,
    },
    male: {
      total: 0,
      increase: 0,
    },
    female: {
      total: 0,
      increase: 0,
    },
    baptism: {
      total: 0,
      increase: 0,
    },
    discipleship: {
      total: 0,
      increase: 0,
    },
    firstTime: {
      total: 0,
      increase: 0,
    },
    followJesus: {
      total: 0,
      increase: 0,
    },
    groupConnect: {
      total: 0,
      increase: 0,
    },
    membership: {
      total: 0,
      increase: 0,
    },
    serve: {
      total: 0,
      increase: 0,
    },
    unmarked: {
      total: 0,
      increase: 0,
    },
  };
}
