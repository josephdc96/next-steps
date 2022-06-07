import { Button, Group, Modal, Space, Text, TextInput } from '@mantine/core';
import { useState } from 'react';

interface breakModalProps {
  userId: string;
  opened: boolean;
  onClose(): void;
}

export default function BreakModal({
  userId,
  opened,
  onClose,
}: breakModalProps) {
  const [reason, setReason] = useState('');

  const markBreak = () => {
    fetch(`/api/personnel/break?id=${userId}`, {
      method: 'PUT',
      body: reason,
    }).then(() => onClose());
  };

  return (
    <>
      <Modal opened={opened} onClose={onClose} title="Are you sure?" size="md">
        <Text>
          {'Are you sure you want to mark this person as "on a break"?'}
        </Text>
        <Space h="md" />
        <TextInput
          required
          value={reason}
          label="Reason"
          onChange={(x) => setReason(x.target.value)}
        />
        <Space h="md" />
        <Group position="right" spacing="md">
          <Button variant="outline" onClick={() => onClose()}>
            Cancel
          </Button>
          <Button onClick={() => markBreak()}>Continue</Button>
        </Group>
      </Modal>
    </>
  );
}
