export interface UserResponse {
  status: number;
  message: string;
  data: Data;
}

export interface Data {
  id: string;
  name: string;
  userId: string;
  email: string;
  phone: string;
  password: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  roleId: string;
  role: {
    id: string;
    roleName: "Super Admin" | "User";
  };
}
