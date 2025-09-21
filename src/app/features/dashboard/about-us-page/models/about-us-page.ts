export interface IAboutUsPage {
  data: IAboutDataPage;
}

export interface IAboutDataPage {
  id: number;
  en_main_title: string;
  ar_main_title: string;
  en_main_text: string;
  ar_main_text: string;
  en_alt_image: string;
  ar_alt_image: string;
  main_image: string;
  en_mission_text: string;
  ar_mission_text: string;
  en_vision_text: string;
  ar_vision_text: string;
}
