import type { Fetcher } from 'swr';
import type { NextStepsCard } from '../../types/new-here';

import useSWR from 'swr';
import dayjs from 'dayjs';
import {
  ActionIcon,
  Anchor,
  Box,
  Center,
  Group,
  Loader,
  Menu,
  SegmentedControl,
  Table,
  Text,
  TextInput,
  Title,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Card } from '../../types/cards';

const fetcher: Fetcher<NextStepsCard[], string[]> = async (url: string) => {
  const res = await fetch(url);
  if (res.status !== 200) {
    throw new Error('An error occurred while fetching the cards');
  }
  return res.json();
};
export default function CardsPage() {
  const theme = useMantineTheme();
  const { data, error, isValidating, mutate } = useSWR(['/api/cards'], fetcher);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const rows = !data ? (
    <></>
  ) : (
    data.map((person) => {
      return (
        <tr>
          <td></td>
          <td>
            <Anchor href={'/'}></Anchor>
          </td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>
            <Anchor href={'/'}></Anchor>
          </td>
          <td></td>
          <td>
            <Menu></Menu>
          </td>
        </tr>
      );
    })
  );

  return (
    <>
      <Center style={{ width: '100%', marginTop: 80 }}>
        <Group direction="column" spacing="md" style={{ width: '80%' }}>
          <Box style={{ width: '100%' }}>
            <Group position="apart" style={{ width: '100%' }}>
              <Title order={3}>Personnel</Title>
              <TextInput
                placeholder="Search"
                style={{
                  width: 800,
                }}
                icon={<FontAwesomeIcon icon="search" />}
              />
              <span />
            </Group>
          </Box>
          <Box
            style={{
              overflowX: 'scroll',
              overflowY: 'scroll',
              maxHeight: 'calc(100vh - 300px)',
              width: '100%',
            }}
          >
            {data && !error && !isValidating && (
              <Table>
                <thead
                  style={{
                    top: 0,
                    zIndex: 2,
                    position: 'sticky',
                    backgroundColor:
                      colorScheme === 'dark'
                        ? theme.colors.dark[8]
                        : theme.colors.gray[1],
                  }}
                >
                  <tr>
                    <th>Name</th>
                    <th>Phone Num.</th>
                    <th>Address</th>
                    <th>Boxes</th>
                    <th>Gender</th>
                    <th>
                      <Group position="apart">
                        <Text size="sm">Host</Text>
                        <ActionIcon>
                          <FontAwesomeIcon icon="filter" />
                        </ActionIcon>
                      </Group>
                    </th>
                    <th>
                      <Group position="apart">
                        <Text size="sm">Date</Text>
                        <ActionIcon>
                          <FontAwesomeIcon icon="filter" />
                        </ActionIcon>
                      </Group>
                    </th>
                    <th>Email</th>
                    <th>DOB</th>
                    <th>Prayer Requests</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>{rows}</tbody>
              </Table>
            )}
            {isValidating && (
              <Center>
                <Loader />
              </Center>
            )}
          </Box>
        </Group>
      </Center>
    </>
  );
}
