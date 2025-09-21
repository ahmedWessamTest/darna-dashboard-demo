export interface ISeo {
  data: ISeoData[];
}

export interface ISeoDetails {
  data: ISeoData;
}
export interface ISeoData {
  id: number;
  en_meta_title: string;
  ar_meta_title: string;
  en_meta_description: string;
  ar_meta_description: string;
  page_name: string;
}
