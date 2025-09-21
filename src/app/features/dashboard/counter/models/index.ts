export interface ICounter {
  data: ICounterData[];
}
export interface ICounterDetails {
  data: ICounterData;
}

export interface ICounterData {
  id: number;
  en_counter_title: string;
  ar_counter_title: string;
  counter_number: string;
  main_image: string;
  en_alt_image: string;
  ar_alt_image: string;
  active_status: number;
}
