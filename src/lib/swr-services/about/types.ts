export interface AboutResponse {
  data: Data;
  message: string;
  status: number;
}

export interface Data {
  id: string;
  slogan: string;
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}
