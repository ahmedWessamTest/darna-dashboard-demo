export interface IPartners {
  data: IPartnerData[];
}
export interface IPartnerResponse {
  data: IPartnerData;
}

export interface IPartnerData {
  id: number;
  en_alt_image: string;
  ar_alt_image: string;
  main_image: string;
  en_client_name: string;
  ar_client_name: string;
  active_status: string;
}
