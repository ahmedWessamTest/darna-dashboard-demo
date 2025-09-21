import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { baseUrl } from "@app/core/env";
import { DetailsSharedModule } from "@app/theme/shared/module/shared/details-shared.module";
import { NgxJoditComponent } from "ngx-jodit";
import { MessageService } from "primeng/api";
import { Editor } from "primeng/editor";
import { TextareaModule } from "primeng/textarea";
import { IBlogData } from "../model/blog";
import { BlogService } from "../service/blog";

@Component({
  selector: "app-blog-id",
  imports: [DetailsSharedModule, Editor, TextareaModule, NgxJoditComponent],
  templateUrl: "./blog-id.html",
  styleUrl: "./blog-id.scss",
})
export class BlogId implements OnInit {
  private blogService = inject(BlogService);

  private fb = inject(FormBuilder);

  private messageService = inject(MessageService);

  private route = inject(ActivatedRoute);

  private router = inject(Router);

  mode = signal<"create" | "edit" | "view">("create");

  blogId = signal<number | null>(null);

  isLoading = signal(false);

  blog!: IBlogData;

  blogForm!: FormGroup;

  baseUrl = baseUrl;

  selectedFile: File | null = null;

  isEditMode = computed(() => this.mode() === "edit");

  isCreateMode = computed(() => this.mode() === "create");

  isViewMode = computed(() => this.mode() === "view");

  // Form validation including file check for create mode
  isFormValid = computed(() => {
    if (!this.blogForm) return false;

    const formValid = this.blogForm.valid;

    // In create mode, also require image file
    if (this.isCreateMode()) {
      return formValid && !!this.selectedFile;
    }
    // In edit/view mode, form validation is enough
    return formValid;
  });

  pageTitle = computed(() => {
    switch (this.mode()) {
      case "create":
        return "Create New Blog";
      case "edit":
        return "Edit Blog Mode";
      case "view":
        return "View Blog Mode";
      default:
        return "Blog Form";
    }
  });

  constructor() {
    // Effect to handle form enable/disable based on mode
    effect(() => {
      if (this.blogForm) {
        if (this.isViewMode()) {
          this.blogForm.disable();
        } else {
          this.blogForm.enable();
        }
      }
    });
  }

  ngOnInit() {
    this.initForm();
    this.setupRouteHandling();
  }

  private setupRouteHandling() {
    // Get route data for mode
    this.route.data.subscribe((data) => {
      const mode = data["mode"] || "create";
      this.mode.set(mode);
    });

    // Get route params for ID
    this.route.params.subscribe((params) => {
      const id = params["id"];
      if (id) {
        this.blogId.set(+id);
        this.loadBlogData(+id);
      }
    });
  }

  initForm() {
    this.blogForm = this.fb.group({
      en_blog_title: ["", [Validators.required]],
      ar_blog_title: ["", [Validators.required]],
      en_blog_text: ["", [Validators.required]],
      ar_blog_text: ["", [Validators.required]],
      en_alt_image: ["", [Validators.required]],
      ar_alt_image: ["", [Validators.required]],
      en_meta_title: ["", [Validators.required]],
      ar_meta_title: ["", [Validators.required]],
      en_meta_text: ["", [Validators.required]],
      ar_meta_text: ["", [Validators.required]],
      en_first_script_text: ["", [Validators.required]],
      ar_first_script_text: ["", [Validators.required]],
      en_second_script_text: ["", [Validators.required]],
      ar_second_script_text: ["", [Validators.required]],
      // Note: main_image is handled separately as a file
    });
  }

  loadBlogData(id?: number) {
    const blogId = id || this.blogId() || 1;

    this.blogService.getBlog(blogId).subscribe({
      next: (data) => {
        this.blog = data.data;
        this.blogForm.patchValue({
          en_blog_title: this.blog.en_blog_title,
          ar_blog_title: this.blog.ar_blog_title,
          en_blog_text: this.blog.en_blog_text,
          ar_blog_text: this.blog.ar_blog_text,
          main_image: this.blog.main_image,
          en_alt_image: this.blog.en_alt_image,
          ar_alt_image: this.blog.ar_alt_image,
          en_meta_title: this.blog.en_meta_title,
          ar_meta_title: this.blog.ar_meta_title,
          en_meta_text: this.blog.en_meta_text,
          ar_meta_text: this.blog.ar_meta_text,
          en_first_script_text: this.blog.en_first_script_text,
          ar_first_script_text: this.blog.ar_first_script_text,
          en_second_script_text: this.blog.en_second_script_text,
          ar_second_script_text: this.blog.ar_second_script_text,
        });
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error("Error loading blog data:", error);
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to load blog data",
        });
        this.isLoading.set(false);
      },
    });
  }

  onImageSelect(event: { files?: File[]; currentFiles?: File[] }) {
    const files = event.files || event.currentFiles;
    if (files && files.length > 0) {
      const file = files[0];

      // Validate file type
      if (!file.type.startsWith("image/")) {
        this.messageService.add({
          severity: "error",
          summary: "Invalid File",
          detail: "Please select an image file",
        });
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5000000) {
        this.messageService.add({
          severity: "error",
          summary: "File Too Large",
          detail: "Please select an image smaller than 5MB",
        });
        return;
      }

      // Store the file directly without conversion
      this.selectedFile = file;

      this.messageService.add({
        severity: "success",
        summary: "File Selected",
        detail: `Image "${file.name}" selected successfully`,
      });
    }
  }

  onSubmit() {
    console.log(this.blogForm.value);
    console.log(this.blogForm.controls);

    // Use the computed isFormValid for proper validation
    if (!this.isFormValid() || this.isViewMode()) {
      this.messageService.add({
        severity: "warn",
        summary: "Warning",
        detail:
          this.isCreateMode() && !this.selectedFile
            ? "Please select an image file and fill all required fields"
            : "Please fill all required fields correctly",
      });
      return;
    }

    this.isLoading.set(true);
    const formData = this.blogForm.value;

    if (this.isCreateMode()) {
      this.createBlog(formData);
    } else if (this.isEditMode()) {
      this.updateBlog();
    }
  }

  private createBlog(formData: Partial<IBlogData>) {
    // Validate that image is selected for create mode
    if (!this.selectedFile) {
      this.messageService.add({
        severity: "warn",
        summary: "Warning",
        detail: "Please select an image file",
      });
      this.isLoading.set(false);
      return;
    }

    this.blogService
      .addUpdateBlog(formData as IBlogData, this.selectedFile)
      .subscribe({
        next: (data) => {
          console.log("Create successful:", data);
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Blog created successfully",
          });
          this.router.navigate(["/dashboard/blogs"]);
        },
        error: (error) => {
          console.error("Error creating blog:", error);
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Failed to create blog",
          });
          this.isLoading.set(false);
        },
      });
  }

  updateBlog() {
    this.isLoading.set(true);
    const formData = this.blogForm.value;
    console.log(formData);

    // Pass the selected file if user uploaded a new one
    this.blogService
      .addUpdateBlog(
        formData as IBlogData,
        this.selectedFile || undefined,
        this.blog.id
      )
      .subscribe({
        next: (data) => {
          console.log("Update successful:", data);
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Blog updated successfully",
          });
          this.loadBlogData(); // Reload to get updated data
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error("Error updating blog:", error);
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Failed to update blog",
          });
          this.isLoading.set(false);
        },
      });
  }

  onCancel() {
    this.router.navigate(["/dashboard/blogs"]);
  }

  onEditBlog() {
    if (this.blogId()) {
      this.router.navigate(["../../edit", this.blogId()], {
        relativeTo: this.route,
      });
    }
  }
}
