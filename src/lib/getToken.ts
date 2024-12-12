"use server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

import { SessionData, sessionOptions } from "./session-options";

const getToken = async () => {
  return await getIronSession<SessionData>(
    await cookies(),
    sessionOptions,
  ).then((data) => data?.adminToken);
};

export default getToken;
