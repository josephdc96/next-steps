import type { Team } from '#/types/team';

import useSWR from 'swr';

export default function useOrgInfo() {
  return useSWR<Team[]>('/api/teams', async (input, init) => {
    const res = await fetch(input, init);
    if (res.ok) {
      return res.json();
    }
    throw new Error(res.statusText);
  });
}
