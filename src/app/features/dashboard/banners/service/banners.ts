import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { baseUrl } from "@app/core/env";
import { Observable } from "rxjs";
import { IBannerData, IBannerDetails, IBanners } from "../model";

@Injectable({
  providedIn: "root",
})
export class BannersService {
  http = inject(HttpClient);

  getBanner(id: number): Observable<IBannerDetails> {
    return this.http.get<IBannerDetails>(`${baseUrl}api/banner-image/${id}`);
  }

  updateBanner(
    id: number,
    data: IBannerData,
    imageFile?: File
  ): Observable<IBanners> {
    const formData = new FormData();
    formData.append("page_name", data.page_name);

    formData.append("en_alt_image", data.en_alt_image);
    formData.append("ar_alt_image", data.ar_alt_image);

    // Handle file upload or existing image
    if (imageFile) {
      formData.append("main_image", imageFile);
    } else if (data.main_image) {
      formData.append("main_image", data.main_image);
    }

    return this.http.post<IBanners>(
      `${baseUrl}api/banner-image/${id}`,
      formData
    );
  }

  getBanners(): Observable<IBanners> {
    return this.http.get<IBanners>(`${baseUrl}api/banner-image`);
  }
}
