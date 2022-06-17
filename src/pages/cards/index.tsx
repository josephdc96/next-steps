import type { Fetcher } from 'swr';
import type { Personnel } from '../../types/personnel';
import type { NextStepsCard } from '../../types/new-here';

import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import dayjs from 'dayjs';
import { DatePicker } from '@mantine/dates';
import {
  ActionIcon,
  Affix,
  Anchor,
  Box,
  Button,
  Card as MantineCard,
  Center,
  Checkbox,
  CheckboxGroup,
  Divider,
  Group,
  Loader,
  Menu,
  Modal,
  MultiSelect,
  Popover,
  ScrollArea,
  SegmentedControl,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
  Tooltip,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  GENDER_DISPLAY_RECORD,
  REASON_DISPLAY_RECORD,
  REASON_TRANSLATOR,
  Reasons,
} from '../../types/new-here';
import { Card } from '../../types/cards';
import { useMediaQuery, useViewportSize } from '@mantine/hooks';
import CardsListCard from '#/components/CardsPage/CardsList/CardsListCard';
import CreateCard from '#/components/CreateCard/CreateCard';

const fetcher: Fetcher<NextStepsCard[], string[]> = async (url: string) => {
  console.log(url);
  const res = await fetch(url);
  if (res.status !== 200) {
    throw new Error('An error occurred while fetching the cards');
  }
  return res.json();
};

const REASONS_VALUES = [
  { value: 'firstTime', label: REASON_DISPLAY_RECORD[Reasons.firstTime] },
  { value: 'followJesus', label: REASON_DISPLAY_RECORD[Reasons.followJesus] },
  { value: 'baptism', label: REASON_DISPLAY_RECORD[Reasons.baptism] },
  { value: 'membership', label: REASON_DISPLAY_RECORD[Reasons.membership] },
  { value: 'discipleship', label: REASON_DISPLAY_RECORD[Reasons.discipleship] },
  { value: 'serve', label: REASON_DISPLAY_RECORD[Reasons.serve] },
  { value: 'joinGroup', label: REASON_DISPLAY_RECORD[Reasons.joinGroup] },
];

export default function CardsPage() {
  const isMobile = useMediaQuery('(max-width: 800px)');
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();

  const [leaders, setLeaders] = useState<{ value: string; label: string }[]>(
    [],
  );

  const [createModalVisible, setCreateModalVisible] = useState(false);

  const [sort, setSort] = useState('name');
  const [sortDirection, setSortDirection] = useState('ascending');

  const [boxesFilter, setBoxesFilter] = useState<string[]>([]);
  const [hostFilter, setHostFilter] = useState<string[]>([]);
  const [startDate, setStartDate] = useState(new Date('01/01/2001'));
  const [endDate, setEndDate] = useState(new Date());
  const [completed, setCompleted] = useState(false);

  const [url, setUrl] = useState('/api/cards');

  const { data, error, isValidating, mutate } = useSWR([url], fetcher);

  useEffect(() => {
    fetch('/api/personnel/active').then((res) => {
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
    if (hostFilter.length > 0) {
      hostFilter.forEach((host) => {
        newUrl = `${newUrl}&host=${host}`;
      });
    }
    if (completed) {
      newUrl = `${newUrl}&completed=true`;
    }
    if (boxesFilter.length > 0) {
      boxesFilter.forEach((box) => {
        const boxEnum = REASON_TRANSLATOR[box];
        newUrl = `${newUrl}&boxes=${boxEnum}`;
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

  const changeSort = (sortName: string) => {
    if (sort === sortName) {
      if (sortDirection === 'ascending') setSortDirection('descending');
      if (sortDirection === 'descending') setSortDirection('ascending');
    } else {
      setSortDirection('ascending');
      setSort(sortName);
    }
  };

  return (
    <>
      <Center style={{ width: '100%', marginTop: 80 }}>
        <Group direction="column" spacing={40} style={{ width: '95%' }}>
          <Box style={{ width: '100%' }}>
            <Group position="apart" style={{ width: '100%' }} noWrap>
              <Title order={3}>Next Steps Cards</Title>
              <TextInput
                placeholder="Search"
                style={{
                  width: 800,
                  backgroundColor:
                    theme.colorScheme === 'dark'
                      ? theme.colors.dark[7]
                      : theme.white,
                }}
                icon={<FontAwesomeIcon icon="search" />}
              />
              <Group spacing="sm" noWrap>
                <Button
                  size="sm"
                  variant="subtle"
                  color="dark"
                  onClick={() => setCreateModalVisible(true)}
                >
                  <FontAwesomeIcon icon="plus" />
                </Button>
                <Button
                  size="sm"
                  variant="subtle"
                  color="dark"
                  onClick={() => mutate()}
                >
                  <FontAwesomeIcon icon="refresh" />
                </Button>
                <Menu
                  control={
                    <Button
                      size="sm"
                      variant="subtle"
                      color="dark"
                      leftIcon={<FontAwesomeIcon icon="sort" />}
                    >
                      Sort by
                    </Button>
                  }
                >
                  <Menu.Item
                    icon={
                      sortDirection === 'ascending' ? (
                        <FontAwesomeIcon icon="check" />
                      ) : undefined
                    }
                    onClick={() => setSortDirection('ascending')}
                  >
                    Ascending
                  </Menu.Item>
                  <Menu.Item
                    icon={
                      sortDirection === 'descending' ? (
                        <FontAwesomeIcon icon="check" />
                      ) : undefined
                    }
                    onClick={() => setSortDirection('descending')}
                  >
                    Descending
                  </Menu.Item>
                  <Divider />
                  <Menu.Item
                    icon={
                      sort === 'name' ? (
                        <FontAwesomeIcon icon="check" />
                      ) : undefined
                    }
                    onClick={() => setSort('name')}
                  >
                    Name
                  </Menu.Item>
                  <Menu.Item
                    icon={
                      sort === 'host' ? (
                        <FontAwesomeIcon icon="check" />
                      ) : undefined
                    }
                    onClick={() => setSort('host')}
                  >
                    Host
                  </Menu.Item>
                  <Menu.Item
                    icon={
                      sort === 'date' ? (
                        <FontAwesomeIcon icon="check" />
                      ) : undefined
                    }
                    onClick={() => setSort('date')}
                  >
                    Date
                  </Menu.Item>
                  <Menu.Item
                    icon={
                      sort === 'completed' ? (
                        <FontAwesomeIcon icon="check" />
                      ) : undefined
                    }
                    onClick={() => setSort('completed')}
                  >
                    Completed
                  </Menu.Item>
                </Menu>
                <Button
                  size="sm"
                  variant="filled"
                  color="green"
                  leftIcon={<FontAwesomeIcon icon="file-excel" />}
                >
                  Export
                </Button>
              </Group>
            </Group>
          </Box>
          <Group
            direction="row"
            spacing="xl"
            style={{ alignItems: 'flex-start', width: '100%' }}
            noWrap
          >
            <ScrollArea
              offsetScrollbars
              style={{
                minWidth: 250,
                width: 250,
                height: 'calc(100vh - 236px)',
              }}
            >
              <MantineCard
                style={{
                  backgroundColor:
                    colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
                }}
              >
                <Stack>
                  <Title order={4}>Filters</Title>
                  <Divider />
                  <ScrollArea style={{ height: 400 }}>
                    <CheckboxGroup
                      label="Hosts"
                      value={hostFilter}
                      orientation="vertical"
                      onChange={(value) => setHostFilter(value)}
                    >
                      {leaders.map((leader) => (
                        <Checkbox
                          key={`chk_${leader.value}`}
                          label={leader.label}
                          value={leader.value}
                        />
                      ))}
                    </CheckboxGroup>
                  </ScrollArea>
                  <Divider />
                  <CheckboxGroup
                    label="Reasons"
                    value={boxesFilter}
                    onChange={setBoxesFilter}
                    orientation="vertical"
                  >
                    {REASONS_VALUES.map((reason) => (
                      <Checkbox
                        key={`chk_${reason.value}`}
                        label={reason.label}
                        value={reason.value}
                      />
                    ))}
                  </CheckboxGroup>
                  <Divider />
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
                  <Divider />
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
              </MantineCard>
            </ScrollArea>
            <ScrollArea
              offsetScrollbars
              style={{
                height: 'calc(100vh - 236px)',
                flexGrow: 1,
              }}
            >
              {data && !error && !isValidating && (
                <Stack>
                  {data.map((card) => (
                    <CardsListCard
                      key={`${card.name}${card.date.toString()}`}
                      card={card}
                      refresh={() => mutate()}
                    />
                  ))}
                </Stack>
              )}
              {isValidating && (
                <Center>
                  <Loader />
                </Center>
              )}
            </ScrollArea>
          </Group>
        </Group>
      </Center>
      <Modal
        opened={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        title="Add Card"
        size="xl"
      >
        <CreateCard onSubmit={() => setCreateModalVisible(false)} />
      </Modal>
    </>
  );
}
