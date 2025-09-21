import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { baseUrl } from "@app/core/env";
import { Observable } from "rxjs";
import { IContactUs, IDataContactUs } from "../model/contact-us";

@Injectable({
  providedIn: "root",
})
export class ContactUsService {
  http = inject(HttpClient);

  getContactUs(): Observable<IContactUs> {
    return this.http.get<IContactUs>(`${baseUrl}api/contact-information`);
  }

  updateContactUs(data: IDataContactUs): Observable<IContactUs> {
    const formData = new FormData();
    formData.append("en_address", data.en_address);
    formData.append("ar_address", data.ar_address);
    formData.append("google_map_link", data.google_map_link);
    formData.append("en_working_hours", data.en_working_hours);
    formData.append("ar_working_hours", data.ar_working_hours);
    formData.append("main_phone", data.main_phone);
    formData.append("whatsapp_phone", data.whatsapp_phone);
    formData.append("main_email", data.main_email);
    formData.append("facebook_link", data.facebook_link);
    formData.append("instagram_link", data.instagram_link);
    formData.append("linkedin_link", data.linkedin_link);
    formData.append("twitter_link", data.twitter_link);
    formData.append("youtube_link", data.youtube_link);
    formData.append("snapchat_link", data.snapchat_link);
    formData.append("telegram_link", data.telegram_link);
    formData.append("tiktok_link", data.tiktok_link);
    formData.append("en_footer_text", data.en_footer_text);
    formData.append("ar_footer_text", data.ar_footer_text);
    return this.http.post<IContactUs>(
      `${baseUrl}api/contact-information/1`,
      formData
    );
  }
}
