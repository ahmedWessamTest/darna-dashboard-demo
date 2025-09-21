import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { baseUrl } from "@app/core/env";
import { Observable } from "rxjs";
import { ICounter, ICounterData, ICounterDetails } from "../models";

@Injectable({
  providedIn: "root",
})
export class CounterService {
  http = inject(HttpClient);

  disableCounter(id: number): Observable<ICounter> {
    return this.http.post<ICounter>(`${baseUrl}api/counters/${id}/delete`, {});
  }

  activeCounter(id: number): Observable<ICounter> {
    return this.http.post<ICounter>(`${baseUrl}api/counters/${id}/recover`, {});
  }

  getCounter(id: number): Observable<ICounterDetails> {
    return this.http.get<ICounterDetails>(`${baseUrl}api/counters/${id}`);
  }

  updateCounter(id: number, data: ICounterData): Observable<ICounterData> {
    return this.http.post<ICounterData>(`${baseUrl}api/counters/${id}`, data);
  }

  getCounters(): Observable<ICounter> {
    return this.http.get<ICounter>(`${baseUrl}api/counters`);
  }

  addCounter(data: ICounterData): Observable<ICounterData> {
    return this.http.post<ICounterData>(`${baseUrl}api/counters`, data);
  }

  addUpdateCounter(data: ICounterData, file?: File, id?: number) {
    const formData = new FormData();
    console.log(data);
    console.log(file);

    formData.append("en_counter_title", data.en_counter_title);
    formData.append("ar_counter_title", data.ar_counter_title);
    formData.append("counter_number", data.counter_number);
    formData.append("en_alt_image", data.en_alt_image);
    formData.append("ar_alt_image", data.ar_alt_image);

    // Handle image file - this is why you need the check
    if (file) {
      // New file uploaded - use it
      formData.append("main_image", file);
    } else if (data.main_image) {
      // No new file, but there's existing image data - preserve it
      formData.append("main_image", data.main_image);
    }

    // Use FormData for HTTP requests (not the separate methods)
    if (id) {
      // Update existing blog
      return this.http.post<ICounterData>(
        `${baseUrl}api/counters/${id}`,
        formData
      );
    } else {
      // Create new blog
      return this.http.post<ICounterData>(`${baseUrl}api/counters`, formData);
    }
  }
}
