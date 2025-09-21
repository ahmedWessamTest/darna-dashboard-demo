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
import { IBannerData } from "../model";
import { BannersService } from "../service/banners";

@Component({
  selector: "app-banner-id",
  imports: [DetailsSharedModule],
  templateUrl: "./banner-id.html",
  styleUrl: "./banner-id.scss",
})
export class BannerId implements OnInit {
  private bannerService = inject(BannersService);

  private fb = inject(FormBuilder);

  private messageService = inject(MessageService);

  private route = inject(ActivatedRoute);

  private router = inject(Router);

  text: string | undefined;

  mode = signal<"edit" | "view">("edit");

  heroId = signal<number | null>(null);

  isLoading = signal(false);

  banner!: IBannerData;

  bannerForm!: FormGroup;

  baseUrl = baseUrl;

  selectedFile: File | null = null;

  isEditMode = computed(() => this.mode() === "edit");

  isViewMode = computed(() => this.mode() === "view");

  // Form validation including file check for create mode
  isFormValid = computed(() => {
    if (!this.bannerForm) return false;

    const formValid = this.bannerForm.valid;

    // In edit/view mode, form validation is enough
    return formValid;
  });

  pageTitle = computed(() => {
    switch (this.mode()) {
      case "edit":
        return "Edit Banner Mode";
      case "view":
        return "View Banner Mode";
      default:
        return "Banner Form";
    }
  });

  constructor() {
    // Effect to handle form enable/disable based on mode
    effect(() => {
      if (this.bannerForm) {
        if (this.isViewMode()) {
          this.bannerForm.disable();
        } else {
          this.bannerForm.enable();
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
        this.heroId.set(+id);
        this.loadBannerData(+id);
      }
    });
  }

  initForm() {
    this.bannerForm = this.fb.group({
      page_name: ["", [Validators.required, Validators.minLength(3)]],
      en_alt_image: ["", [Validators.required]],
      ar_alt_image: ["", [Validators.required]],
      // Note: main_image is handled separately as a file
    });
  }

  loadBannerData(id?: number) {
    const bannerId = id || this.heroId() || 1;

    this.bannerService.getBanner(bannerId).subscribe({
      next: (data) => {
        this.banner = data.data;
        this.bannerForm.patchValue({
          page_name: data.data.page_name,
          en_alt_image: data.data.en_alt_image,
          ar_alt_image: data.data.ar_alt_image,
        });
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error("Error loading Banner data:", error);
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to load Banner data",
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
    if (this.bannerForm.invalid || this.isViewMode()) return;

    this.isLoading.set(true);
    this.updateBannerHero();
  }

  updateBannerHero() {
    if (this.bannerForm.valid) {
      this.isLoading.set(true);
      const formData = this.bannerForm.value;
      console.log(formData);

      // Pass the selected file if user uploaded a new one
      this.bannerService
        .updateBanner(this.banner.id, formData, this.selectedFile || undefined)
        .subscribe({
          next: (data) => {
            console.log("Update successful:", data);
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: "Banner updated successfully",
            });
            this.loadBannerData(); // Reload to get updated image
          },
          error: (error) => {
            console.error("Error updating Banner:", error);
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Failed to update Banner",
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
    this.router.navigate(["/dashboard/banners"]);
  }

  onEditBanner() {
    if (this.heroId()) {
      this.router.navigate(["../../edit", this.heroId()], {
        relativeTo: this.route,
      });
    }
  }
}
