export interface IProjectForm {
  data: IProjectFormData[];
}

export interface IprojectFormDetails {
  data: IProjectFormData;
}

export interface IProjectFormResponse {
  success: boolean;
  message: string;
}

export interface IProjectFormData {
  id: number;
  project_id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  first_input_value: string;
  second_input_value: string;
  project_date: string;
  is_read: string;
}
