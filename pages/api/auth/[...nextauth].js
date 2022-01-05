import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    // ...add more providers here
  ],
  callbacks: {
      async session({ session, token }) {
          session.user.tag = session.user.name.split(" ").join("").toLocaleLowerCase();
          session.user.id = token.sub;
          return session;
      }
  },
  secret: process.env.JWT_SECRET
})