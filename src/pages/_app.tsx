import type { AppProps } from 'next/app';
import type { ColorScheme } from '@mantine/core';

import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { setCookies } from 'cookies-next';
import { ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

import { Layout } from '#/components/Layout/Layout';

import { themeObject } from '../styles/theme';
import { UserProvider } from '@auth0/nextjs-auth0';

export default function App({
  Component,
  pageProps = {},
  colorScheme,
}: AppProps & { colorScheme: ColorScheme }) {
  library.add(fas);

  const router = useRouter();

  const [currentColorScheme, setColorScheme] =
    useState<ColorScheme>(colorScheme);

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme =
      value || (currentColorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme);
    setCookies('mantine-color-scheme', nextColorScheme, {
      maxAge: 60 * 60 * 24 * 30,
    });
  };

  return (
    <>
      <Head>
        <title>Paradigm Next Steps</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <UserProvider>
        <ColorSchemeProvider
          colorScheme={currentColorScheme}
          toggleColorScheme={toggleColorScheme}
        >
          <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
              colorScheme: currentColorScheme,
              ...themeObject,
            }}
          >
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </MantineProvider>
        </ColorSchemeProvider>
      </UserProvider>
    </>
  );
}
