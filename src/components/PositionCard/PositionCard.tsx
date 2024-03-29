import type { Position } from '#/types/position';
import type { Personnel } from '#/types/personnel';

import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Center,
  Group,
  Loader,
  Stack,
  Text,
} from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Fetcher } from 'swr';
import useSWR from 'swr';
import useTeam from '#/lib/hooks/useTeam';

interface positionCardProps {
  position: Position;
  canEdit: boolean;
  edit(position: Position): void;
}

const fetcher: Fetcher<Personnel[], string[]> = async (url: string) => {
  const res = await fetch(url);
  if (res.status !== 200) {
    throw new Error('An error occurred while fetching the data');
  }
  return res.json();
};

export default function PositionCard({
  position,
  canEdit,
  edit,
}: positionCardProps) {
  const { teamId } = useTeam();
  const { data, error, isValidating } = useSWR(
    [`/api/assignments/teams/${teamId}/${position.id}/assignees`],
    fetcher,
  );

  return (
    <Card
      shadow="sm"
      p="lg"
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme === 'dark'
            ? theme.colors.dark[4]
            : theme.colors.gray[0],
      })}
    >
      <Stack spacing="md">
        <Group position="apart" style={{ width: '100%' }}>
          <Text size="xl">{position.name}</Text>
          {canEdit && (
            <Group spacing="xs">
              <Button compact variant="subtle" onClick={() => edit(position)}>
                <FontAwesomeIcon icon="edit" />
              </Button>
              <Button compact variant="subtle" color="red">
                <FontAwesomeIcon icon="trash" />
              </Button>
            </Group>
          )}
        </Group>
        <Text size="lg">Assignees</Text>
        {data && !isValidating && !error && (
          <>
            {data.map((assignee) => {
              return (
                <Text key={assignee.id} size="sm">
                  {`${assignee.firstName} ${assignee.lastName}`}
                </Text>
              );
            })}
          </>
        )}
        {isValidating && (
          <>
            <Center style={{ width: '100%' }}>
              <Loader />
            </Center>
          </>
        )}
      </Stack>
    </Card>
  );
}
