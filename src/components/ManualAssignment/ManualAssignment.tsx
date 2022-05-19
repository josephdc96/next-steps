import { useEffect, useState } from 'react';
import { Personnel } from '../../types/personnel';
import { Button, Group, Modal, ScrollArea, Select, Text } from '@mantine/core';
import Positions from '../../pages/api/positions';
import { Position } from '../../types/position';

interface ManualAssignmentProps {
  opened: boolean;
  onClose(): void;
}

export default function ManualAssignment({
  opened,
  onClose,
}: ManualAssignmentProps) {
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [positions, setPositions] = useState<{ value: string, label: string }[]>([]);
  const [positionMap, setPositionMap] = useState<Map<string, string>>(
    new Map(),
  );

  useEffect(() => {
    fetch('/api/personnel/active').then((x) => {
      x.json().then((json) => {
        console.log(json);
        setPersonnel(json);
      });
    });
    fetch('/api/positions').then((x) => {
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
              {personnel.map((person) => {
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
                    <Select data={positions} placeholder="Next Assignment" />
                  </Group>
                );
              })}
            </Group>
          </ScrollArea>
          <Group position="right" spacing="sm">
            <Button>Apply</Button>
            <Button variant="outline">Cancel</Button>
          </Group>
        </Group>
      </Modal>
    </>
  );
}
