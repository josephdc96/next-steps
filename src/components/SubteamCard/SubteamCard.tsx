import type { Fetcher } from 'swr';
import type { Subteam } from '../../types/subteam';
import type { Personnel } from '../../types/personnel';

import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { Button, Card, Center, Group, Loader, Text } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface subteamCardProps {
  subteam: Subteam;
  canEdit: boolean;
  edit(subteam: Subteam): void;
}

const fetcher: Fetcher<Personnel[], string[]> = async (url: string) => {
  const res = await fetch(url);
  if (res.status !== 200) {
    throw new Error('An error occurred while fetching the data');
  }
  return res.json();
};

export default function SubteamCard({
  subteam,
  canEdit,
  edit,
}: subteamCardProps) {
  const {
    data: leaders,
    error: leaderError,
    isValidating: leaderValidating,
  } = useSWR(
    [`/api/personnel/active/leaders?leaders=${subteam.leaders}`],
    fetcher,
  );
  const {
    data: members,
    error: memberError,
    isValidating: memberValidating,
  } = useSWR(
    [`/api/personnel/teams/members?leaders=${subteam.leaders}`],
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
      <Group direction="column" spacing="md">
        <Group position="apart" style={{ width: '100%' }}>
          <Text size="xl">{subteam.name}</Text>
          {canEdit && (
            <Group spacing="xs">
              <Button variant="subtle" onClick={() => edit(subteam)}>
                <FontAwesomeIcon icon="edit" />
              </Button>
              <Button variant="subtle" color="red">
                <FontAwesomeIcon icon="trash" />
              </Button>
            </Group>
          )}
        </Group>
        {leaders &&
          !leaderValidating &&
          !leaderError &&
          members &&
          !memberValidating &&
          !memberError && (
            <>
              <Text size="lg">Leaders</Text>
              {leaders.map((leader) => {
                return (
                  <Text
                    key={leader.id}
                    size="sm"
                  >{`${leader.firstName} ${leader.lastName}`}</Text>
                );
              })}
              <Text size="lg">Members</Text>
              {members.map((member) => {
                return (
                  <Text
                    key={member.id}
                    size="sm"
                  >{`${member.firstName} ${member.lastName}`}</Text>
                );
              })}
            </>
          )}
        {(leaderValidating || memberValidating) && (
          <>
            <Center style={{ width: '100%' }}>
              <Loader />
            </Center>
          </>
        )}
      </Group>
    </Card>
  );
}
