import type { Subteam } from '#/types/subteam';
import type { Personnel } from '#/types/personnel';

import { useEffect, useState } from 'react';
import { useForm } from '@mantine/form';
import {
  Button,
  Divider,
  Group,
  Modal,
  MultiSelect,
  TextInput,
} from '@mantine/core';
import useTeam from '#/lib/hooks/useTeam';

interface SubteamModalProps {
  isEdit: boolean;
  opened: boolean;
  subteam?: Subteam;
  onClose(): void;
}

export default function SubteamModal({
  isEdit,
  opened,
  subteam,
  onClose,
}: SubteamModalProps) {
  const form = useForm({
    initialValues: {
      name: subteam?.name || '',
      leaders: subteam?.leaders || [],
    },
  });
  const { teamId } = useTeam();

  const [leaders, setLeaders] = useState<{ value: string; label: string }[]>(
    [],
  );
  useEffect(() => {
    fetch(`/api/personnel/active/team/${teamId}/leaders`).then((res) =>
      res.json().then((json) => {
        const data: any[] = [];

        json.forEach((leader: Personnel) => {
          data.push({
            value: leader.id,
            label: `${leader.firstName} ${leader.lastName}`,
          });
        });

        setLeaders(data);
      }),
    );
    form.reset();
  }, [opened]);

  const submitForm = (values: Subteam) => {
    if (isEdit) {
      fetch(`/api/subteams/team/${teamId}?id=${subteam?.id}`, {
        method: 'PUT',
        body: JSON.stringify(values),
      }).then(() => onClose());
    } else {
      fetch(`/api/subteams/team/${teamId}`, {
        method: 'POST',
        body: JSON.stringify(values),
      }).then(() => onClose());
    }
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={onClose}
        title={isEdit ? 'Edit Subteam' : 'New Subteam'}
        size="lg"
      >
        <form onSubmit={form.onSubmit((values) => submitForm(values))}>
          <Group direction="column" spacing="sm" grow>
            <TextInput
              required
              label="Team Name"
              placeholder="Team Name"
              {...form.getInputProps('name')}
            />
            <MultiSelect
              data={leaders}
              required
              label="Team Leaders"
              placeholder="Pick 1 or more team leads"
              {...form.getInputProps('leaders')}
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
