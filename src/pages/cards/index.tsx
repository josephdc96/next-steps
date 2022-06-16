import type { Fetcher } from 'swr';
import type { Personnel } from '../../types/personnel';
import type { NextStepsCard } from '../../types/new-here';

import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import dayjs from 'dayjs';
import {
  ActionIcon,
  Anchor,
  Box,
  Button,
  Center,
  CheckboxGroup,
  Group,
  Loader,
  Menu,
  MultiSelect,
  Popover,
  SegmentedControl,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  GENDER_DISPLAY_RECORD,
  REASON_DISPLAY_RECORD,
  Reasons,
} from '../../types/new-here';
import { Card } from '../../types/cards';
import { DatePicker } from '@mantine/dates';

const fetcher: Fetcher<NextStepsCard[], string[]> = async (url: string) => {
  console.log(url);
  const res = await fetch(url);
  if (res.status !== 200) {
    throw new Error('An error occurred while fetching the cards');
  }
  return res.json();
};

interface RowProps {
  card: NextStepsCard;
}

const REASONS_VALUES = [
  { value: 'firstTime', label: REASON_DISPLAY_RECORD[Reasons.firstTime] },
  { value: 'followJesus', label: REASON_DISPLAY_RECORD[Reasons.followJesus] },
  { value: 'baptism', label: REASON_DISPLAY_RECORD[Reasons.baptism] },
  { value: 'membership', label: REASON_DISPLAY_RECORD[Reasons.membership] },
  { value: 'discipleship', label: REASON_DISPLAY_RECORD[Reasons.discipleship] },
  { value: 'serve', label: REASON_DISPLAY_RECORD[Reasons.serve] },
  { value: 'joinGroup', label: REASON_DISPLAY_RECORD[Reasons.joinGroup] },
];

function CardTableRow({ card }: RowProps) {
  const [host, setHost] = useState('');
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!card.whoHelped) {
      setHost(card.otherHelp || '?');
      return;
    }

    fetch(`/api/personnel/active/${card.whoHelped}`).then((x) =>
      x.json().then((person: Personnel) => {
        setHost(`${person.firstName} ${person.lastName}`);
      }),
    );
  }, [card]);

  return (
    <tr>
      <td>{card.name}</td>
      <td>{card.phoneNum}</td>
      <td>
        <Stack spacing={0}>
          <Text size="sm">{card.address}</Text>
          <Text size="sm">{`${card.city}, ${card.state} ${card.zip}`}</Text>
        </Stack>
      </td>
      <td>
        <Stack spacing={0}>
          {card.reasons.map((reason) => (
            <Text
              key={`${card.name}${card.date.toString()}${reason}`}
              size="sm"
            >
              {REASON_DISPLAY_RECORD[reason]}
            </Text>
          ))}
        </Stack>
      </td>
      <td>{GENDER_DISPLAY_RECORD[card.gender]}</td>
      <td>
        <>
          {host === '' && <Loader size="sm" />}
          {host !== '' && <Text size="sm">{host}</Text>}
        </>
      </td>
      <td>{dayjs(card.date).format('MM/DD/YYYY')}</td>
      <td>{card.email}</td>
      <td>{dayjs(card.dob).format('MM/DD/YYYY')}</td>
      <td>{card.prayerRequests}</td>
      <td>
        <Group spacing="xs">
          <ActionIcon
            color={completed ? 'green' : undefined}
            variant={completed ? 'filled' : undefined}
            onClick={() => setCompleted(!completed)}
          >
            <FontAwesomeIcon icon="check" />
          </ActionIcon>
          <Menu>
            <Menu.Item>Item</Menu.Item>
          </Menu>
        </Group>
      </td>
    </tr>
  );
}

export default function CardsPage() {
  const theme = useMantineTheme();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const { data: session } = useSession();

  const [leaders, setLeaders] = useState<{ value: string; label: string }[]>(
    [],
  );

  const [sort, setSort] = useState('name');
  const [sortDirection, setSortDirection] = useState('ascending');

  const [filterOpen, setFilterOpen] = useState(false);
  const [boxesFilter, setBoxesFilter] = useState<string[]>([]);
  const [hostFilter, setHostFilter] = useState(
    ((session?.user as any | undefined)?.id as string) || '',
  );
  const [startDate, setStartDate] = useState(
    new Date('01/01/2001'),
  );
  const [endDate, setEndDate] = useState(new Date());
  const [completed, setCompleted] = useState(false);

  const [url, setUrl] = useState('/api/cards');

  const { data, error, isValidating, mutate } = useSWR([url], fetcher);

  useEffect(() => {
    fetch('/api/personnel/active/leaders').then((res) => {
      res.json().then((json) => {
        const data: any[] = [];

        json.forEach((leader: Personnel) => {
          data.push({
            value: leader.id,
            label: `${leader.firstName} ${leader.lastName}`,
          });
        });
        data.push({ value: 'other', label: 'Other' });

        setLeaders(data);
      });
    });

    let newUrl = `/api/cards?sort=${sort}&sortDirection=${sortDirection}`;
    newUrl = `${newUrl}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
    if (hostFilter !== '') {
      newUrl = `${newUrl}&host=${hostFilter}`;
    }
    if (completed) {
      newUrl = `${newUrl}&completed=true`;
    }
    if (boxesFilter.length > 0) {
      boxesFilter.forEach((box) => {
        newUrl = `${newUrl}&boxes=${box}`;
      });
    }
    setUrl(newUrl);
  }, [
    sort,
    sortDirection,
    boxesFilter,
    hostFilter,
    startDate,
    endDate,
    completed,
  ]);

  const FilterPopover = () => {
    return (
      <Box>
        <Stack>
          <Select
            data={leaders}
            label="Host"
            value={hostFilter}
            clearable
            onChange={(value) => setHostFilter(value || '')}
          />
          <MultiSelect
            value={boxesFilter}
            data={REASONS_VALUES}
            label="Reasons"
            onChange={setBoxesFilter}
          />
          <DatePicker
            value={startDate}
            onChange={(date) => setStartDate(date || new Date())}
            clearable={false}
            label="Start Date"
          />
          <DatePicker
            value={endDate}
            onChange={(date) => setEndDate(date || new Date())}
            clearable={false}
            label="End Date"
          />
          <SegmentedControl
            data={[
              { value: 'complete', label: 'Completed' },
              { value: 'all', label: 'All' },
            ]}
            value={completed ? 'complete' : 'all'}
            onChange={(value) => {
              setCompleted(value === 'complete');
            }}
          />
        </Stack>
      </Box>
    );
  };

  const changeSort = (sortName: string) => {
    if (sort === sortName) {
      if (sortDirection === 'ascending') setSortDirection('descending');
      if (sortDirection === 'descending') setSortDirection('ascending');
    } else {
      setSortDirection('ascending');
      setSort(sortName);
    }
  };

  const rows = !data ? (
    <></>
  ) : (
    data.map((card) => {
      return (
        <CardTableRow key={`${card.name}${card.date.toString()}`} card={card} />
      );
    })
  );

  return (
    <>
      <Center style={{ width: '100%', marginTop: 80 }}>
        <Group direction="column" spacing="md" style={{ width: '80%' }}>
          <Box style={{ width: '100%' }}>
            <Group position="apart" style={{ width: '100%' }}>
              <Title order={3}>Next Steps Cards</Title>
              <TextInput
                placeholder="Search"
                style={{
                  width: 800,
                }}
                icon={<FontAwesomeIcon icon="search" />}
              />
              <Group spacing="sm">
                <Button variant="subtle" color="dark" onClick={() => mutate()}>
                  <FontAwesomeIcon icon="refresh" />
                </Button>
                <Popover
                  opened={filterOpen}
                  onClose={() => setFilterOpen(false)}
                  position="bottom"
                  placement="end"
                  withCloseButton
                  title="Filter"
                  target={
                    <Button
                      variant="subtle"
                      color="dark"
                      onClick={() => setFilterOpen(!filterOpen)}
                    >
                      <FontAwesomeIcon icon="filter" />
                    </Button>
                  }
                >
                  <FilterPopover />
                </Popover>
              </Group>
            </Group>
          </Box>
          <Box
            style={{
              overflowX: 'auto',
              overflowY: 'auto',
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
                    <th>
                      <Group position="apart">
                        <Text size="sm">Name</Text>
                        <ActionIcon onClick={() => changeSort('name')}>
                          <FontAwesomeIcon
                            icon={
                              // eslint-disable-next-line no-nested-ternary
                              sort !== 'name'
                                ? 'sort'
                                : sortDirection === 'ascending'
                                ? 'sort-asc'
                                : 'sort-desc'
                            }
                          />
                        </ActionIcon>
                      </Group>
                    </th>
                    <th>
                      <Group position="apart">
                        <Text size="sm">Phone Num.</Text>
                        <ActionIcon onClick={() => changeSort('phonenum')}>
                          <FontAwesomeIcon
                            icon={
                              // eslint-disable-next-line no-nested-ternary
                              sort !== 'phonenum'
                                ? 'sort'
                                : sortDirection === 'ascending'
                                ? 'sort-up'
                                : 'sort-desc'
                            }
                          />
                        </ActionIcon>
                      </Group>
                    </th>
                    <th>
                      <Group position="apart">
                        <Text size="sm">Address</Text>
                        <ActionIcon onClick={() => changeSort('address')}>
                          <FontAwesomeIcon
                            icon={
                              // eslint-disable-next-line no-nested-ternary
                              sort !== 'address'
                                ? 'sort'
                                : sortDirection === 'ascending'
                                ? 'sort-up'
                                : 'sort-desc'
                            }
                          />
                        </ActionIcon>
                      </Group>
                    </th>
                    <th>Boxes</th>
                    <th>
                      <Group position="apart">
                        <Text size="sm">Gender</Text>
                        <ActionIcon onClick={() => changeSort('gender')}>
                          <FontAwesomeIcon
                            icon={
                              // eslint-disable-next-line no-nested-ternary
                              sort !== 'gender'
                                ? 'sort'
                                : sortDirection === 'ascending'
                                ? 'sort-up'
                                : 'sort-desc'
                            }
                          />
                        </ActionIcon>
                      </Group>
                    </th>
                    <th>
                      <Group position="apart">
                        <Text size="sm">Host</Text>
                        <ActionIcon onClick={() => changeSort('host')}>
                          <FontAwesomeIcon
                            icon={
                              // eslint-disable-next-line no-nested-ternary
                              sort !== 'host'
                                ? 'sort'
                                : sortDirection === 'ascending'
                                ? 'sort-up'
                                : 'sort-desc'
                            }
                          />
                        </ActionIcon>
                      </Group>
                    </th>
                    <th>
                      <Group position="apart">
                        <Text size="sm">Date</Text>
                        <ActionIcon onClick={() => changeSort('date')}>
                          <FontAwesomeIcon
                            icon={
                              // eslint-disable-next-line no-nested-ternary
                              sort !== 'date'
                                ? 'sort'
                                : sortDirection === 'ascending'
                                ? 'sort-up'
                                : 'sort-desc'
                            }
                          />
                        </ActionIcon>
                      </Group>
                    </th>
                    <th>
                      <Group position="apart">
                        <Text size="sm">Email</Text>
                        <ActionIcon onClick={() => changeSort('email')}>
                          <FontAwesomeIcon
                            icon={
                              // eslint-disable-next-line no-nested-ternary
                              sort !== 'email'
                                ? 'sort'
                                : sortDirection === 'ascending'
                                ? 'sort-up'
                                : 'sort-desc'
                            }
                          />
                        </ActionIcon>
                      </Group>
                    </th>
                    <th>
                      <Group position="apart">
                        <Text size="sm">DOB</Text>
                        <ActionIcon onClick={() => changeSort('dob')}>
                          <FontAwesomeIcon
                            icon={
                              // eslint-disable-next-line no-nested-ternary
                              sort !== 'dob'
                                ? 'sort'
                                : sortDirection === 'ascending'
                                ? 'sort-up'
                                : 'sort-desc'
                            }
                          />
                        </ActionIcon>
                      </Group>
                    </th>
                    <th>
                      <Group position="apart">
                        <Text size="sm">Prayer Requests</Text>
                        <ActionIcon onClick={() => changeSort('requests')}>
                          <FontAwesomeIcon
                            icon={
                              // eslint-disable-next-line no-nested-ternary
                              sort !== 'requests'
                                ? 'sort'
                                : sortDirection === 'ascending'
                                ? 'sort-up'
                                : 'sort-desc'
                            }
                          />
                        </ActionIcon>
                      </Group>
                    </th>
                    <th>
                      <Group position="apart">
                        <Text size="sm">Actions</Text>
                        <ActionIcon onClick={() => changeSort('actions')}>
                          <FontAwesomeIcon
                            icon={
                              // eslint-disable-next-line no-nested-ternary
                              sort !== 'actions'
                                ? 'sort'
                                : sortDirection === 'ascending'
                                ? 'sort-up'
                                : 'sort-desc'
                            }
                          />
                        </ActionIcon>
                      </Group>
                    </th>
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
