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
import { MessageService } from "primeng/api";
import { ISeoData } from "../model";
import { SeoService } from "../service/seo";

@Component({
  selector: "app-seo-id",
  imports: [DetailsSharedModule],
  templateUrl: "./seo-id.html",
  styleUrl: "./seo-id.scss",
})
export class SeoId implements OnInit {
  private seoService = inject(SeoService);

  private fb = inject(FormBuilder);

  private messageService = inject(MessageService);

  private route = inject(ActivatedRoute);

  private router = inject(Router);

  mode = signal<"edit" | "view">("edit");

  seoId = signal<number | null>(null);

  isLoading = signal(false);

  seo!: ISeoData;

  seoForm!: FormGroup;

  baseUrl = baseUrl;

  selectedFile: File | null = null;

  isEditMode = computed(() => this.mode() === "edit");

  isViewMode = computed(() => this.mode() === "view");

  // Form validation including file check for create mode
  isFormValid = computed(() => {
    if (!this.seoForm) return false;

    const formValid = this.seoForm.valid;

    // In edit/view mode, form validation is enough
    return formValid;
  });

  pageTitle = computed(() => {
    switch (this.mode()) {
      case "edit":
        return "Edit SEO Mode";
      case "view":
        return "View SEO Mode";
      default:
        return "SEO Form";
    }
  });

  constructor() {
    // Effect to handle form enable/disable based on mode
    effect(() => {
      if (this.seoForm) {
        if (this.isViewMode()) {
          this.seoForm.disable();
        } else {
          this.seoForm.enable();
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
        this.seoId.set(+id);
        this.loadSeoData(+id);
      }
    });
  }

  initForm() {
    this.seoForm = this.fb.group({
      page_name: ["", [Validators.required, Validators.minLength(3)]],
      en_meta_title: ["", [Validators.required]],
      ar_meta_title: ["", [Validators.required]],
      en_meta_description: ["", [Validators.required]],
      ar_meta_description: ["", [Validators.required]],
    });
  }

  loadSeoData(id?: number) {
    const seoId = id || this.seoId() || 1;

    this.seoService.getSeo(seoId).subscribe({
      next: (data) => {
        this.seo = data.data;
        this.seoForm.patchValue({
          page_name: data.data.page_name,
          en_meta_title: data.data.en_meta_title,
          ar_meta_title: data.data.ar_meta_title,
          en_meta_description: data.data.en_meta_description,
          ar_meta_description: data.data.ar_meta_description,
        });
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error("Error loading SEO data:", error);
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to load SEO data",
        });
        this.isLoading.set(false);
      },
    });
  }

  onSubmit() {
    if (this.seoForm.invalid || this.isViewMode()) return;

    this.isLoading.set(true);
    this.updateSeo();
  }

  updateSeo() {
    if (this.seoForm.valid) {
      this.isLoading.set(true);
      const formData = this.seoForm.value;
      console.log(formData);

      // Pass the selected file if user uploaded a new one
      this.seoService.updateSeo(this.seo.id, formData).subscribe({
        next: (data) => {
          console.log("Update successful:", data);
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "SEO updated successfully",
          });
          this.loadSeoData(); // Reload to get updated image
        },
        error: (error) => {
          console.error("Error updating SEO:", error);
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Failed to update SEO",
          });
          this.isLoading.set(false);
        },
      });
    } else {
      this.messageService.add({
        severity: "warn",
        summary: "Warning",
        detail: "Please fill all required fields correctly",
      });
    }
  }

  onCancel() {
    this.router.navigate(["/dashboard/seo"]);
  }

  onEditSeo() {
    if (this.seoId()) {
      this.router.navigate(["../../edit", this.seoId()], {
        relativeTo: this.route,
      });
    }
  }
}
