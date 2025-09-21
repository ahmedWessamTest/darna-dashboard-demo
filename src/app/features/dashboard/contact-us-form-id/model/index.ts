export interface IContactUsFormResponse {
  data: IContactUsForm[];
}
export interface IContactUsFormDetail {
  data: IContactUsForm;
}
export interface IContactUsForm {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  is_read: number;
  created_at: string;
  updated_at: string;
}
