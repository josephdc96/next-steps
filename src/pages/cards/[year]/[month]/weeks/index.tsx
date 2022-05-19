import type { Cards } from '../../../../../types/cards';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Affix,
  Box, Button,
  Center,
  Group, Menu,
  Table,
  Title,
  useMantineTheme,
} from '@mantine/core';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function WeeksData() {
  const theme = useMantineTheme();
  const router = useRouter();
  const { month, year } = router.query;
  const [cards, setCards] = useState<Cards[]>([]);

  useEffect(() => {
    if (month && year) {
      fetch(`/api/cards/${year}/${month}/weeks`).then((x) => {
        x.json().then((json: Cards[]) => {
          setCards(
            json.sort((a, b) => {
              if (a.date < b.date) return -1;
              if (a.date > b.date) return 1;
              return 0;
            }),
          );
        });
      });
    }
  }, [year, month]);

  const rows = cards.map((card) => {
    return (
      <tr key={card.date.toString()}>
        <td>{dayjs(card.date).format('M/D/YY')}</td>
        <td>{card.total}</td>
        <td>{card.male}</td>
        <td>{card.female}</td>
        <td>{card.firstTime}</td>
        <td>{card.groupConnect}</td>
        <td>{card.serve}</td>
        <td>{card.followJesus}</td>
        <td>{card.discipleship}</td>
        <td>{card.baptism}</td>
        <td>{card.membership}</td>
        <td style={{ color: theme.colors.red[5] }}>{card.unmarked}</td>
        <td>
          <Menu>
            <Menu.Item icon={<FontAwesomeIcon icon="edit" />}>
              Edit Week
            </Menu.Item>
            <Menu.Item icon={<FontAwesomeIcon icon="trash" />} color="red">
              Delete Week
            </Menu.Item>
          </Menu>
        </td>
      </tr>
    );
  });

  return (
    <>
      <Center style={{ width: '100%', marginTop: 80 }}>
        <Group direction="column" spacing="md" style={{ width: '80%' }}>
          <Title order={3}>{`Card details for ${month}/${year}`}</Title>
          <Box
            style={{
              overflowX: 'scroll',
              overflowY: 'scroll',
              maxHeight: 'calc(100vh - 300px)',
              width: '100%',
            }}
          >
            <Table>
              <thead
                style={{
                  top: 0,
                  zIndex: 2,
                  position: 'sticky',
                  backgroundColor:
                    theme.colorScheme === 'dark'
                      ? theme.colors.dark[8]
                      : theme.colors.gray[1],
                }}
              >
                <tr>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Male</th>
                  <th>Female</th>
                  <th>First Time</th>
                  <th>Group Connect</th>
                  <th>Serve</th>
                  <th>Follow Jesus</th>
                  <th>Discipleship</th>
                  <th>Baptism</th>
                  <th>Membership</th>
                  <th style={{ color: theme.colors.red[6] }}>Unmarked</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </Table>
          </Box>
        </Group>
      </Center>
      <Affix position={{ bottom: 20, right: 20 }}>
        <Button radius="xl" leftIcon={<FontAwesomeIcon icon="plus" />}>
          Add Week
        </Button>
      </Affix>
    </>
  );
}
