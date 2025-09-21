export interface ISlider {
  data: IData[];
  message: string;
  status: number;
}
export interface ISliderDetails {
  data: IData;
  message: string;
  status: number;
}
export interface IData {
  id: number;
  en_title: string;
  ar_title: string;
  en_description: string;
  ar_description: string;
  en_alt_image: string;
  ar_alt_image: string;
  main_image: string;
  active_status: string;
  project_id: string;
}
