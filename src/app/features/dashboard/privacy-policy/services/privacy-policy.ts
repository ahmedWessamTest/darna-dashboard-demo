import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { baseUrl } from "@app/core/env";
import { Observable } from "rxjs";
import { IPrivacyPolicy, IPrivacyPolicyResponse } from "../model";

@Injectable({
  providedIn: "root",
})
export class PrivacyPolicyService {
  http = inject(HttpClient);

  getPrivacyPolicy(): Observable<IPrivacyPolicyResponse> {
    return this.http.get<IPrivacyPolicyResponse>(
      `${baseUrl}api/privacy-policy`
    );
  }

  updatePrivacyPolicy(data: IPrivacyPolicy): Observable<IPrivacyPolicy> {
    const formData = new FormData();
    formData.append("en_title", data.en_title);
    formData.append("ar_title", data.ar_title);
    formData.append("en_description", data.en_description);
    formData.append("ar_description", data.ar_description);

    return this.http.post<IPrivacyPolicy>(
      `${baseUrl}api/privacy-policy`,
      formData
    );
  }
}
