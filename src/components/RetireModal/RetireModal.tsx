import { Button, Group, Modal, Space, Text, TextInput } from '@mantine/core';
import { useState } from 'react';

interface breakModalProps {
  userId: string;
  opened: boolean;
  onClose(): void;
}

export default function RetireModal({
  userId,
  opened,
  onClose,
}: breakModalProps) {
  const [reason, setReason] = useState('');
  const [followUp, setFollowUp] = useState('');

  const markRetired = () => {
    fetch(`/api/personnel/retired?id=${userId}`, {
      method: 'PUT',
      body: JSON.stringify({ reason, followUp }),
    }).then(() => onClose());
  };

  return (
    <>
      <Modal opened={opened} onClose={onClose} title="Are you sure?" size="md">
        <Text>{'Are you sure you want to mark this person as retired?'}</Text>
        <Space h="md" />
        <TextInput
          required
          value={reason}
          label="Reason"
          onChange={(x) => setReason(x.target.value)}
        />
        <Space h="md" />
        <TextInput
          value={followUp}
          label="Follow Up"
          onChange={(x) => setFollowUp(x.target.value)}
        />
        <Space h="md" />
        <Group position="right" spacing="md">
          <Button variant="outline" onClick={() => onClose()}>
            Cancel
          </Button>
          <Button onClick={() => markRetired()}>Continue</Button>
        </Group>
      </Modal>
    </>
  );
};
