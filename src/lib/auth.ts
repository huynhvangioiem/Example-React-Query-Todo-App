import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";

/**
 * NextAuth.js Configuration
 *
 * Configures Google OAuth authentication with database persistence.
 * Uses JWT strategy for session management.
 *
 * Required environment variables:
 * - GOOGLE_CLIENT_ID: OAuth client ID from Google Cloud Console
 * - GOOGLE_CLIENT_SECRET: OAuth client secret from Google Cloud Console
 * - NEXTAUTH_SECRET: Random string for JWT encryption
 * - NEXTAUTH_URL: Base URL of the application
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  // Configure Google as the only authentication provider
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    /**
     * Sign-in callback
     *
     * Called when a user signs in. Creates or updates the user in the database.
     * Only allows Google provider sign-ins.
     *
     * @returns true to allow sign-in, false to deny
     */
    async signIn({ user, account }) {
      // Only allow Google sign-in
      if (account?.provider !== "google") return false;

      // Upsert user in database (create if new, update if existing)
      await prisma.user.upsert({
        where: { googleId: account.providerAccountId },
        update: {
          email: user.email!,
          name: user.name,
          avatarUrl: user.image,
        },
        create: {
          email: user.email!,
          googleId: account.providerAccountId,
          name: user.name,
          avatarUrl: user.image,
        },
      });

      return true;
    },

    /**
     * Session callback
     *
     * Called whenever a session is checked. Adds the database user ID
     * to the session object for use in API routes and components.
     *
     * @returns Extended session with user.id from database
     */
    async session({ session, token }) {
      if (token.googleId) {
        // Fetch database user ID using Google ID from JWT
        const dbUser = await prisma.user.findUnique({
          where: { googleId: token.googleId as string },
          select: { id: true },
        });
        if (dbUser) {
          session.user.id = dbUser.id;
        }
      }
      return session;
    },

    /**
     * JWT callback
     *
     * Called when a JWT is created or updated. Stores the Google ID
     * in the token for later use in the session callback.
     *
     * @returns Token with googleId for database lookup
     */
    async jwt({ token, account }) {
      // Store Google ID in token on initial sign-in
      if (account) {
        token.googleId = account.providerAccountId;
      }
      return token;
    },
  },

  // Custom pages for authentication flow
  pages: {
    signIn: "/login", // Redirect to /login for sign-in
    error: "/login", // Redirect to /login on error
  },

  // Use JWT strategy (no database sessions)
  session: {
    strategy: "jwt",
  },
};
