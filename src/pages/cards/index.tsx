import type { MonthMeta } from '../../types/cards';

import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Center, Grid,
  Group,
  Header, SimpleGrid,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { BarGraph, NumberOverview } from '#/components/CardsDetails/CardsDetails';

export default function CardsOverviewPage() {
  const theme = useMantineTheme();
  const date = new Date();
  const [data, setData] = useState<MonthMeta | undefined>(undefined);

  useEffect(() => {
    fetch(`/api/cards/${date.getFullYear()}/${date.getMonth()}/meta`).then(
      (x) => {
        x.json().then((json) => {
          setData(json);
        });
      },
    );
  }, []);

  return (
    <>
      <Center style={{ width: '100%', marginTop: 80 }}>
        <Group direction="column" spacing="md" style={{ width: '80%' }} grow>
          <Group position="apart">
            <Title order={2}>Cards Overview</Title>
            <Group spacing="xs">
              <Button variant="outline" compact>
                <FontAwesomeIcon icon="caret-left" />
              </Button>
              <Button
                variant="subtle"
                compact
              >{`${date.getMonth()}/${date.getFullYear()}`}</Button>
              <Button variant="outline" compact>
                <FontAwesomeIcon icon="caret-right" />
              </Button>
            </Group>
            <Button
              variant="filled"
              radius="xl"
              leftIcon={<FontAwesomeIcon icon="plus" />}
            >
              Add Card
            </Button>
          </Group>
          <Title order={3}>Month to date</Title>
          <Grid grow>
            <Grid.Col span={2}>
              <NumberOverview
                name="Total"
                total={data?.total.total || 0}
                increase={data?.total.increase || 0}
              />
            </Grid.Col>
            <Grid.Col span={2}>
              <NumberOverview
                name="Average per week"
                total={data?.average.total || 0}
                increase={data?.average.increase || 0}
              />
            </Grid.Col>
            <Grid.Col span={2}>
              <NumberOverview
                name="Male"
                total={data?.male.total || 0}
                increase={data?.male.increase || 0}
              />
            </Grid.Col>
            <Grid.Col span={2}>
              <NumberOverview
                name="Female"
                total={data?.female.total || 0}
                increase={data?.female.increase || 0}
              />
            </Grid.Col>
            <Grid.Col span={2}>
              <NumberOverview
                name="First Timers"
                total={data?.firstTime.total || 0}
                increase={data?.firstTime.increase || 0}
              />
            </Grid.Col>
            <Grid.Col span={2}>
              <NumberOverview
                name="New Believers"
                total={data?.followJesus.total || 0}
                increase={data?.followJesus.increase || 0}
              />
            </Grid.Col>
            <Grid.Col span={2}>
              <NumberOverview
                name="Group Connect"
                total={data?.groupConnect.total || 0}
                increase={data?.groupConnect.increase || 0}
              />
            </Grid.Col>
            <Grid.Col span={2}>
              <NumberOverview
                name="Membership"
                total={data?.membership.total || 0}
                increase={data?.membership.increase || 0}
              />
            </Grid.Col>
            <Grid.Col span={2}>
              <NumberOverview
                name="Serve"
                total={data?.serve.total || 0}
                increase={data?.serve.increase || 0}
              />
            </Grid.Col>
            <Grid.Col span={2}>
              <NumberOverview
                name="Baptism"
                total={data?.baptism.total || 0}
                increase={data?.unmarked.increase || 0}
              />
            </Grid.Col>
            <Grid.Col span={2}>
              <NumberOverview
                name="Discipleship"
                total={data?.discipleship.total || 0}
                increase={data?.discipleship.increase || 0}
              />
            </Grid.Col>
            <Grid.Col span={2}>
              <NumberOverview
                name="Unmarked"
                total={data?.unmarked.total || 0}
                increase={data?.unmarked.increase || 0}
                upBad
              />
            </Grid.Col>
            <Grid.Col span={8}>
              <BarGraph meta={data} name="" />
              </Grid.Col>
            <Grid.Col span={4}>

            </Grid.Col>
          </Grid>
        </Group>
      </Center>
    </>
  );
}
