import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { baseUrl } from "@app/core/env";
import { Observable } from "rxjs";
import { ICareer, ICareerDetails, ICareers } from "../model/career";

@Injectable({
  providedIn: "root",
})
export class CareersService {
  http = inject(HttpClient);

  disableCareer(id: number): Observable<ICareers> {
    return this.http.post<ICareers>(`${baseUrl}api/careers/${id}/delete`, {});
  }

  activeCareer(id: number): Observable<ICareers> {
    return this.http.post<ICareers>(`${baseUrl}api/careers/${id}/recover`, {});
  }

  getCareer(id: number): Observable<ICareerDetails> {
    return this.http.get<ICareerDetails>(`${baseUrl}api/careers/${id}`);
  }

  updateCareer(id: number, data: ICareer): Observable<ICareers> {
    return this.http.post<ICareers>(`${baseUrl}api/careers/${id}`, data);
  }

  getCareers(): Observable<ICareers> {
    return this.http.get<ICareers>(`${baseUrl}api/careers`);
  }

  addCareer(data: ICareer): Observable<ICareerDetails> {
    return this.http.post<ICareerDetails>(`${baseUrl}api/careers`, data);
  }

  addUpdateCareer(data: ICareer, id?: number) {
    const formData = new FormData();
    formData.append("en_name", data.en_name);
    formData.append("ar_name", data.ar_name);
    formData.append("en_type", data.en_type);
    formData.append("ar_type", data.ar_type);
    formData.append("en_location", data.en_location);
    formData.append("ar_location", data.ar_location);
    formData.append("en_category_name", data.en_category_name);
    formData.append("ar_category_name", data.ar_category_name);
    formData.append("en_title", data.en_title);
    formData.append("ar_title", data.ar_title);
    formData.append("en_description", data.en_description);
    formData.append("ar_description", data.ar_description);
    formData.append("en_meta_title", data.en_meta_title);
    formData.append("ar_meta_title", data.ar_meta_title);
    formData.append("en_meta_description", data.en_meta_description);
    formData.append("ar_meta_description", data.ar_meta_description);
    formData.append("en_title_requirements", data.en_title_requirements);
    formData.append("ar_title_requirements", data.ar_title_requirements);
    formData.append(
      "en_description_requirements",
      data.en_description_requirements
    );
    formData.append(
      "ar_description_requirements",
      data.ar_description_requirements
    );
    formData.append(
      "en_title_responsibilities",
      data.en_title_responsibilities
    );
    formData.append(
      "ar_title_responsibilities",
      data.ar_title_responsibilities
    );
    formData.append(
      "en_description_responsibilities",
      data.en_description_responsibilities
    );
    formData.append(
      "ar_description_responsibilities",
      data.ar_description_responsibilities
    );
    formData.append("en_title_skills", data.en_title_skills);
    formData.append("ar_title_skills", data.ar_title_skills);
    formData.append("en_description_skills", data.en_description_skills);
    formData.append("ar_description_skills", data.ar_description_skills);

    if (id) {
      return this.updateCareer(id, data);
    } else {
      return this.addCareer(data);
    }
  }
}
