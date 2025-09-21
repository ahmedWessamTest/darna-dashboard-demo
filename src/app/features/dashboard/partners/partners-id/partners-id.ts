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
import { IData } from "@app/features/dashboard/hero/models";
import { DetailsSharedModule } from "@app/theme/shared/module/shared/details-shared.module";
import { MessageService } from "primeng/api";
import { IPartnerData } from "../models/partners";
import { PartnersService } from "../services/partners";

@Component({
  selector: "app-partners-id",
  imports: [DetailsSharedModule],
  templateUrl: "./partners-id.html",
  styleUrl: "./partners-id.scss",
})
export class PartnersId implements OnInit {
  private partnersService = inject(PartnersService);

  private fb = inject(FormBuilder);

  private messageService = inject(MessageService);

  private route = inject(ActivatedRoute);

  private router = inject(Router);

  // Signals for reactive state
  mode = signal<"create" | "edit" | "view">("create");

  partnerId = signal<number | null>(null);

  isLoading = signal(false);

  partner!: IPartnerData;

  partnerForm!: FormGroup;

  baseUrl = baseUrl;

  selectedFile: File | null = null;

  // Computed properties
  isEditMode = computed(() => this.mode() === "edit");
  isCreateMode = computed(() => this.mode() === "create");
  isViewMode = computed(() => this.mode() === "view");

  // Form validation including file check for create mode
  isFormValid = computed(() => {
    if (!this.partnerForm) return false;

    const formValid = this.partnerForm.valid;

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
        return "Create New Slider";
      case "edit":
        return "Edit Slider Mode";
      case "view":
        return "View Slider Mode";
      default:
        return "Slider Form";
    }
  });

  constructor() {
    // Effect to handle form enable/disable based on mode
    effect(() => {
      if (this.partnerForm) {
        if (this.isViewMode()) {
          this.partnerForm.disable();
        } else {
          this.partnerForm.enable();
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
        this.partnerId.set(+id);
        this.loadSliderData(+id);
      }
    });
  }

  initForm() {
    this.partnerForm = this.fb.group({
      en_alt_image: ["", [Validators.required]],
      ar_alt_image: ["", [Validators.required]],
      ar_client_name: ["", [Validators.required, Validators.minLength(3)]],
      en_client_name: ["", [Validators.required, Validators.minLength(3)]],
      active_status: ["1", Validators.required],
      // Note: main_image is handled separately as a file
    });
  }

  loadSliderData(id?: number) {
    const partnerId = id || this.partnerId() || 1;

    this.partnersService.getPartner(partnerId).subscribe({
      next: (data) => {
        this.partner = data.data;
        this.partnerForm.patchValue({
          en_alt_image: this.partner.en_alt_image,
          ar_alt_image: this.partner.ar_alt_image,
          en_client_name: this.partner.en_client_name,
          ar_client_name: this.partner.ar_client_name,
          active_status: this.partner.active_status,
        });
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error("Error loading partner data:", error);
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to load partner data",
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
    if (this.partnerForm.invalid || this.isViewMode()) return;

    this.isLoading.set(true);
    const formData = this.partnerForm.value;

    if (this.isCreateMode()) {
      this.createHero(formData);
    } else if (this.isEditMode()) {
      this.updateSliderHero();
    }
  }

  private createHero(formData: Partial<IData>) {
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

    this.partnersService
      .addPartner(formData as IPartnerData, this.selectedFile)
      .subscribe({
        next: (data) => {
          console.log("Create successful:", data);
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Hero created successfully",
          });
          this.router.navigate(["/dashboard/partner"]);
        },
        error: (error) => {
          console.error("Error creating partner:", error);
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Failed to create partner",
          });
          this.isLoading.set(false);
        },
      });
  }

  updateSliderHero() {
    if (this.partnerForm.valid) {
      this.isLoading.set(true);
      const formData = this.partnerForm.value;
      console.log(formData);

      // Pass the selected file if user uploaded a new one
      this.partnersService
        .updatePartner(
          this.partner.id,
          formData,
          this.selectedFile || undefined
        )
        .subscribe({
          next: (data) => {
            console.log("Update successful:", data);
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: "Slider updated successfully",
            });
            this.loadSliderData(); // Reload to get updated image
          },
          error: (error) => {
            console.error("Error updating partner:", error);
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Failed to update partner",
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
    this.router.navigate(["/dashboard/partners"]);
  }

  onEditSlider() {
    if (this.partnerId()) {
      this.router.navigate(["../../edit", this.partnerId()], {
        relativeTo: this.route,
      });
    }
  }
}
