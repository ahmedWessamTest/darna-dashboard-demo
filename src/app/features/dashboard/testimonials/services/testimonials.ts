import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { baseUrl } from "@app/core/env";
import { Observable } from "rxjs";
import {
  IDataTestimonials,
  ITestimonials,
  ITestimonialsDetails,
} from "../models/testimonials";

@Injectable({
  providedIn: "root",
})
export class TestimonialsService {
  http = inject(HttpClient);

  disableTestimonials(id: number): Observable<ITestimonials> {
    return this.http.post<ITestimonials>(
      `${baseUrl}api/testimonials/${id}/delete`,
      {}
    );
  }

  activeTestimonials(id: number): Observable<ITestimonials> {
    return this.http.post<ITestimonials>(
      `${baseUrl}api/testimonials/${id}/recover`,
      {}
    );
  }

  getTestimonialById(id: number): Observable<ITestimonialsDetails> {
    return this.http.get<ITestimonialsDetails>(
      `${baseUrl}api/testimonials/${id}`
    );
  }

  updateTestimonials(
    id: number,
    data: IDataTestimonials
  ): Observable<IDataTestimonials> {
    return this.http.post<IDataTestimonials>(
      `${baseUrl}api/testimonials/${id}`,
      data
    );
  }

  getTestimonials(): Observable<ITestimonials> {
    return this.http.get<ITestimonials>(`${baseUrl}api/testimonials`);
  }

  addTestimonials(data: IDataTestimonials): Observable<IDataTestimonials> {
    return this.http.post<IDataTestimonials>(
      `${baseUrl}api/testimonials`,
      data
    );
  }

  addUpdateTestimonials(data: IDataTestimonials, id?: number) {
    const formData = new FormData();
    formData.append("en_name", data.en_name);
    formData.append("ar_name", data.ar_name);
    formData.append("en_job", data.en_job);
    formData.append("ar_job", data.ar_job);
    formData.append("en_text", data.en_text);
    formData.append("ar_text", data.ar_text);

    if (id) {
      return this.updateTestimonials(id, data);
    } else {
      return this.addTestimonials(data);
    }
  }
}
