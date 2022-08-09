import type { Fetcher } from 'swr';
import type { Personnel } from '../../types/personnel';
import type { FilterValues, NextStepsCard } from '../../types/new-here';

import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import dayjs from 'dayjs';
import { useMediaQuery, useViewportSize } from '@mantine/hooks';
import { DatePicker } from '@mantine/dates';
import {
  ActionIcon,
  Affix,
  Alert,
  Anchor,
  Box,
  Button,
  Card as MantineCard,
  Center,
  Checkbox,
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

import { MobileHeader } from '#/components/MobileHeader/MobileHeader';
import CreateCard from '#/components/CreateCard/CreateCard';
import CardsListCard from '#/components/CardsPage/CardsList/CardsListCard';

import { REASON_TRANSLATOR } from '#/types/new-here';

import { HeaderButton } from '#/components/MobileHeader/HeaderButton';
import { FilterPanel } from '#/components/CardsPage/FilterPanel/FilterPanel';

const fetcher: Fetcher<NextStepsCard[], string[]> = async (url: string) => {
  const res = await fetch(url);
  if (res.status !== 200) {
    throw new Error('An error occurred while fetching the cards');
  }
  return res.json();
};

export default function CardsPage() {
  const isMobile = useMediaQuery('(max-width: 1200px)');
  const is1000 = useMediaQuery('(max-width: 1000px)');
  const is300 = useMediaQuery('(max-width: 350px)');
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editCard, setEditCard] = useState<NextStepsCard | undefined>(
    undefined,
  );

  const [filterOpen, setFilterOpen] = useState(false);
  const [leaders, setLeaders] = useState<{ value: string; label: string }[]>(
    [],
  );
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 6)),
  );
  const [endDate, setEndDate] = useState(new Date());
  const [hostFilter, setHostFilter] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);
  const [boxesFilter, setBoxesFilter] = useState<string[]>([]);

  const [sort, setSort] = useState('name');
  const [sortDirection, setSortDirection] = useState('ascending');

  const [url, setUrl] = useState('/api/cards');
  const [csv, setCsv] = useState('/api/cards/csv');

  const { data, error, isValidating, mutate } = useSWR([url], fetcher);

  useEffect(() => {
    fetch('/api/personnel/active?include_admin=true').then((res) => {
      res.json().then((json) => {
        const data2: any[] = [];

        json.forEach((leader: Personnel) => {
          data2.push({
            value: leader.id,
            label: `${leader.firstName} ${leader.lastName}`,
          });
        });
        data2.push({ value: 'other', label: 'Other' });

        setLeaders(data2);
      });
    });

    let newUrl = `/api/cards?sort=${sort}&sortDirection=${sortDirection}`;
    newUrl = `${newUrl}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
    let newCsv = `/api/cards/csv?sort=${sort}&sortDirection=${sortDirection}`;
    newCsv = `${newCsv}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
    if (hostFilter.length > 0) {
      hostFilter.forEach((host) => {
        newUrl = `${newUrl}&host=${host}`;
        newCsv = `${newCsv}&host=${host}`;
      });
    }
    if (completed) {
      newUrl = `${newUrl}&completed=true`;
      newCsv = `${newCsv}&completed=true`;
    }
    if (boxesFilter.length > 0) {
      boxesFilter.forEach((box) => {
        const boxEnum = REASON_TRANSLATOR[box];
        newUrl = `${newUrl}&boxes=${boxEnum}`;
        newCsv = `${newCsv}&boxes=${boxEnum}`;
      });
    }
    setUrl(newUrl);
    setCsv(newCsv);
  }, [
    sort,
    sortDirection,
    boxesFilter,
    hostFilter,
    startDate,
    endDate,
    completed,
  ]);

  return (
    <>
      <MobileHeader
        center={
          !is300 ? (
            <Tooltip
              label="Coming Soon"
              style={{ maxWidth: 800, width: '40%' }}
            >
              <TextInput
                placeholder="Search"
                disabled
                style={{
                  backgroundColor:
                    theme.colorScheme === 'dark'
                      ? theme.colors.dark[7]
                      : theme.white,
                }}
                icon={<FontAwesomeIcon icon="search" />}
              />
            </Tooltip>
          ) : undefined
        }
        right={
          is1000 ? (
            <Group spacing="sm" noWrap>
              {is300 && <HeaderButton icon="search" caption="Search" />}
              <HeaderButton
                icon="filter"
                caption="Filter"
                onClick={() => setFilterOpen(!filterOpen)}
              />
              <Menu>
                <Menu.Target>
                  <Button radius="xl">
                    <FontAwesomeIcon icon="ellipsis-vertical" />
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    icon={<FontAwesomeIcon icon="plus" />}
                    onClick={() => {
                      setEditCard(undefined);
                      setIsEdit(false);
                      setCreateModalVisible(true);
                    }}
                  >
                    Add Card
                  </Menu.Item>
                  <Menu.Item
                    icon={<FontAwesomeIcon icon="refresh" />}
                    onClick={() => mutate()}
                  >
                    Refresh
                  </Menu.Item>
                  <Menu.Item
                    icon={<FontAwesomeIcon icon="file-excel" />}
                    component="a"
                    href={csv}
                    color="green"
                  >
                    Export
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Label>Sort Direction</Menu.Label>
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
                  <Menu.Divider />
                  <Menu.Label>Sort</Menu.Label>
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
                </Menu.Dropdown>
              </Menu>
            </Group>
          ) : (
            <Group spacing="sm" noWrap>
              <Button
                size="sm"
                variant="subtle"
                color="dark"
                onClick={() => {
                  setEditCard(undefined);
                  setIsEdit(false);
                  setCreateModalVisible(true);
                }}
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
              <Menu>
                <Menu.Target>
                  <Button
                    size="sm"
                    variant="subtle"
                    color="dark"
                    leftIcon={<FontAwesomeIcon icon="sort" />}
                  >
                    Sort by
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
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
                  <Menu.Divider />
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
                </Menu.Dropdown>
              </Menu>
              <Button
                size="sm"
                variant="filled"
                color="green"
                component="a"
                href={csv}
                leftIcon={<FontAwesomeIcon icon="file-excel" />}
              >
                Export
              </Button>
            </Group>
          )
        }
      />
      <Center style={{ width: '100%', marginTop: 20 }}>
        <Stack spacing={40} style={{ width: '95%' }}>
          <Box style={{ width: '100%' }}>
            <Group position="apart" style={{ width: '100%' }} noWrap>
              <Title order={3}>Next Steps Cards</Title>
            </Group>
          </Box>
          <Group
            spacing="xl"
            style={{ alignItems: 'flex-start', width: '100%' }}
            noWrap
          >
            {!is1000 && (
              <ScrollArea
                offsetScrollbars
                type="auto"
                style={{
                  minWidth: 250,
                  width: 250,
                  height: 'calc(100vh - 256px)',
                }}
              >
                <MantineCard
                  style={{
                    backgroundColor:
                      colorScheme === 'dark'
                        ? theme.colors.dark[7]
                        : theme.white,
                  }}
                >
                  <FilterPanel
                    leaders={leaders}
                    values={{
                      startDate,
                      endDate,
                      completed,
                      boxes: boxesFilter,
                      hosts: hostFilter,
                    }}
                    apply={(values) => {
                      setStartDate(values.startDate);
                      setEndDate(values.endDate);
                      setCompleted(values.completed);
                      setBoxesFilter(values.boxes);
                      setHostFilter(values.hosts);
                      mutate();
                      setFilterOpen(false);
                    }}
                  />
                </MantineCard>
              </ScrollArea>
            )}
            <ScrollArea
              offsetScrollbars
              type="auto"
              style={{
                height: isMobile
                  ? 'calc(100vh - 196px)'
                  : 'calc(100vh - 256px)',
                flexGrow: 1,
              }}
            >
              {data && !error && !isValidating && (
                <>
                  {data.length > 0 && (
                    <Stack>
                      {data.map((card) => (
                        <CardsListCard
                          key={`${card.name}${card.date.toString()}`}
                          card={card}
                          edit={() => {
                            setEditCard(card);
                            setIsEdit(true);
                            setCreateModalVisible(true);
                          }}
                          refresh={() => mutate()}
                        />
                      ))}
                    </Stack>
                  )}
                  {data.length === 0 && (
                    <Alert color="blue" title="No Data">
                      There are no cards for the selected filters.
                    </Alert>
                  )}
                </>
              )}
              {isValidating && (
                <Center>
                  <Loader />
                </Center>
              )}
              {error && (
                <Alert color="red" title="Something is wrong!">
                  There was an error. Try refreshing and if the issue persists
                  please let us know using the feedback button on the left.
                </Alert>
              )}
            </ScrollArea>
          </Group>
        </Stack>
      </Center>
      <Modal
        opened={createModalVisible}
        onClose={() => {
          setCreateModalVisible(false);
          mutate();
        }}
        title="Add Card"
        size="xl"
      >
        <CreateCard
          isEdit={isEdit}
          card={editCard}
          onSubmit={() => {
            setCreateModalVisible(false);
            mutate();
          }}
        />
      </Modal>
      <Modal
        opened={filterOpen}
        onClose={() => setFilterOpen(false)}
        title="Filters"
      >
        <ScrollArea
          offsetScrollbars
          type="auto"
          style={{ height: 'calc(100vh - 180px)', maxHeight: 1034 }}
        >
          <FilterPanel
            leaders={leaders}
            values={{
              startDate,
              endDate,
              completed,
              boxes: boxesFilter,
              hosts: hostFilter,
            }}
            apply={(values) => {
              setStartDate(values.startDate);
              setEndDate(values.endDate);
              setCompleted(values.completed);
              setBoxesFilter(values.boxes);
              setHostFilter(values.hosts);
              mutate();
              setFilterOpen(false);
            }}
          />
        </ScrollArea>
      </Modal>
    </>
  );
}
