export interface ICareers {
  data: ICareer[];
}

export interface ICareerDetails {
  data: ICareer;
}

export interface ICareer {
  id: number;
  en_name: string;
  ar_name: string;
  en_slug: string;
  ar_slug: string;
  en_type: string;
  ar_type: string;
  en_location: string;
  ar_location: string;
  en_category_name: string;
  ar_category_name: string;
  en_title: string;
  ar_title: string;
  en_description: string;
  ar_description: string;
  en_title_requirements: string;
  ar_title_requirements: string;
  en_description_requirements: string;
  ar_description_requirements: string;
  en_title_responsibilities: string;
  ar_title_responsibilities: string;
  en_description_responsibilities: string;
  ar_description_responsibilities: string;
  en_title_skills: string;
  ar_title_skills: string;
  en_description_skills: string;
  ar_description_skills: string;
  en_meta_title: string;
  ar_meta_title: string;
  en_meta_description: string;
  ar_meta_description: string;
  career_date: string;
  active_status: number;
}
