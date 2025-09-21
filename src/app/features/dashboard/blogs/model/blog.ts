export interface IBlog {
  data: IBlogData[];
}
export interface IBlogDetails {
  data: IBlogData;
}

export interface IBlogData {
  id: number;
  en_blog_title: string;
  ar_blog_title: string;
  en_blog_text: string;
  ar_blog_text: string;
  main_image: string;
  en_alt_image: string;
  ar_alt_image: string;
  en_slug: string;
  ar_slug: string;
  blog_date: string;
  en_meta_title: string;
  ar_meta_title: string;
  en_meta_text: string;
  ar_meta_text: string;
  en_first_script_text: string;
  ar_first_script_text: string;
  en_second_script_text: string;
  ar_second_script_text: string;
  active_status: string;
}
