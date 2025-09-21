import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { baseUrl } from "@app/core/env";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import {
  IProject,
  IProjectChoicesInput,
  IProjectChoicesInputData,
  IProjectDetails,
  IProjectGallery,
  IProjectGalleryResponse,
  IProjectListName,
  IProjectResponse,
} from "../model";
type endpoint = "project-form-second" | "project-form-first";
@Injectable({
  providedIn: "root",
})
export class ProjectsService {
  http = inject(HttpClient);

  /* Start Endpoints For Projects */
  disableProject(id: number): Observable<IProject> {
    return this.http.post<IProject>(`${baseUrl}api/projects/${id}/delete`, {});
  }

  activeProject(id: number): Observable<IProject> {
    return this.http.post<IProject>(`${baseUrl}api/projects/${id}/recover`, {});
  }

  getProject(id: number): Observable<IProjectDetails> {
    return this.http.get<IProjectDetails>(`${baseUrl}api/projects/${id}`);
  }

  updateProject(
    id: number,
    data: IProjectDetails
  ): Observable<IProjectDetails> {
    return this.http.post<IProjectDetails>(
      `${baseUrl}api/projects/${id}`,
      data
    );
  }

  getProjects(): Observable<IProject> {
    return this.http.get<IProject>(`${baseUrl}api/projects`);
  }

  addProject(data: IProjectDetails): Observable<IProjectDetails> {
    return this.http.post<IProjectDetails>(`${baseUrl}api/projects`, data);
  }

  addUpdateProject(
    data: IProjectResponse,
    mainImageFile?: File,
    projectId?: number,
    bannerImageFile?: File
  ) {
    console.log(data);
    const formData = new FormData();

    formData.append("en_alt_main_image", data.en_alt_main_image);
    formData.append("ar_alt_main_image", data.ar_alt_main_image);
    formData.append("en_alt_banner_image", data.en_alt_banner_image);
    formData.append("ar_alt_banner_image", data.ar_alt_banner_image);
    formData.append("main_file_link", data.main_file_link);
    formData.append("google_map_link", data.google_map_link);
    formData.append("en_form_first_input_info", data.en_form_first_input_info);
    formData.append("ar_form_first_input_info", data.ar_form_first_input_info);
    formData.append(
      "en_form_second_input_info",
      data.en_form_second_input_info
    );
    formData.append(
      "ar_form_second_input_info",
      data.ar_form_second_input_info
    );
    formData.append("en_title_form", data.en_title_form);
    formData.append("ar_title_form", data.ar_title_form);
    formData.append("en_description_form", data.en_description_form);
    formData.append("ar_description_form", data.ar_description_form);
    formData.append("en_project_name", data.en_project_name);
    formData.append("ar_project_name", data.ar_project_name);
    formData.append("en_small_text", data.en_small_text);
    formData.append("ar_small_text", data.ar_small_text);
    formData.append("en_project_title", data.en_project_title);
    formData.append("ar_project_title", data.ar_project_title);
    formData.append("en_project_description", data.en_project_description);
    formData.append("ar_project_description", data.ar_project_description);
    formData.append("en_script_text", data.en_script_text);
    formData.append("ar_script_text", data.ar_script_text);
    formData.append("en_meta_title", data.en_meta_title);
    formData.append("ar_meta_title", data.ar_meta_title);
    formData.append("en_meta_description", data.en_meta_description);
    formData.append("ar_meta_description", data.ar_meta_description);

    // Handle main image file
    if (mainImageFile) {
      // New main image file uploaded - use it
      formData.append("main_image", mainImageFile);
    } else if (data.main_image) {
      // No new file, but there's existing image data - preserve it
      formData.append("main_image", data.main_image);
    }

    // Handle banner image file
    if (bannerImageFile) {
      // New banner image file uploaded - use it
      formData.append("banner_image", bannerImageFile);
    } else if (data.banner_image) {
      // No new file, but there's existing image data - preserve it
      formData.append("banner_image", data.banner_image);
    }

    // Use FormData for HTTP requests
    if (projectId) {
      // Update existing project
      return this.http.post<IProjectResponse>(
        `${baseUrl}api/projects/${projectId}`,
        formData
      );
    } else {
      // Create new project
      return this.http.post<IProjectResponse>(
        `${baseUrl}api/projects`,
        formData
      );
    }
  }

  getProjectListName(): Observable<IProjectListName> {
    return this.http.get<IProjectListName>(
      `${baseUrl}api/projects/getprojects`
    );
  }

  /* Start Endpoints For Project Gallery */

  addProjectGallery(
    data: IProjectGallery
  ): Observable<IProjectGalleryResponse> {
    console.log(data);
    const formData = new FormData();
    formData.append("en_alt_name", data.en_alt_name);
    formData.append("ar_alt_name", data.ar_alt_name);
    formData.append("main_image", data.main_image);
    formData.append("project_id", data.project_id.toString());
    return this.http.post<IProjectGalleryResponse>(
      `${baseUrl}api/project-image`,
      formData
    );
  }

  updateProjectGallery(
    id: number,
    data: IProjectGallery
  ): Observable<IProjectGalleryResponse> {
    const formData = new FormData();
    formData.append("en_alt_name", data.en_alt_name);
    formData.append("ar_alt_name", data.ar_alt_name);
    formData.append("main_image", data.main_image);
    formData.append("project_id", data.project_id.toString());
    return this.http.post<IProjectGalleryResponse>(
      `${baseUrl}api/project-image/${id}`,
      formData
    );
  }

  deleteImageGallery(id: number): Observable<IProjectGalleryResponse> {
    return this.http.post<IProjectGalleryResponse>(
      `${baseUrl}api/project-image/${id}/delete`,
      {}
    );
  }

  activeImageGallery(id: number): Observable<IProjectGalleryResponse> {
    return this.http.post<IProjectGalleryResponse>(
      `${baseUrl}api/project-image/${id}/recover`,
      {}
    );
  }

  getImageGalleryById(id: number): Observable<IProjectGalleryResponse> {
    return this.http.get<IProjectGalleryResponse>(
      `${baseUrl}api/project-image/${id}`,
      {}
    );
  }

  getProjectGalleryImages(id: number): Observable<IProjectGallery[]> {
    return this.http
      .get<{
        data: IProjectGallery[];
      }>(`${baseUrl}api/project-image/${id}/index`)
      .pipe(map((response) => response.data));
  }

  /* End Endpoints For Project Gallery */

  getProjectChoicesInputById(
    endpoint: endpoint,
    id: number
  ): Observable<IProjectChoicesInput> {
    return this.http.get<IProjectChoicesInput>(
      `${baseUrl}api/${endpoint}/${id}`
    );
  }

  addProjectChoicesInput(
    endpoint: endpoint,
    data: IProjectChoicesInputData
  ): Observable<IProjectChoicesInput> {
    const Idata = new FormData();
    Idata.append("en_input_info", data.en_input_info);
    Idata.append("ar_input_info", data.ar_input_info);
    Idata.append("project_id", data.project_id.toString());
    return this.http.post<IProjectChoicesInput>(
      `${baseUrl}api/${endpoint}`,
      data
    );
  }

  updateProjectChoicesInput(
    endpoint: endpoint,
    id: number,
    data: IProjectChoicesInputData
  ): Observable<IProjectChoicesInput> {
    const Idata = new FormData();
    Idata.append("en_input_info", data.en_input_info);
    Idata.append("ar_input_info", data.ar_input_info);
    Idata.append("project_id", data.project_id.toString());
    return this.http.post<IProjectChoicesInput>(
      `${baseUrl}api/${endpoint}/${id}`,
      Idata
    );
  }

  deleteProjectChoicesInput(
    endpoint: endpoint,
    id: number
  ): Observable<IProjectChoicesInput> {
    return this.http.post<IProjectChoicesInput>(
      `${baseUrl}api/${endpoint}/${id}/delete`,
      {}
    );
  }

  activeProjectChoicesInput(
    endpoint: endpoint,
    id: number
  ): Observable<IProjectChoicesInput> {
    return this.http.post<IProjectChoicesInput>(
      `${baseUrl}api/${endpoint}/${id}/recover`,
      {}
    );
  }
}
