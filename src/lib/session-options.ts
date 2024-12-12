import { SessionOptions } from "iron-session";

export interface SessionData {
  isLoggedIn: boolean;
  adminToken: string;
}

export const initialSession = {
  isLoggedIn: false,
  token: "",
};

export const sessionOptions: SessionOptions = {
  password: process.env.NEXT_PUBLIC_SESSION_SECRET as string,
  cookieName: process.env.NEXT_PUBLIC_COOKIES_NAME as string,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};
