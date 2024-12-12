import { Status } from "@prisma/client";

export interface UserManagementResponse {
  data: User[];
  message: string;
  status: number;
}

export interface UserDetailResponse {
  data: User;
  message: string;
  status: number;
}

export interface User {
  id: string;
  name: string;
  userId: string;
  email: string;
  status: Status;
  phone: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}
