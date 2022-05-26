import type { NextPage } from 'next';
import Link from 'next/link';
import { Button } from '@mantine/core';
import { useSession, signIn } from 'next-auth/react';

const Home: NextPage = () => {
  const { data: session, status } = useSession();

  return (
    <>
      <h1>Paradigm Next Steps</h1>
    </>
  );
};

export default Home;
