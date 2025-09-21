export interface IPrivacyPolicyResponse {
  data: IPrivacyPolicy;
}

export interface IPrivacyPolicy {
  id: number;
  en_title: string;
  ar_title: string;
  en_description: string;
  ar_description: string;
}
