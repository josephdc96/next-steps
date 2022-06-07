import type { Personnel } from '../../types/personnel';

import { useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  Divider,
  Group,
  Modal,
  Select,
  SimpleGrid,
  Space,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { DatePicker } from '@mantine/dates';

interface UserModalProps {
  isEdit: boolean;
  opened: boolean;
  user?: Personnel;
  onClose(): void;
}

export default function UserModal({
  isEdit,
  opened,
  user,
  onClose,
}: UserModalProps) {
  const form = useForm({
    initialValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phoneNum: user?.phoneNum || '',
      email: user?.email || '',
      signedCommitment: user?.signedCommitment
        ? new Date(user?.signedCommitment)
        : new Date(),
      ltClass: user?.ltClass ? new Date(user?.ltClass) : new Date(),
      subteamLead: user?.subteamLead || false,
      teamLead: user?.teamLead || false,
      leader: user?.leader,
      commitedThru: user?.commitedThru
        ? new Date(user?.commitedThru)
        : new Date(),
      active: user?.active || true,
      birthday: user?.birthday ? new Date(user?.birthday) : new Date(),
      leftReason: user?.reason,
      followUp: user?.followUp,
      onBreak: user?.onBreak || false,
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      phoneNum: (value) =>
        /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im.test(value)
          ? null
          : 'Invalid phone number',
    },
  });

  const [leaders, setLeaders] = useState<{ value: string; label: string }[]>(
    [],
  );
  useEffect(() => {
    fetch('/api/personnel/active/leaders').then((res) =>
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

  const submitForm = (values: Personnel) => {
    if (isEdit) {
      fetch(`/api/personnel?id=${user?.id}`, {
        method: 'PUT',
        body: JSON.stringify(values),
      }).then(() => onClose());
    } else {
      fetch('/api/personnel', {
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
        title={isEdit ? 'Edit User' : 'New User'}
        size="xl"
      >
        <form onSubmit={form.onSubmit((values) => submitForm(values))}>
          <Group direction="column" spacing="sm" grow>
            <TextInput
              required
              label="First Name"
              placeholder="John"
              {...form.getInputProps('firstName')}
            />
            <TextInput
              required
              label="Last Name"
              placeholder="Doe"
              {...form.getInputProps('lastName')}
            />
            <TextInput
              required
              label="Phone Number"
              placeholder="(123) 456-7890"
              {...form.getInputProps('phoneNum')}
            />
            <TextInput
              required
              label="Email"
              placeholder="john.doe@example.com"
              {...form.getInputProps('email')}
            />
            <Divider />
            <Group spacing="md" grow>
              <Checkbox
                label="Team Leader"
                disabled={form.values.subteamLead}
                {...form.getInputProps('teamLead', { type: 'checkbox' })}
              />
              <Checkbox
                label="Subteam Leader"
                disabled={form.values.teamLead}
                {...form.getInputProps('subteamLead', { type: 'checkbox' })}
              />
            </Group>
            <Divider />
            <Select
              disabled={form.values.teamLead}
              data={leaders}
              label="Leader"
              {...form.getInputProps('leader')}
            />
            <Divider />
            <SimpleGrid cols={2}>
              <DatePicker
                required
                placeholder="Pick date"
                label="Leadership Training Class"
                inputFormat="MMMM YYYY"
                {...form.getInputProps('ltClass')}
              />
              <DatePicker
                required
                placeholder="Pick date"
                label="Last Signed Commitment"
                inputFormat="MMMM YYYY"
                {...form.getInputProps('signedCommitment')}
              />
              <DatePicker
                required
                placeholder="Pick date"
                label="Commited through"
                inputFormat="MMMM YYYY"
                {...form.getInputProps('commitedThru')}
              />
              <DatePicker
                required
                placeholder="Pick date"
                label="Birthday"
                {...form.getInputProps('birthday')}
              />
            </SimpleGrid>
            <Divider />
            {!form.values.active ||
              (form.values.onBreak && (
                <>
                  <Text size="md">Inactive Information</Text>
                  <TextInput
                    disabled
                    label="Reason"
                    {...form.getInputProps('leftReason')}
                  />
                  <TextInput
                    disabled
                    label="Follow Up Info"
                    {...form.getInputProps('followUp')}
                  />
                  <Divider />
                </>
              ))}
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
