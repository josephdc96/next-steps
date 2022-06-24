import type { Fetcher } from 'swr';
import type { NextPage } from 'next';
import type { Homepage } from '#/types/homepage';

import useSWR from 'swr';
import { useState } from 'react';
import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';
import {
  Alert,
  Button,
  Center,
  Group,
  Loader,
  ScrollArea,
  Space,
  Stack,
  Text,
  Title,
} from '@mantine/core';

import { Subteam } from '#/types/subteam';
import { Personnel } from '#/types/personnel';
import { UsrSession } from '#/lib/auth/contract';
import CardsListCard from '#/components/CardsPage/CardsList/CardsListCard';

const fetcher: Fetcher<Homepage, string[]> = async (url: string) => {
  const res = await fetch(url);
  if (res.status !== 200) {
    throw new Error('An error occurred while fetching the data');
  }
  return res.json();
};

const Home: NextPage = () => {
  const { data: session } = useSession();
  const { data, error, isValidating, mutate } = useSWR(
    ['/api/me/homepage'],
    fetcher,
  );

  return (
    <>
      <Center style={{ width: '100%', marginTop: 20 }}>
        <Group direction="column" spacing="xl" style={{ width: '80%' }}>
          {data && !error && !isValidating && (
            <>
              <Title order={1}>Welcome {data.user.firstName}!</Title>
              {data.leader && (
                <Title order={3}>
                  Your subteam leader is {data.leader.firstName}
                </Title>
              )}
              {data.assignment && (
                <Title order={3}>
                  Your current assignment is: {data.assignment.name}
                </Title>
              )}
              <Title order={2}>Recent Cards</Title>
              {data.recentCards.length > 0 && (
                <>
                  <ScrollArea
                    style={{ height: 'calc(100vh - 308px)' }}
                    offsetScrollbars
                    type="auto"
                  >
                    <Stack>
                      {data.recentCards.map((card) => (
                        <CardsListCard
                          key={`${card.name} ${card.date}`}
                          card={card}
                          refresh={mutate}
                        />
                      ))}
                    </Stack>
                  </ScrollArea>
                </>
              )}
              {data.recentCards.length === 0 && (
                <Alert color="blue" title="No data">
                  You have no recent cards assigned.
                </Alert>
              )}
            </>
          )}
          {isValidating && <Loader />}
          {error && (
            <Alert color="red" title="There was a problem">
              There was a problem loading your dashboard. Please try again
              later.
            </Alert>
          )}
        </Group>
      </Center>
    </>
  );
};

export default Home;
