import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { baseUrl } from "@app/core/env";
import { Observable } from "rxjs";
import { IContactUsFormDetail, IContactUsFormResponse } from "../model";

@Injectable({
  providedIn: "root",
})
export class ContactUsFormService {
  http = inject(HttpClient);

  getContactUsForm(): Observable<IContactUsFormResponse> {
    return this.http.get<IContactUsFormResponse>(
      `${baseUrl}api/contact-us-form`
    );
  }
  getContactUsFormById(id: number): Observable<IContactUsFormDetail> {
    return this.http.get<IContactUsFormDetail>(
      `${baseUrl}api/contact-us-form/${id}`
    );
  }
}
