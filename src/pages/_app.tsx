import type { AppProps } from 'next/app';
import type { ColorScheme } from '@mantine/core';

import Head from 'next/head';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

import { Layout } from '#/components/Layout/Layout';

import { SessionProvider, signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { CreateLayout } from '../CreateLayout/CreateLayout';
import type { GetServerSidePropsContext } from 'next';
import { getCookie } from 'cookies-next';

export default function App({
  Component,
  pageProps: { session, ...pageProps } = {},
  colorScheme,
}: AppProps & { colorScheme: ColorScheme }) {
  library.add(fas);
  const router = useRouter();

  if (router.pathname.startsWith('/next-steps')) {
    return (
      <>
        <Head>
          <title>Paradigm Next Steps</title>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width"
          />
        </Head>
        <CreateLayout colorScheme={colorScheme}>
          <Component {...pageProps} />
        </CreateLayout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Paradigm Next Steps</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <SessionProvider session={session}>
        <Layout colorScheme={colorScheme}>
          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
    </>
  );
}

/**
 * This ensures that the colorScheme is synced between the server
 * and the client. This gets the cookie that stores the current colorScheme
 * and injects it as a prop at build time.
 */
App.getInitialProps = ({ ctx }: { ctx: GetServerSidePropsContext }) => ({
  colorScheme: getCookie('mantine-color-scheme', ctx) || 'light',
});
