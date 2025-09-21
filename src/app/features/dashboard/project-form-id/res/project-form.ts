import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { baseUrl } from "@app/core/env";
import { Observable } from "rxjs";
import {
  IProjectForm,
  IprojectFormDetails,
  IProjectFormResponse,
} from "./projectForm";

@Injectable({
  providedIn: "root",
})
export class ProjectFormService {
  http = inject(HttpClient);

  getProjectForm(): Observable<IProjectForm> {
    return this.http.get<IProjectForm>(`${baseUrl}api/projdct-forms`);
  }

  getProjectFormDetails(id: number): Observable<IprojectFormDetails> {
    return this.http.get<IprojectFormDetails>(
      `${baseUrl}api/projdct-forms/${id}`
    );
  }

  markAsRead(id: number): Observable<IProjectFormResponse> {
    return this.http.put<IProjectFormResponse>(
      `${baseUrl}api/projdct-forms/${id}/mark-read`,
      {}
    );
  }
}
