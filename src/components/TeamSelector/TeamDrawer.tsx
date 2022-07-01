import type { Team } from '#/types/team';

import { Box, Button, Drawer, Title, useMantineTheme } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import useTeam from '#/lib/hooks/useTeam';
import useOrgInfo from '#/lib/hooks/useOrgInfo';
import { TeamList } from '#/components/TeamSelector/TeamList';
import {
  LoadingTeams,
  NoTeams,
  TeamErr,
} from '#/components/TeamSelector/shared';

export default function TeamDrawer() {
  const { drawerOpened, closeDrawer } = useTeam();

  return (
    <Drawer opened={drawerOpened} onClose={closeDrawer}>
      <TenantResults />
    </Drawer>
  );
}

function TenantResults() {
  const { data, error, mutate, isValidating } = useOrgInfo();

  if (error) {
    return <TeamErr error={error} refresh={mutate} />;
  }

  if (data) {
    if (!isValidating) {
      const teams = data as Team[];
      if (teams && teams.length) {
        return (
          <Box>
            <TeamsTitle />
            <TeamList teams={teams} maxItems={10} />
          </Box>
        );
      }
      return <NoTeams />;
    }
  }
  return <LoadingTeams />;
}

function TeamsTitle() {
  return (
    <Title order={5} my="xs">
      Select Tenant
    </Title>
  );
}
