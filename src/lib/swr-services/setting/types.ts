export interface SettingResponse {
  data: SettingData[];
  message: string;
  status: number;
}

export interface SettingData {
  id: string;
  type: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}
