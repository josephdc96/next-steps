import type { Personnel } from '../../../types/personnel';
import type { NextStepsCard } from '../../../types/new-here';

import { ReactNode, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import {
  Box,
  Button,
  Card,
  Checkbox,
  Grid,
  Group,
  Paper,
  Stack,
  Text,
  Textarea,
  TextInput,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';

import {
  GENDER_DISPLAY_RECORD,
  REASON_DISPLAY_RECORD,
  Reasons,
} from '../../../types/new-here';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface RowProps {
  card: NextStepsCard;
  refresh(): void;
}

const CardsListCard = ({ card, refresh }: RowProps) => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

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
    <Card
      style={{
        backgroundColor:
          colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
      }}
    >
      <Group direction="row" style={{ alignItems: 'flex-start' }} noWrap>
        <Group direction="column" spacing="md" grow style={{ flexGrow: 1 }}>
          <Group direction="row">
            <TextInput
              label="Name"
              style={{ flexGrow: 1 }}
              disabled
              value={card.name}
            />
            <TextInput
              label="Gender"
              style={{ width: 100 }}
              disabled
              value={GENDER_DISPLAY_RECORD[card.gender]}
            />
            <TextInput
              label="DOB"
              style={{ width: 100 }}
              disabled
              value={dayjs(card.dob).format('MM/DD/YYYY')}
            />
          </Group>
          <Group direction="row">
            <TextInput
              label="Phone #"
              style={{ width: '40%' }}
              disabled
              value={card.phoneNum}
            />
            <TextInput
              label="Email"
              style={{ flexGrow: 1 }}
              disabled
              value={card.email}
            />
          </Group>
          <TextInput label="Address" disabled value={card.address} />
          <TextInput
            disabled
            value={`${card.city}, ${card.state} ${card.zip}`}
          />
          <Grid>
            <Grid.Col span={6} xl={3}>
              <Checkbox
                disabled
                checked={card.reasons.includes(Reasons.firstTime)}
                label={REASON_DISPLAY_RECORD[Reasons.firstTime]}
              />
            </Grid.Col>
            <Grid.Col span={6} xl={3}>
              <Checkbox
                disabled
                checked={card.reasons.includes(Reasons.followJesus)}
                label={REASON_DISPLAY_RECORD[Reasons.followJesus]}
              />
            </Grid.Col>
            <Grid.Col span={6} xl={3}>
              <Checkbox
                disabled
                checked={card.reasons.includes(Reasons.baptism)}
                label={REASON_DISPLAY_RECORD[Reasons.baptism]}
              />
            </Grid.Col>
            <Grid.Col span={6} xl={3}>
              <Checkbox
                disabled
                checked={card.reasons.includes(Reasons.membership)}
                label={REASON_DISPLAY_RECORD[Reasons.membership]}
              />
            </Grid.Col>
            <Grid.Col span={6} xl={3}>
              <Checkbox
                disabled
                checked={card.reasons.includes(Reasons.discipleship)}
                label={REASON_DISPLAY_RECORD[Reasons.discipleship]}
              />
            </Grid.Col>
            <Grid.Col span={6} xl={3}>
              <Checkbox
                disabled
                checked={card.reasons.includes(Reasons.serve)}
                label={REASON_DISPLAY_RECORD[Reasons.serve]}
              />
            </Grid.Col>
            <Grid.Col span={6} xl={3}>
              <Checkbox
                disabled
                checked={card.reasons.includes(Reasons.joinGroup)}
                label={REASON_DISPLAY_RECORD[Reasons.joinGroup]}
              />
            </Grid.Col>
          </Grid>
        </Group>
        <Group direction="column" spacing="md" grow style={{ minWidth: 300 }}>
          <Group direction="row" style={{ alignItems: 'flex-end' }} noWrap>
            <TextInput
              label="Hosted By"
              disabled
              value={host}
              style={{ flexGrow: 1 }}
            />
            <Button
              leftIcon={<FontAwesomeIcon icon="envelope" />}
              variant={card.completed ? 'filled' : 'outline'}
              color={card.completed ? 'green' : 'blue'}
              onClick={() => {
                fetch(
                  `/api/cards/complete?id=${card.id}&status=${
                    card.completed ? 'false' : 'true'
                  }`,
                  { method: 'PUT' },
                ).then(refresh);
              }}
            >
              Card Written
            </Button>
          </Group>
          <Textarea
            label="Prayer Requests"
            disabled
            value={card.prayerRequests}
          />
          <Checkbox disabled checked={card.confidential} label="Confidential" />
        </Group>
      </Group>
    </Card>
  );
};

export default CardsListCard;
