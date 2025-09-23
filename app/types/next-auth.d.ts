
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      firstName?: string | null;
      lastName?: string | null;
      companyName?: string | null;
      focusArea?: string | null;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    companyName?: string | null;
    focusArea?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub: string;
  }
}
