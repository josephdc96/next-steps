import { signIn } from 'next-auth/react';
import { useForm } from '@mantine/form';
import {
  Alert, Anchor,
  Button,
  Card,
  Center,
  Group,
  Space,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function SignInPage() {
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
  });
  const router = useRouter();
  const { callbackUrl, error } = router.query;

  return (
    <Center style={{ width: '100%', height: 'calc(100vh - 92px)' }}>
      <Card style={{ width: '350px' }}>
        <Title order={1}>Sign In</Title>
        <Space h="md" />
        <Text>Please sign in to access this application:</Text>
        <Space h="md" />
        {error && (
          <>
            {error === 'CredentialsSignin' && (
              <Alert
                icon={<FontAwesomeIcon icon="user-slash" />}
                title="Incorrect Credentials"
                color="red"
              >
                The credentials you input are incorrect. Please try again or click the link below to reset your password.
              </Alert>
            )}
          </>
        )}
        <form
          onSubmit={form.onSubmit((values) => {
            signIn('credentials', {
              email: values.email,
              password: values.password,
              callbackUrl: (callbackUrl as string) || '',
            });
          })}
        >
          <TextInput label="Email" {...form.getInputProps('email')} />
          <Space h="md" />
          <TextInput
            label="Password"
            type="password"
            {...form.getInputProps('password')}
          />
          <Space h="md" />
          <Group style={{ width: '100%' }} position="apart">
            <Button variant="subtle">Forgot Password</Button>
            <Button type="submit">Log In</Button>
          </Group>
        </form>
      </Card>
    </Center>
  );
}
