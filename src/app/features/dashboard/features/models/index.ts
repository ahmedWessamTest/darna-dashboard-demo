export interface IFeature {
  data: IFeature[];
}

export interface IFeatureDetails {
  data: IFeatureData;
}
export interface IFeatureData {
  id: number;
  en_feature_title: string;
  ar_feature_title: string;
  en_feature_text: string;
  ar_feature_text: string;
  active_status: string;
}
