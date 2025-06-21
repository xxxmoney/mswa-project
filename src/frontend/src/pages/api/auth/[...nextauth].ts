import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Replace with your backend API endpoint
        //   const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        //     method: 'POST',
        //     headers: {
        //       'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //       email: credentials.email,
        //       password: credentials.password,
        //     }),
        //   })

        //   if (!response.ok) {
        //     return null
        //   }

        //   const user = await response.json()

        //   if (!user) {
        //     return null
        //   }

        if (credentials.email !== "test@test.com" && credentials.password !== "test") return null

          return {
            id: "1",
            email: "test@test.com",
            name: "Test User",
            // Add any other user data you want to include in the session
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}) 