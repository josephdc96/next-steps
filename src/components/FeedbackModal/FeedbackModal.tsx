import { useEffect } from 'react';
import { useForm } from '@mantine/form';
import { Button, Group, Modal, Stack, Textarea, TextInput } from '@mantine/core';

interface FeedbackModalProps {
  opened: boolean;
  onClose(): void;
}

export default function FeedbackModal({ opened, onClose }: FeedbackModalProps) {
  const form = useForm({
    initialValues: {
      name: '',
      feedback: '',
    },
  });

  useEffect(() => {
    form.reset();
  }, [opened]);

  const submitForm = (values: any) => {
    fetch('/api/feedback', {
      method: 'POST',
      body: JSON.stringify(values),
    });
    onClose();
  };

  return (
    <>
      <Modal
        centered
        opened={opened}
        onClose={onClose}
        title="Feedback"
        size="lg"
      >
        <form onSubmit={form.onSubmit((values) => submitForm(values))}>
          <Stack spacing="sm">
            <TextInput
              required
              label="Name"
              placeholder="Name"
              {...form.getInputProps('name')}
            />
            <Textarea
              required
              label="Feedback"
              placeholder="Feedback here"
              {...form.getInputProps('feedback')}
            />
            <Group position="right">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button color="blue" type="submit">
                Send
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
