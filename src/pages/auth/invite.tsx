import type { Personnel } from '#/types/personnel';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from '@mantine/form';
import {
  Alert,
  Button,
  Card,
  Center,
  Group,
  Space,
  Text,
  TextInput,
  Title,
} from '@mantine/core';

import { hashPassword } from '#/lib/auth/passwd';

import password from '../api/auth/password';

export default function InvitePage() {
  const form = useForm({
    initialValues: {
      password: '',
      repeat: '',
    },
  });
  const router = useRouter();
  const { email, inviteCode } = router.query;
  const [user, setUser] = useState<Personnel>();
  const [validCode, setValidCode] = useState(false);

  useEffect(() => {
    fetch(`/api/auth/password?email=${email}&code=${inviteCode}`).then((x) => {
      if (x.status === 200) {
        x.json().then((y: Personnel) => {
          setUser(y);
          if (
            !y.activationCode ||
            y.activationCode !== inviteCode ||
            (y.codeExpires && y.codeExpires < new Date())
          ) {
            setValidCode(false);
          } else {
            setValidCode(true);
          }
        });
      } else {
        setValidCode(false);
      }
    });
  }, [email, inviteCode]);

  const submitPassword = (values: { password: string; repeat: string }) => {
    hashPassword(values.password).then((passwd) => {
      fetch(`/api/auth/password?email=${email}&code=${inviteCode}`, {
        method: 'POST',
        body: passwd,
      }).then(() => {
        router.push('/');
      });
    });
  };

  return (
    <Center style={{ width: '100%', height: 'calc(100vh - 92px)' }}>
      <Card style={{ width: '350px' }}>
        <Title order={1}>Set Password</Title>
        <Space h="md" />
        {validCode && (
          <>
            <Text>Please set your password below:</Text>
            <Space h="md" />
            <TextInput label="First Name" value={user?.firstName} disabled />
            <Space h="md" />
            <TextInput label="Last Name" value={user?.lastName} disabled />
            <Space h="md" />
            <TextInput label="Email" value={user?.email} disabled />
            <Space h="md" />
            <form onSubmit={form.onSubmit((values) => submitPassword(values))}>
              <TextInput
                label="Password"
                type="password"
                {...form.getInputProps('password')}
              />
              <Space h="md" />
              <TextInput
                label="Retype Password"
                type="password"
                {...form.getInputProps('repeat')}
              />
              <Space h="md" />
              <Group position="right">
                <Button type="submit">Set Password</Button>
              </Group>
            </form>
          </>
        )}
        {!validCode && (
          <Alert color="red" title="Invalid Invite Code">You have an invalid invite code. Please reach out to an administrator to get a new code.</Alert>
        )}
      </Card>
    </Center>
  );
}
