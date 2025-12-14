import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const allowed = process.env.ALLOWED_USERS
  ? process.env.ALLOWED_USERS.split(",").map((s) => s.trim().toLowerCase())
  : [];

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile }) {
      const email = (user?.email || "").toLowerCase();
      if (allowed.length === 0) {
        // If no allowed list configured, deny by default
        return false;
      }
      return allowed.includes(email);
    },
    async session({ session, token, user }) {
      return session;
    },
  },
});

