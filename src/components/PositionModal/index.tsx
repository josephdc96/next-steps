import type { Position } from '../../types/position';
import { useForm } from '@mantine/form';
import {
  Button,
  Divider,
  Group,
  Modal,
  MultiSelect, Stack,
  TextInput,
} from '@mantine/core';
import { useEffect } from 'react';
import useTeam from '#/lib/hooks/useTeam';

interface PositionModalProps {
  isEdit: boolean;
  opened: boolean;
  position?: Position;
  onClose(): void;
}

export default function PositionModal({
  isEdit,
  opened,
  position,
  onClose,
}: PositionModalProps) {
  const form = useForm({
    initialValues: {
      name: position?.name || '',
    },
  });
  const { teamId } = useTeam();

  useEffect(() => {
    form.reset();
  }, [opened]);

  const submitForm = (values: Position) => {
    if (isEdit) {
      fetch(`/api/positions/team/${teamId}?id=${position?.id}`, {
        method: 'PUT',
        body: values.name,
      }).then(() => onClose());
    } else {
      fetch(`/api/positions/team/${teamId}`, {
        method: 'POST',
        body: values.name,
      }).then(() => onClose());
    }
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={onClose}
        title={isEdit ? 'Edit Position' : 'New Position'}
        size="md"
      >
        <form onSubmit={form.onSubmit((values) => submitForm(values))}>
          <Stack spacing="sm">
            <TextInput
              required
              label="Team Name"
              placeholder="Team Name"
              {...form.getInputProps('name')}
            />
            <Divider />
            <Group position="right">
              <Button variant="outline" onClick={() => onClose()}>
                Cancel
              </Button>
              <Button color="blue" type="submit">
                Save
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
