import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { baseUrl } from "@app/core/env";
import { Observable } from "rxjs";
import { ICareersForm, ICareersFormData } from "../model";

// Interface for single career form response
export interface ICareersFormSingle {
  data: ICareersFormData;
}

// Interface for update responses
export interface IUpdateResponse {
  message: string;
  success: boolean;
}

@Injectable({
  providedIn: "root",
})
export class CareersFormService {
  private http = inject(HttpClient);

  getCareersForm(id: number): Observable<ICareersFormSingle> {
    return this.http.get<ICareersFormSingle>(
      `${baseUrl}api/career-forms/${id}`
    );
  }

  getCareersFormList(): Observable<ICareersForm> {
    return this.http.get<ICareersForm>(`${baseUrl}api/career-forms`);
  }

  markAsRead(id: number): Observable<IUpdateResponse> {
    return this.http.patch<IUpdateResponse>(
      `${baseUrl}api/career-forms/${id}/read`,
      {}
    );
  }

  updateCareersForm(
    id: number,
    data: Partial<ICareersFormData>
  ): Observable<ICareersFormSingle> {
    return this.http.put<ICareersFormSingle>(
      `${baseUrl}api/career-forms/${id}`,
      data
    );
  }
}
