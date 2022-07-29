import {
  Box,
  Center,
  Loader,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Team } from '#/types/team';

export type TeamErrProps = {
  error: any;
  refresh: () => void;
};

export function NoTeams() {
  const theme = useMantineTheme();

  return (
    <Box p="xl">
      <Title order={5}>
        <FontAwesomeIcon
          icon="exclamation-triangle"
          color={theme.colors.yellow[5]}
        />
        <Text size="xs">No teams Available</Text>
      </Title>
    </Box>
  );
}

export function TeamErr({ error, refresh }: TeamErrProps) {
  const theme = useMantineTheme();

  return (
    <Box p="xl">
      <Title order={5}>
        <FontAwesomeIcon
          icon="exclamation-triangle"
          color={theme.colors.red[7]}
        />
        <Text size="xs">
          There was an error loading your teams. Please try again later
        </Text>
      </Title>
    </Box>
  );
}

export function LoadingTeams() {
  return (
    <Center>
      <Loader />
    </Center>
  );
}

export function sortTeams(left: Team, right: Team) {
  if (left.name > right.name) {
    return 1;
  }
  return -1;
}
