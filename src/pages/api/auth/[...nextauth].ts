import type { JWT } from 'next-auth/jwt';
import type { Session } from 'next-auth';
import type { UsrJwt, UsrSession } from '#/lib/auth/contract';

import Auth0Provider from 'next-auth/providers/auth0';
import NextAuth from 'next-auth';

import { getSingleUserByAuth0 } from '#/lib/personnel/single';

import { hasRoles } from '#/lib/auth/authn';

export default NextAuth({
  theme: {
    colorScheme: 'dark',
    logo: '/Paradigm_Branding_Logo-white.png',
  },
  callbacks: {
    async jwt({ token, account }): Promise<JWT | UsrJwt> {
      const usr = await getSingleUserByAuth0(token.sub as string);
      Object.assign(token, { roles: usr.roles });
      return token;
    },
    async session({ session, token }): Promise<Session | UsrSession> {
      if (hasRoles(token)) {
        const { roles } = token;
        Object.assign(session, { roles });
      }
      Object.assign(session, { id: token.sub });
      return session;
    },
  },
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID as string,
      clientSecret: process.env.AUTH0_CLIENT_SECRET as string,
      issuer: process.env.AUTH0_ISSUER_BASE_URL as string,
    }),
  ],
});
