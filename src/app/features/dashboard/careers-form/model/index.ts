export interface ICareersForm {
  data: ICareersFormData[];
}
export interface ICareersFormData {
  id: number;
  career_id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  experience: string;
  current_salary: string;
  expected_salary: string;
  cv_file: string;
  cover_letter: string;
  is_read: number;
}
