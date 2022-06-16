import type { Personnel } from '../../../types/personnel';
import type { NextStepsCard } from '../../../types/new-here';

import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { ActionIcon, Group, Loader, Menu, Stack, Text } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  GENDER_DISPLAY_RECORD,
  REASON_DISPLAY_RECORD,
} from '../../../types/new-here';

interface RowProps {
  card: NextStepsCard;
}

export function CardTableRow({ card }: RowProps) {
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
        <ul>
          {card.reasons.map((reason) => (
            <li key={`${card.name}${card.date.toString()}${reason}`}>
              {REASON_DISPLAY_RECORD[reason]}
            </li>
          ))}
        </ul>
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
