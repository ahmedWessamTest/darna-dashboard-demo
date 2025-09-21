export interface IBanners {
  success: boolean;
  message: string;
  data: IBannerData[];
}

export interface IBannerDetails {
  data: IBannerData;
}
export interface IBannerData {
  id: number;
  main_image: string;
  en_alt_image: string;
  ar_alt_image?: string;
  page_name: string;
  created_at: string;
  updated_at: string;
}
