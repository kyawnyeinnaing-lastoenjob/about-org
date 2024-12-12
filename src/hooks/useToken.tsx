import { useEffect, useState } from "react";

import { getToken } from "@/lib";

export const useToken = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    async function fetchToken() {
      try {
        const token = await getToken();
        setToken(token || null);
      } catch (error) {
        console.error("Failed to get token:", error);
      }
    }

    fetchToken();
  }, []);

  return token;
};
