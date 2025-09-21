export interface IProject {
  data: IProjectResponse[];
}
export interface IProjectDetails {
  data: IProjectResponse;
}

export interface IProjectResponse {
  id: number;
  en_alt_main_image: string;
  ar_alt_main_image: string;
  main_image: string;
  en_alt_banner_image: string;
  ar_alt_banner_image: string;
  banner_image: string;
  main_file_link: string;
  google_map_link: string;
  en_form_first_input_info: string;
  ar_form_first_input_info: string;
  en_form_second_input_info: string;
  ar_form_second_input_info: string;
  en_title_form: string;
  ar_title_form: string;
  en_description_form: string;
  ar_description_form: string;
  en_project_name: string;
  ar_project_name: string;
  en_small_text: string;
  ar_small_text: string;
  en_project_title: string;
  ar_project_title: string;
  en_project_description: string;
  ar_project_description: string;
  en_script_text: string;
  ar_script_text: string;
  en_meta_title: string;
  ar_meta_title: string;
  en_meta_description: string;
  ar_meta_description: string;
  en_slug: string;
  ar_slug: string;
  active_status: string;
  project_form_second: IProjectChoicesInputData[];
  project_form_first: IProjectChoicesInputData[];
}

export interface IProjectGalleryResponse {
  data: IProjectGallery[];
}
export interface IProjectGallery {
  id: number;
  en_alt_name: string;
  ar_alt_name: string;
  main_image: string;
  active_status: string;
  project_id: number;
}

export interface IProjectChoicesInput {
  data: IProjectChoicesInputData[];
}
export interface IProjectChoicesInputData {
  id: number;
  project_id: string;
  en_input_info: string;
  ar_input_info: string;
  active_status: string;
}

export interface IProjectListName {
  projects: IProjectListName[];
}

export interface IProjectListName {
  project_name: string;
  slug?: string;
  id: number;
}
