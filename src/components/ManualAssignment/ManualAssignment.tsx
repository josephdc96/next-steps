import type { Position } from '../../types/position';
import type { Personnel } from '../../types/personnel';

import { useEffect, useState } from 'react';
import {
  Button,
  Group,
  Modal,
  ScrollArea,
  Select,
  Stack,
  Text,
} from '@mantine/core';
import useTeam from '#/lib/hooks/useTeam';

interface ManualAssignmentProps {
  opened: boolean;
  onClose(): void;
}

export default function ManualAssignment({
  opened,
  onClose,
}: ManualAssignmentProps) {
  const { teamId } = useTeam();

  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [positions, setPositions] = useState<
    { value: string; label: string }[]
  >([]);
  const [positionMap, setPositionMap] = useState<Map<string, string>>(
    new Map(),
  );
  const [newPositions, setNewPositions] = useState<
    {
      id: string;
      position: string | undefined;
      currentPosition: string | undefined;
    }[]
  >([]);

  useEffect(() => {
    fetch(`/api/personnel/active/team/${teamId}`).then((x) => {
      x.json().then((json) => {
        const ps: {
          id: string;
          position: string | undefined;
          currentPosition: string | undefined;
        }[] = [];
        json.forEach((y: Personnel) => {
          ps.push({
            id: y.id || '',
            position: undefined,
            currentPosition: y.currentMonthAssign,
          });
        });
        setNewPositions(ps);
        setPersonnel(json);
      });
    });
    fetch(`/api/positions/team/${teamId}`).then((x) => {
      x.json().then((json: Position[]) => {
        const map = new Map<string, string>();
        const data = json.map((y) => {
          map.set(y.id || '', y.name || '');
          return {
            value: y.id || '',
            label: y.name || '',
          };
        });
        setPositionMap(map);
        setPositions(data);
      });
    });
  }, [opened]);

  const submit = () => {
    fetch(`/api/assignments/teams/${teamId}`, {
      method: 'POST',
      body: JSON.stringify(newPositions),
    }).then(() => {
      onClose();
    });
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={onClose}
        title="Assign Positions"
        size="xl"
      >
        <Stack spacing="sm">
          <ScrollArea style={{ height: 'calc(100vh - 300px)' }}>
            <Stack spacing="sm">
              {personnel.map((person, index) => {
                return (
                  <Group key={person.id} spacing="md" grow>
                    <Text size="sm">{`${person.firstName} ${person.lastName}`}</Text>
                    <Text size="sm">
                      {`Current Assignment: ${
                        person.currentMonthAssign
                          ? positionMap.get(person.currentMonthAssign)
                          : 'None'
                      }`}
                    </Text>
                    <Select
                      data={positions}
                      onChange={(x) => {
                        const ps = newPositions;
                        const i = ps.findIndex((value, j, obj) => {
                          // eslint-disable-next-line security/detect-object-injection
                          return value.id === person.id;
                        });
                        ps[i] = {
                          id: ps[i].id,
                          position: x || undefined,
                          currentPosition: ps[i].currentPosition,
                        };
                        setNewPositions(ps);
                      }}
                      placeholder="Next Assignment"
                    />
                  </Group>
                );
              })}
            </Stack>
          </ScrollArea>
          <Group position="right" spacing="sm">
            <Button onClick={submit}>Apply</Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
