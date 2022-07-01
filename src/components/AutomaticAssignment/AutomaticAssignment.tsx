import type { Position } from '#/types/position';
import type { Personnel } from '#/types/personnel';

import { useEffect, useState } from 'react';
import {
  Button,
  Group,
  Modal,
  ScrollArea,
  Select,
  Text,
  TextInput,
} from '@mantine/core';
import positions from '../../pages/api/positions';
import useTeam from '#/lib/hooks/useTeam';

interface AutomaticAssignmentProps {
  opened: boolean;
  onClose(): void;
}

export default function AutomaticAssignment({
  opened,
  onClose,
}: AutomaticAssignmentProps) {
  const { teamId } = useTeam();
  const [personnelMap, setPersonnelMap] = useState(
    new Map<string, Personnel>(),
  );
  const [positionMap, setPositionMap] = useState<Map<string, string>>(
    new Map(),
  );
  const [assignments, setAssignments] = useState<
    { id: string; position: string }[]
  >([]);

  useEffect(() => {
    fetch(`/api/personnel/active/team/${teamId}`).then((x) => {
      x.json().then((json) => {
        const map = new Map<string, Personnel>();
        json.forEach((y: Personnel) => {
          map.set(y.id || '', y);
        });
        setPersonnelMap(map);
        fetch(`/api/positions/team/${teamId}`).then((y) => {
          y.json().then((json2: Position[]) => {
            const map2 = new Map<string, string>();
            json2.forEach((z) => {
              map2.set(z.id || '', z.name || '');
            });
            setPositionMap(map2);
            fetch(`/api/assignments/teams/${teamId}/random`).then((z) => {
              z.json().then((json3: { id: string; position: string }[]) => {
                setAssignments(json3);
              });
            });
          });
        });
      });
    });
  }, [opened]);

  const submit = () => {
    const newPositions = assignments.map((x) => {
      return {
        id: x.id,
        position: x.position,
        currentPosition: personnelMap.get(x.id)?.currentMonthAssign,
      };
    });

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
        <Group direction="column" spacing="sm" grow>
          <ScrollArea style={{ height: 'calc(100vh - 300px)' }}>
            <Group direction="column" spacing="sm" grow>
              {assignments.map((assignment) => {
                return (
                  <Group key={assignment.id} spacing="md" grow>
                    <Text size="sm">{`${
                      personnelMap.get(assignment.id)?.firstName
                    } ${personnelMap.get(assignment.id)?.lastName}`}</Text>
                    <Text size="sm">
                      {`Current Assignment: ${
                        personnelMap.get(assignment.id)?.currentMonthAssign
                          ? positionMap.get(
                              personnelMap.get(assignment.id || '')
                                ?.currentMonthAssign || 'None',
                            )
                          : 'None'
                      }`}
                    </Text>
                    <TextInput
                      disabled
                      value={positionMap.get(assignment.position) || 'None'}
                    />
                  </Group>
                );
              })}
            </Group>
          </ScrollArea>
          <Group position="right" spacing="sm">
            <Button onClick={submit}>Apply</Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </Group>
        </Group>
      </Modal>
    </>
  );
}
