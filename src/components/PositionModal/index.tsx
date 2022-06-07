import type { Position } from '../../types/position';
import { useForm } from '@mantine/form';
import {
  Button,
  Divider,
  Group,
  Modal,
  MultiSelect,
  TextInput,
} from '@mantine/core';
import { useEffect } from 'react';

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

  useEffect(() => {
    form.reset();
  }, [opened]);

  const submitForm = (values: Position) => {
    if (isEdit) {
      fetch(`/api/positions?id=${position?.id}`, {
        method: 'PUT',
        body: values.name,
      }).then(() => onClose());
    } else {
      fetch('/api/positions', {
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
          <Group direction="column" spacing="sm" grow>
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
          </Group>
        </form>
      </Modal>
    </>
  );
}
