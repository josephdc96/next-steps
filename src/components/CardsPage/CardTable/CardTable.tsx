import type { NextStepsCard } from '../../../types/new-here';

import {
  ActionIcon,
  Group,
  Table,
  Text,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { CardTableRow } from '#/components/CardsPage/CardTable/CardTableRow';

interface TableProps {
  sort: string;
  sortDirection: string;
  cards: NextStepsCard[];
  changeSort(sort: string): void;
}

export function CardTable({
  cards,
  sort,
  sortDirection,
  changeSort,
}: TableProps) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  const rows = !cards ? (
    <></>
  ) : (
    cards.map((card) => {
      return (
        <CardTableRow key={`${card.name}${card.date.toString()}`} card={card} />
      );
    })
  );

  return (
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
          <th style={{ minWidth: 140 }}>
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
          <th style={{ minWidth: 150 }}>
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
  );
}
