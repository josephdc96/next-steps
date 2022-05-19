import type { NextPage } from 'next';
import Link from 'next/link';
import { Button } from '@mantine/core';

const Home: NextPage = () => {
  return (
    <>
      <Button component="a" href="/api/auth/login">
        Login
      </Button>
    </>
  );
};

export default Home;
