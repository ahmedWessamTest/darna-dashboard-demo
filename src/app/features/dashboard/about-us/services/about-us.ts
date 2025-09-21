import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { baseUrl } from "@app/core/env";
import { Observable } from "rxjs";
import { IAboutData, IAboutUs } from "../models/about-us";

@Injectable({
  providedIn: "root",
})
export class AboutUService {
  http = inject(HttpClient);

  getAboutUs(): Observable<IAboutUs> {
    return this.http.get<IAboutUs>(`${baseUrl}api/about-home`);
  }

  updateAboutUs(
    data: IAboutData,
    file: File | undefined
  ): Observable<IAboutUs> {
    const formData = new FormData();
    formData.append("en_main_title", data.en_main_title);
    formData.append("en_main_text", data.en_main_text);
    formData.append("ar_main_title", data.ar_main_title);
    formData.append("ar_main_text", data.ar_main_text);
    formData.append("en_alt_image", data.en_alt_image);
    formData.append("ar_alt_image", data.ar_alt_image);
    if (file) {
      formData.append("main_image", file);
    }
    return this.http.post<IAboutUs>(`${baseUrl}api/about-home/1`, formData);
  }
}
