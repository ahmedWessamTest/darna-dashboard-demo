import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { baseUrl } from "@app/core/env";
import { Observable } from "rxjs";
import { ISeo, ISeoData, ISeoDetails } from "../model";

@Injectable({
  providedIn: "root",
})
export class SeoService {
  http = inject(HttpClient);

  getSeo(id: number): Observable<ISeoDetails> {
    return this.http.get<ISeoDetails>(`${baseUrl}api/seo-tag/${id}`);
  }

  updateSeo(id: number, data: ISeoData): Observable<ISeo> {
    const formData = new FormData();
    formData.append("page_name", data.page_name);

    formData.append("en_meta_title", data.en_meta_title);
    formData.append("ar_meta_title", data.ar_meta_title);
    formData.append("en_meta_description", data.en_meta_description);
    formData.append("ar_meta_description", data.ar_meta_description);

    return this.http.post<ISeo>(`${baseUrl}api/seo-tag/${id}`, formData);
  }

  getSeoList(): Observable<ISeo> {
    return this.http.get<ISeo>(`${baseUrl}api/seo-tag`);
  }
}
