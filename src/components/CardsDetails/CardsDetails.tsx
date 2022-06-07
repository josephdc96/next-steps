import type { MantineColor } from '@mantine/core';
import {
  Card,
  Center,
  Group,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import type { MonthMeta } from '../../types/cards';
import { VictoryBar, VictoryChart } from 'victory';

interface NumberOverviewProps {
  name: string;
  total: number;
  increase: number;
  upBad?: boolean;
}

export function NumberOverview({
  name,
  total,
  increase,
  upBad,
}: NumberOverviewProps) {
  const theme = useMantineTheme();
  const statusColor = (): MantineColor => {
    if (increase === 0) return 'gray';
    if (increase > 0) return upBad ? 'red' : 'green';
    return upBad ? 'green' : 'red';
  };
  const statusIcon = (): IconProp => {
    if (increase === 0) return 'arrows-up-down';
    if (increase < 0) return 'arrow-down';
    return 'arrow-up';
  };

  return (
    <Card
      style={{
        backgroundColor:
          theme.colorScheme === 'dark'
            ? theme.colors.dark[8]
            : theme.colors.gray[0],
        minWidth: 200,
      }}
    >
      <Group direction="column" grow>
        <Center>
          <Title order={2}>{name}</Title>
        </Center>
        <Center>
          <Title order={1}>{total}</Title>
        </Center>
        <Center>
          <Text size="lg" color={statusColor()}>
            <FontAwesomeIcon icon={statusIcon()} />
            &nbsp;
            {increase}
          </Text>
        </Center>
      </Group>
    </Card>
  );
}

export interface BarGraphProps {
  meta?: MonthMeta;
  name: string;
}

export function BarGraph({ meta, name }: BarGraphProps) {
  const data = [
    { name: 'First Time', total: meta?.firstTime.total || 0 },
    { name: 'New Believers', total: meta?.followJesus.total || 0 },
    { name: 'Group Connect', total: meta?.groupConnect.total || 0 },
    { name: 'Baptism', total: meta?.baptism.total || 0 },
    { name: 'Membership', total: meta?.membership.total || 0 },
    { name: 'Serve', total: meta?.serve.total || 0 },
    { name: 'Discipleship', total: meta?.discipleship.total || 0 },
    { name: 'Unmarked', total: meta?.unmarked.total || 0 },
  ];

  return (
    <Card>
      <Group direction="column" grow>
        <Center>
          <Title order={2}>Card Categories</Title>
        </Center>
        <VictoryChart padding={50}>
          <VictoryBar data={data} x="name" y="total" />
        </VictoryChart>
      </Group>
    </Card>
  );
}
