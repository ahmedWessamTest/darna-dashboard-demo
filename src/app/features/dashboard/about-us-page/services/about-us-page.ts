import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { baseUrl } from "@app/core/env";
import { Observable } from "rxjs";
import { IAboutDataPage, IAboutUsPage } from "../models/about-us-page";

@Injectable({
  providedIn: "root",
})
export class AboutUServicePage {
  http = inject(HttpClient);

  getAboutUs(): Observable<IAboutUsPage> {
    return this.http.get<IAboutUsPage>(`${baseUrl}api/about-us`);
  }

  updateAboutUs(
    data: IAboutDataPage,
    file: File | undefined
  ): Observable<IAboutUsPage> {
    const formData = new FormData();
    formData.append("en_main_title", data.en_main_title);
    formData.append("en_main_text", data.en_main_text);
    formData.append("ar_main_title", data.ar_main_title);
    formData.append("ar_main_text", data.ar_main_text);
    formData.append("en_alt_image", data.en_alt_image);
    formData.append("ar_alt_image", data.ar_alt_image);
    formData.append("en_mission_text", data.en_mission_text);
    formData.append("ar_mission_text", data.ar_mission_text);
    formData.append("en_vision_text", data.en_vision_text);
    formData.append("ar_vision_text", data.ar_vision_text);
    if (file) {
      formData.append("main_image", file);
    }
    return this.http.post<IAboutUsPage>(`${baseUrl}api/about-us/1`, formData);
  }
}
