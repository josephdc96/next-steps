import type { Personnel } from '../../types/personnel';
import { UserRole } from '../../types/personnel';

import { useEffect, useState } from 'react';
import {
  Button,
  Divider,
  Group,
  Modal,
  MultiSelect,
  Select,
  SimpleGrid,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { DatePicker } from '@mantine/dates';
import type { Asset, UsrSession } from '#/lib/auth/contract';
import { useSession } from 'next-auth/react';
import { authorizeAction } from '#/lib/auth/authz';
import Auth0 from 'next-auth/providers/auth0';

interface UserModalProps {
  isEdit: boolean;
  opened: boolean;
  user?: Personnel;
  onClose(): void;
}

const ROLE_STRING_RECORD: Record<UserRole, string> = {
  [UserRole.Admin]: 'Admin',
  [UserRole.TeamLeader]: 'TeamLeader',
  [UserRole.SubTeamLeader]: 'SubTeamLeader',
  [UserRole.Leader]: 'Leader',
  [UserRole.SuperUser]: 'SuperUser',
};

const STRING_ROLE_RECORD: Record<string, UserRole> = {
  Admin: UserRole.Admin,
  TeamLeader: UserRole.TeamLeader,
  SubTeamLeader: UserRole.SubTeamLeader,
  Leader: UserRole.Leader,
  SuperUser: UserRole.SuperUser,
};

const ROLE_VALUES = [
  { value: 'Admin', label: 'Paradigm Staff' },
  { value: 'TeamLeader', label: 'Team Leader' },
  { value: 'SubTeamLeader', label: 'Subteam Leader' },
  { value: 'Leader', label: 'Leader' },
  { value: 'SuperUser', label: 'Super User' },
];

const Auth0Asset: Asset = {
  role: [UserRole.SuperUser],
};

export default function UserModal({
  isEdit,
  opened,
  user,
  onClose,
}: UserModalProps) {
  const { data: session } = useSession();
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
      roles: (user?.roles || [UserRole.Leader]).map(
        (role) => ROLE_STRING_RECORD[role],
      ),
      leader: user?.leader,
      commitedThru: user?.commitedThru
        ? new Date(user?.commitedThru)
        : new Date(),
      active: user?.active || true,
      birthday: user?.birthday ? new Date(user?.birthday) : new Date(),
      leftReason: user?.reason,
      followUp: user?.followUp,
      onBreak: user?.onBreak || false,
      auth0Id: user?.auth0Id || false,
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
  const [isSuperUser, setIsSuperUser] = useState(false);

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
    if (session) {
      setIsSuperUser(
        authorizeAction(Auth0Asset, (session as UsrSession).roles).authorized,
      );
    }
  }, [opened, session]);

  const submitForm = (values: any) => {
    const result = {
      ...values,
      roles: (values.roles as string[]).map((role) => STRING_ROLE_RECORD[role]),
    };

    if (isEdit) {
      fetch(`/api/personnel?id=${user?.id}`, {
        method: 'PUT',
        body: JSON.stringify(result),
      }).then(() => onClose());
    } else {
      fetch('/api/personnel', {
        method: 'POST',
        body: JSON.stringify(result),
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
            <MultiSelect
              data={ROLE_VALUES}
              label="Roles"
              required
              {...form.getInputProps('roles')}
            />
            {isSuperUser && (
              <TextInput
                label="Auth0 User ID"
                {...form.getInputProps('auth0Id')}
              />
            )}
            <Divider />
            <Select
              disabled={
                form.values.roles.includes('TeamLeader') ||
                form.values.roles.includes('Admin')
              }
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
