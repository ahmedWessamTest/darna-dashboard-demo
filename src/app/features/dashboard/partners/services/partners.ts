import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { baseUrl } from "@app/core/env";
import {
  IPartnerData,
  IPartnerResponse,
  IPartners,
} from "@app/features/dashboard/partners/models/partners";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PartnersService {
  http = inject(HttpClient);

  disablePartner(id: number): Observable<IPartners> {
    return this.http.post<IPartners>(`${baseUrl}api/clients/${id}/delete`, {});
  }

  activePartner(id: number): Observable<IPartners> {
    return this.http.get<IPartners>(`${baseUrl}api/clients/${id}/recover`);
  }

  getPartner(id: number): Observable<IPartnerResponse> {
    return this.http.get<IPartnerResponse>(`${baseUrl}api/clients/${id}`);
  }

  updatePartner(
    id: number,
    data: IPartnerData,
    imageFile?: File
  ): Observable<IPartners> {
    const formData = new FormData();
    formData.append("en_client_name", data.en_client_name);
    formData.append("ar_client_name", data.ar_client_name);
    formData.append("en_alt_image", data.en_alt_image);
    formData.append("ar_alt_image", data.ar_alt_image);
    formData.append("main_image", imageFile);

    return this.http.post<IPartners>(`${baseUrl}api/clients/${id}`, formData);
  }

  getPartners(): Observable<IPartners> {
    return this.http.get<IPartners>(`${baseUrl}api/clients`);
  }

  addPartner(data: IPartnerData, imageFile?: File): Observable<IPartners> {
    const formData = new FormData();
    formData.append("en_client_name", data.en_client_name);
    formData.append("ar_client_name", data.ar_client_name);
    formData.append("en_alt_image", data.en_alt_image);
    formData.append("ar_alt_image", data.ar_alt_image);
    formData.append("main_image", imageFile);

    return this.http.post<IPartners>(`${baseUrl}api/clients`, formData);
  }

  createFormData(data: IPartnerData) {
    const formData = new FormData();
    formData.append("en_client_name", data.en_client_name);
    formData.append("ar_client_name", data.ar_client_name);
    formData.append("en_alt_image", data.en_alt_image);
    formData.append("ar_alt_image", data.ar_alt_image);
    formData.append("main_image", data.main_image);
  }
}
