import { Status } from "@prisma/client";

export interface InputItem {
  value: string;
  isEditing: boolean;
}

export interface SocialInput {
  name: string;
  url: string;
  status: Status;
}

export interface ContactUsForm {
  phone: InputItem[];
  email: InputItem[];
  socials: SocialInput[];
  description: string;
}
