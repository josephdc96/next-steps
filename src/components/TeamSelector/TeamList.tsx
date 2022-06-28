import type { ReactElement } from 'react';
import type { CSSObject, MantineTheme } from '@mantine/core';
import type { Team } from '#/types/team';

import { Box, Button, Divider, useMantineTheme } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import useTeam from '#/lib/hooks/useTeam';

export type TeamListProps = {
  teams: Team[];
  maxItems: number;
};

export type TeamOptionProps = {
  label: string;
  id: string;
  selected?: boolean;
  selectTeam: (id: string) => void;
};

export type Styler = (theme: MantineTheme) => CSSObject;

export type RenderOverflow = (overflowItems: Team[]) => ReactElement | null;

export function TeamList({ teams, maxItems }: TeamListProps) {
  const { teamId, setTeamId } = useTeam();
  const visibleTeams = teams.slice(0, maxItems);
  return (
    <Box>
      {teams.map((option, index) => {
        const { name, id } = option;
        const selected = id === teamId;
        return (
          <div key={index}>
            <TeamOption
              selectTeam={setTeamId}
              selected={selected}
              id={id}
              label={name}
            />
            {index < visibleTeams.length - 1 && <Divider />}
          </div>
        );
      })}
    </Box>
  );
}

export function TeamOption({
  label,
  id,
  selected = false,
  selectTeam,
}: TeamOptionProps) {
  if (selected) {
    return (
      <Button
        variant="light"
        disabled={true}
        onClick={() => selectTeam(id)}
        leftIcon={<FontAwesomeIcon icon="check" />}
      >
        {label}
      </Button>
    );
  }
  return (
    <Button
      variant="subtle"
      onClick={() => selectTeam(id)}
      leftIcon={<FontAwesomeIcon icon="arrow-right" />}
    >
      {label}
    </Button>
  );
}
