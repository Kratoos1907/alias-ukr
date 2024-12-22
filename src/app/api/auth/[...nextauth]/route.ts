import { NextAuthOptions } from 'next-auth';
import { admin } from '@/lib/firebase-admin';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const firestore = admin.firestore();

// Declare the authOptions with explicit type
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
  callbacks: {
    async session({ session, token }: any) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.sub || '', // Ensure the user ID is passed in the session
        };
      }
      return session;
    },

    async jwt({ token, user }: any) {
      if (user) {
        token.sub = user.id; // Attach the user's ID to the token
      }
      return token;
    },

    async signIn({ user }: { user: any; account: any; profile?: any }) {
      try {
        const userDocRef = firestore.collection('userProfiles').doc(user.id);
        const userDoc = await userDocRef.get();

        if (!userDoc.exists) {
          await userDocRef.set({
            email: user.email,
            name: user.name,
            image: user.image,
            createdAt: new Date(),
          });

          console.log('User document created for:', user.email);
        } else {
          console.log('User document exists already:', user.email);
        }
      } catch (error) {
        console.error('Error creating user document:', error);
        return false;
      }

      return true;
    },
  },
};

const handler = NextAuth(authOptions);

// Export both GET and POST methods to handle all requests
export { handler as GET, handler as POST };
