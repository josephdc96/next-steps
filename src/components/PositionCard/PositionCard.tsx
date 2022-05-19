import type { Position } from '../../types/position';
import type { Personnel } from '../../types/personnel';

import { useEffect, useState } from 'react';
import { Button, Card, Group, Text } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface positionCardProps {
  position: Position;
  edit(position: Position): void;
}

export default function PositionCard({ position, edit }: positionCardProps) {
  const [assignees, setAssignees] = useState<Personnel[]>([]);

  useEffect(() => {
    setAssignees([]);
    fetch(`/api/assignments/${position.id}/assignees`).then((x) => {
      x.json().then((json: Personnel[]) => {
        setAssignees(json);
      });
    });
  }, [position]);

  return (
    <Card
      shadow="sm"
      p="lg"
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme === 'dark'
            ? theme.colors.dark[4]
            : theme.colors.gray[0],
      })}
    >
      <Group direction="column" spacing="md">
        <Group position="apart" style={{ width: '100%' }}>
          <Text size="xl">{position.name}</Text>
          <Group spacing="xs">
            <Button variant="subtle" onClick={() => edit(position)}>
              <FontAwesomeIcon icon="edit" />
            </Button>
            <Button variant="subtle" color="red">
              <FontAwesomeIcon icon="trash" />
            </Button>
          </Group>
        </Group>
        <Text size="lg">Assignees</Text>
        {assignees.map((assignee) => {
          return (
            <Text key={assignee.id} size="sm">
              {`${assignee.firstName} ${assignee.lastName}`}
            </Text>
          );
        })}
      </Group>
    </Card>
  );
}
