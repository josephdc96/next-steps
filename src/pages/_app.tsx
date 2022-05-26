import type { AppProps } from 'next/app';
import type { ColorScheme } from '@mantine/core';

import Head from 'next/head';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

import { Layout } from '#/components/Layout/Layout';

import { SessionProvider, signIn, useSession } from 'next-auth/react';

export default function App({
  pageProps: { session, ...pageProps },
  Component,
  colorScheme,
}: AppProps & { colorScheme: ColorScheme }) {
  library.add(fas);

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
