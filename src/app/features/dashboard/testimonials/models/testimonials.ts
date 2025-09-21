export interface ITestimonials {
  data: IDataTestimonials[];
}
export interface ITestimonialsDetails {
  data: IDataTestimonials;
}
export interface IDataTestimonials {
  id: number;
  en_name: string;
  ar_name: string;
  en_job: string;
  ar_job: string;
  en_text: string;
  ar_text: string;
  active_status: string;
}
