import { User } from "@prisma/client";

export interface UserResponse {
  data: Data;
  message: string;
  status: number;
}

export interface Data {
  token: string;
  user: User;
}
