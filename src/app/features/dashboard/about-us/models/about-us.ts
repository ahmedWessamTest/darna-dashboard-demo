export interface IAboutUs {
  data: IAboutData;
}

export interface IAboutData {
  id: number;
  en_main_title: string;
  ar_main_title: string;
  en_main_text: string;
  ar_main_text: string;
  en_alt_image: string;
  ar_alt_image: string;
  main_image: string;
}
