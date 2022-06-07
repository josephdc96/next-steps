import type { Personnel } from '../../types/personnel';
import type { NextStepsCard } from '../../types/new-here';

import { useEffect, useState } from 'react';
import { useForm } from '@mantine/form';
import { DatePicker } from '@mantine/dates';
import {
  Button,
  Center,
  Checkbox,
  Divider,
  Group,
  SegmentedControl,
  Select,
  SimpleGrid,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';

import { Gender, Reasons, States } from '../../types/new-here';

export default function NewHerePage() {
  const form = useForm({
    initialValues: {
      name: '',
      gender: 'male',
      dob: new Date(),
      phoneNum: '',
      email: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      prayerRequests: '',
      whoHelped: '',
      otherHelp: '',
      firstTime: false,
      baptism: false,
      followJesus: false,
      membership: false,
      discipleship: false,
      serve: false,
      joinGroup: false,
    },
  });

  const genderData = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
  ];

  const [personnel, setPersonnel] = useState<
    { label: string; value: string }[]
  >([{ value: 'other', label: 'Other' }]);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/personnel/active').then((x) => {
      x.json().then((json: Personnel[]) => {
        const p = [{ value: 'other', label: 'Other' }];
        json.forEach((y) => {
          p.push({
            label: `${y.firstName} ${y.lastName}`,
            value: y.id || '',
          });
        });
        setPersonnel(p);
      });
    });
  }, []);

  const submitForm = (values: any) => {
    const setReasons = () => {
      const reasons: Reasons[] = [];
      if (values.firstTime) reasons.push(Reasons.firstTime);
      if (values.followJesus) reasons.push(Reasons.followJesus);
      if (values.baptism) reasons.push(Reasons.baptism);
      if (values.membership) reasons.push(Reasons.membership);
      if (values.discipleship) reasons.push(Reasons.discipleship);
      if (values.serve) reasons.push(Reasons.serve);
      if (values.joinGroup) reasons.push(Reasons.joinGroup);
      return reasons;
    };

    const card: NextStepsCard = {
      name: values.name,
      gender: values.gender === 'male' ? Gender.male : Gender.female,
      dob: values.dob.toString(),
      phoneNum: values.phoneNum,
      email: values.email,
      address: values.address,
      city: values.city,
      state: values.state,
      zip: values.zip,
      prayerRequests: values.prayerRequests,
      reasons: setReasons(),
      whoHelped: values.whoHelped !== 'other' ? values.whoHelped : undefined,
      otherHelp: values.whoHelped === 'other' ? values.otherHelp : undefined,
      date: new Date().toString(),
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
    };

    fetch('/api/cards/new-here', {
      method: 'POST',
      body: JSON.stringify(card),
    })
      .then(() => {
        setDone(true);
      })
      .catch(() => {
        setError(true);
      });
  };

  const restart = () => {
    form.reset();
    setDone(false);
    setError(false);
  };

  return (
    <>
      <Center style={{ width: '100%' }}>
        {!done && !error && (
          <form
            style={{ width: '95%' }}
            onSubmit={form.onSubmit((values) => submitForm(values))}
          >
            <Group direction="column" spacing="sm" grow>
              <Title order={2}>Welcome to Paradigm</Title>
              <Text size="md">
                {
                  "We are so glad you've come! Please fill out the next steps card below!"
                }
              </Text>
              <Divider />
              <TextInput
                required
                label="First Name"
                placeholder="John Doe"
                {...form.getInputProps('name')}
              />
              <SegmentedControl
                data={genderData}
                {...form.getInputProps('gender')}
              />
              <DatePicker
                required
                label="Date of Birth"
                {...form.getInputProps('dob')}
              />
              <Group spacing="sm" noWrap>
                <TextInput
                  required
                  label="Phone #"
                  placeholder="(123) 456-7890"
                  style={{ width: '40%' }}
                  {...form.getInputProps('phoneNum')}
                />
                <TextInput
                  required
                  label="Email Address"
                  placeholder="john.doe@example.com"
                  style={{ width: '60%' }}
                  {...form.getInputProps('email')}
                />
              </Group>
              <TextInput
                label="Address"
                placeholder="123 Place Dr."
                {...form.getInputProps('address')}
              />
              <Group spacing="md" noWrap>
                <TextInput
                  label="City"
                  placeholder="Metropolis"
                  style={{ flexGrow: 1 }}
                  {...form.getInputProps('city')}
                />
                <Select
                  data={States}
                  label="State"
                  placeholder="Missouri"
                  style={{
                    width: '25%',
                    maxWidth: '100px',
                  }}
                  {...form.getInputProps('state')}
                />
                <TextInput
                  label="Zip Code"
                  placeholder="12345"
                  style={{
                    width: '25%',
                    maxWidth: '100px',
                  }}
                  {...form.getInputProps('zip')}
                />
              </Group>
              <Text size="sm">Check all that apply</Text>
              <SimpleGrid cols={2}>
                <Checkbox
                  label="First Time Here"
                  {...form.getInputProps('firstTime', { type: 'checkbox' })}
                />
                <Checkbox
                  label="Group Connect"
                  {...form.getInputProps('joinGroup', { type: 'checkbox' })}
                />
                <Checkbox
                  label="Committed to Jesus Today"
                  {...form.getInputProps('followJesus', { type: 'checkbox' })}
                />
                <Checkbox
                  label="I Want to Serve"
                  {...form.getInputProps('serve', { type: 'checkbox' })}
                />
                <Checkbox
                  label="Would Like a Mentor"
                  {...form.getInputProps('discipleship', { type: 'checkbox' })}
                />
                <Checkbox
                  label="Interested in Baptism"
                  {...form.getInputProps('baptism', { type: 'checkbox' })}
                />
                <Checkbox
                  label="Church Membership"
                  {...form.getInputProps('membership', { type: 'checkbox' })}
                />
              </SimpleGrid>
              <Select
                required
                data={personnel}
                label="Who helped you today?"
                {...form.getInputProps('whoHelped')}
              />
              {form.values.whoHelped === 'other' && (
                <TextInput
                  required={form.values.whoHelped === 'other'}
                  {...form.getInputProps('otherHelp')}
                />
              )}
              <Textarea
                label="How can we be praying for you?"
                {...form.getInputProps('prayerRequests')}
              />
              <Group position="right">
                <Button type="submit">Submit</Button>
              </Group>
            </Group>
          </form>
        )}
        {done && (
          <Group direction="column" spacing="sm" grow style={{ width: '95%' }}>
            <Title order={2}>Thank You</Title>
            <Text size="md">
              {
                "Thank you for your participation. Don't forget to retrieve your complimentary cup from the Next Steps desk"
              }
            </Text>
            <Group position="right">
              <Button onClick={restart}>Restart</Button>
            </Group>
          </Group>
        )}
        {error && (
          <Group direction="column" spacing="sm" grow style={{ width: '95%' }}>
            <Title color="red" order={2}>
              Something went wrong
            </Title>
            <Text size="md">
              {
                'Sorry! There was an issue submitting your card. Please try again. If the issue continues please see a next steps volunteer to fill out a physical card.'
              }
            </Text>
            <Group position="right">
              <Button color="red" onClick={restart}>
                Restart
              </Button>
            </Group>
          </Group>
        )}
      </Center>
    </>
  );
}
