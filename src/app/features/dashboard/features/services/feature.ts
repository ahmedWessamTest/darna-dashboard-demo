import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { baseUrl } from "@app/core/env";
import { Observable } from "rxjs";
import { IFeature, IFeatureData, IFeatureDetails } from "../models";

@Injectable({
  providedIn: "root",
})
export class Feature {
  http = inject(HttpClient);

  getFeature(id: number): Observable<IFeatureDetails> {
    return this.http.get<IFeatureDetails>(`${baseUrl}api/features/${id}`);
  }

  updateFeature(id: number, data: IFeatureData): Observable<IFeature> {
    const formData = new FormData();
    formData.append("en_feature_title", data.en_feature_title);
    formData.append("ar_feature_title", data.ar_feature_title);
    formData.append("en_feature_text", data.en_feature_text);
    formData.append("ar_feature_text", data.ar_feature_text);

    return this.http.post<IFeature>(`${baseUrl}api/features/${id}`, formData);
  }

  getfeatures(): Observable<IFeature> {
    return this.http.get<IFeature>(`${baseUrl}api/features`);
  }

  addFeature(data: IFeatureData): Observable<IFeature> {
    const formData = new FormData();
    formData.append("en_feature_title", data.en_feature_title);
    formData.append("ar_feature_title", data.ar_feature_title);
    formData.append("en_feature_text", data.en_feature_text);
    formData.append("ar_feature_text", data.ar_feature_text);

    return this.http.post<IFeature>(`${baseUrl}api/features`, formData);
  }
}
