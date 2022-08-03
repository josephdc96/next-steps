import type { JWT } from 'next-auth/jwt';
import type { Session } from 'next-auth';
import type { UsrJwt, UsrSession } from '#/lib/auth/contract';

import Auth0Provider from 'next-auth/providers/auth0';
import CredentialsProvider from 'next-auth/providers/credentials';
import NextAuth from 'next-auth';

import { getSingleUserByEmail } from '#/lib/personnel/single';

import { hasRoles } from '#/lib/auth/authn';
import { connectToDatabase } from '#/lib/mongo/conn';
import { verifyPassword } from '#/lib/auth/middleware/passwd';

export default NextAuth({
  theme: {
    colorScheme: 'dark',
    logo: '/Paradigm_Branding_Logo-white.png',
  },
  callbacks: {
    async jwt({ token, account }): Promise<JWT | UsrJwt> {
      const usr = await getSingleUserByEmail(token.email as string);
      Object.assign(token, { roles: usr.roles, teams: usr.teams });
      return token;
    },
    async session({ session, token }): Promise<Session | UsrSession> {
      if (hasRoles(token)) {
        const { roles } = token;
        Object.assign(session, { roles });
      }
      Object.assign(session, { teams: token.teams });
      Object.assign(session, { id: token.sub });
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const client = await connectToDatabase();

        if (!credentials) {
          throw new Error('Invalid credentials');
        }

        const usersCollection = client.db.collection('personnel');
        const user = await usersCollection.findOne({
          email: credentials.email,
        });

        if (!user) {
          throw new Error('No user found!');
        }

        const isValid = await verifyPassword(
          credentials.password,
          user.password,
        );

        if (!isValid) {
          throw new Error('Could not log you in!');
        }

        return { email: user.email, roles: user.roles, teams: user.teams };
      },
    }),
  ],
});
