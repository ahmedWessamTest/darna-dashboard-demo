import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { baseUrl } from "@app/core/env";
import { Observable } from "rxjs";
import { IBlog, IBlogData, IBlogDetails } from "../model/blog";

@Injectable({
  providedIn: "root",
})
export class BlogService {
  http = inject(HttpClient);

  disableBlog(id: number): Observable<IBlog> {
    return this.http.post<IBlog>(`${baseUrl}api/blogs/${id}/delete`, {});
  }

  activeBlog(id: number): Observable<IBlog> {
    return this.http.post<IBlog>(`${baseUrl}api/blogs/${id}/recover`, {});
  }

  getBlog(id: number): Observable<IBlogDetails> {
    return this.http.get<IBlogDetails>(`${baseUrl}api/blogs/${id}`);
  }

  updateBlog(id: number, data: IBlogData): Observable<IBlogData> {
    return this.http.post<IBlogData>(`${baseUrl}api/blogs/${id}`, data);
  }

  getBlogs(): Observable<IBlog> {
    return this.http.get<IBlog>(`${baseUrl}api/blogs`);
  }

  addBlog(data: IBlogData): Observable<IBlogData> {
    return this.http.post<IBlogData>(`${baseUrl}api/blogs`, data);
  }

  addUpdateBlog(data: IBlogData, file?: File, id?: number) {
    const formData = new FormData();
    console.log(data);
    console.log(file);

    formData.append("en_blog_title", data.en_blog_title);
    formData.append("ar_blog_title", data.ar_blog_title);
    formData.append("en_blog_text", data.en_blog_text);
    formData.append("ar_blog_text", data.ar_blog_text);
    formData.append("en_alt_image", data.en_alt_image);
    formData.append("ar_alt_image", data.ar_alt_image);
    formData.append("en_meta_title", data.en_meta_title);
    formData.append("ar_meta_title", data.ar_meta_title);
    formData.append("en_meta_text", data.en_meta_text);
    formData.append("ar_meta_text", data.ar_meta_text);
    formData.append("en_first_script_text", data.en_first_script_text);
    formData.append("ar_first_script_text", data.ar_first_script_text);
    formData.append("en_second_script_text", data.en_second_script_text);
    formData.append("ar_second_script_text", data.ar_second_script_text);

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
      return this.http.post<IBlogData>(`${baseUrl}api/blogs/${id}`, formData);
    } else {
      // Create new blog
      return this.http.post<IBlogData>(`${baseUrl}api/blogs`, formData);
    }
  }
}
