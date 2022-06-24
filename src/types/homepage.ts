import type { Position } from '#/types/position';
import type { Personnel } from '#/types/personnel';
import type { NextStepsCard } from '#/types/new-here';

export interface Homepage {
  user: Personnel;
  leader?: Personnel;
  assignment?: Position;
  recentCards: NextStepsCard[];
}
