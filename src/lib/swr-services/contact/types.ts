export interface ContactResponse {
  status: number;
  message: string;
  data: Data;
}

export interface Data {
  id: string;
  phone: Phone[];
  email: Email[];
  description: string;
  socials: Social[];
}

export interface Phone {
  value: string;
  isEditing: boolean;
}

export interface Email {
  value: string;
  isEditing: boolean;
}

export interface Social {
  id: string;
  name: string;
  url: string;
  slug: string;
  contactId: string;
  status: string;
  image: string;
}
