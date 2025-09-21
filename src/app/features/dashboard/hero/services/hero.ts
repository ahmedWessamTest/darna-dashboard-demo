import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { baseUrl } from "@app/core/env";
import { Observable } from "rxjs";
import { IData, ISlider, ISliderDetails } from "../models";

@Injectable({
  providedIn: "root",
})
export class HeroService {
  http = inject(HttpClient);

  disableSlider(id: number): Observable<ISlider> {
    return this.http.post<ISlider>(`${baseUrl}api/sliders/${id}/delete`, {});
  }

  activeSlider(id: number): Observable<ISlider> {
    return this.http.post<ISlider>(`${baseUrl}api/sliders/${id}/recover`, {});
  }

  getSlider(id: number): Observable<ISliderDetails> {
    return this.http.get<ISliderDetails>(`${baseUrl}api/sliders/${id}`);
  }

  updateSlider(id: number, data: IData, imageFile?: File): Observable<ISlider> {
    const formData = new FormData();
    formData.append("en_title", data.en_title);
    formData.append("ar_title", data.ar_title);
    formData.append("en_description", data.en_description);
    formData.append("ar_description", data.ar_description);
    formData.append("en_alt_image", data.en_alt_image);
    formData.append("ar_alt_image", data.ar_alt_image);
    formData.append("project_id", data.project_id);

    // Handle file upload or existing image
    if (imageFile) {
      formData.append("main_image", imageFile);
    } else if (data.main_image) {
      formData.append("main_image", data.main_image);
    }

    return this.http.post<ISlider>(`${baseUrl}api/sliders/${id}`, formData);
  }

  getSliders(): Observable<ISlider> {
    return this.http.get<ISlider>(`${baseUrl}api/sliders`);
  }

  addSlider(data: IData, imageFile?: File): Observable<ISlider> {
    const formData = new FormData();
    formData.append("en_title", data.en_title);
    formData.append("ar_title", data.ar_title);
    formData.append("en_description", data.en_description);
    formData.append("ar_description", data.ar_description);
    formData.append("en_alt_image", data.en_alt_image);
    formData.append("ar_alt_image", data.ar_alt_image);
    formData.append("project_id", data.project_id);
    // Handle file upload
    if (imageFile) {
      formData.append("main_image", imageFile);
    } else if (data.main_image) {
      formData.append("main_image", data.main_image);
    }

    return this.http.post<ISlider>(`${baseUrl}api/sliders`, formData);
  }
}
