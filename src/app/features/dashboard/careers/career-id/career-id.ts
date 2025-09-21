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
import { ICareer } from "../model/career";
import { CareersService } from "../services/careers";

@Component({
  selector: "app-career-id",
  imports: [DetailsSharedModule, NgxJoditComponent],
  templateUrl: "./career-id.html",
  styleUrl: "./career-id.scss",
})
export class CareerId implements OnInit {
  private careerService = inject(CareersService);

  private fb = inject(FormBuilder);

  private messageService = inject(MessageService);

  private route = inject(ActivatedRoute);

  private router = inject(Router);

  text: string | undefined;

  // Signals for reactive state
  mode = signal<"create" | "edit" | "view">("create");
  CareerId = signal<number | null>(null);
  isLoading = signal(false);

  career!: ICareer;

  careerForm!: FormGroup;

  baseUrl = baseUrl;

  // Computed properties
  isEditMode = computed(() => this.mode() === "edit");
  isCreateMode = computed(() => this.mode() === "create");
  isViewMode = computed(() => this.mode() === "view");

  // Form validation including file check for create mode
  isFormValid = computed(() => {
    if (!this.career) return false;

    const formValid = this.careerForm.valid;

    // In create mode, also require image file
    if (this.isCreateMode()) {
      return formValid;
    }

    // In edit/view mode, form validation is enough
    return formValid;
  });

  pageTitle = computed(() => {
    switch (this.mode()) {
      case "create":
        return "Create New Career";
      case "edit":
        return "Edit Career Mode";
      case "view":
        return "View Career Mode";
      default:
        return "Career Form";
    }
  });

  constructor() {
    // Effect to handle form enable/disable based on mode
    effect(() => {
      if (this.career) {
        if (this.isViewMode()) {
          this.careerForm.disable();
        } else {
          this.careerForm.enable();
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
        this.CareerId.set(+id);
        this.loadcareerData(+id);
      }
    });
  }

  initForm() {
    this.careerForm = this.fb.group({
      en_name: ["", [Validators.required, Validators.minLength(3)]],
      ar_name: ["", [Validators.required, Validators.minLength(3)]],
      en_title: ["", [Validators.required, Validators.minLength(3)]],
      ar_title: ["", [Validators.required, Validators.minLength(3)]],
      en_type: ["", [Validators.required, Validators.minLength(3)]],
      ar_type: ["", [Validators.required, Validators.minLength(3)]],
      en_location: ["", [Validators.required, Validators.minLength(3)]],
      ar_location: ["", [Validators.required, Validators.minLength(3)]],
      en_category_name: ["", [Validators.required, Validators.minLength(3)]],
      ar_category_name: ["", [Validators.required, Validators.minLength(3)]],
      en_description: ["", [Validators.required, Validators.minLength(3)]],
      ar_description: ["", [Validators.required, Validators.minLength(3)]],
      en_title_requirements: ["", []],
      ar_title_requirements: ["", []],
      en_description_requirements: ["", []],
      ar_description_requirements: ["", []],
      en_title_responsibilities: ["", []],
      ar_title_responsibilities: ["", []],
      en_description_responsibilities: ["", []],
      ar_description_responsibilities: ["", []],
      en_title_skills: ["", []],
      ar_title_skills: ["", []],
      en_description_skills: ["", []],
      ar_description_skills: ["", []],
      en_meta_title: ["", []],
      ar_meta_title: ["", []],
      en_meta_description: ["", []],
      ar_meta_description: ["", []],
    });
  }

  loadcareerData(id?: number) {
    const careerId = id || this.CareerId() || 1;

    this.careerService.getCareer(careerId).subscribe({
      next: (data) => {
        this.career = data.data;
        this.careerForm.patchValue({
          en_name: data.data.en_name,
          ar_name: data.data.ar_name,
          en_slug: data.data.en_slug,
          ar_slug: data.data.ar_slug,
          en_type: data.data.en_type,
          ar_type: data.data.ar_type,
          en_location: data.data.en_location,
          ar_location: data.data.ar_location,
          en_category_name: data.data.en_category_name,
          ar_category_name: data.data.ar_category_name,
          en_title: data.data.en_title,
          ar_title: data.data.ar_title,
          en_description: data.data.en_description,
          ar_description: data.data.ar_description,
          en_title_requirements: data.data.en_title_requirements,
          ar_title_requirements: data.data.ar_title_requirements,
          en_description_requirements: data.data.en_description_requirements,
          ar_description_requirements: data.data.ar_description_requirements,
          en_title_responsibilities: data.data.en_title_responsibilities,
          ar_title_responsibilities: data.data.ar_title_responsibilities,
          en_description_responsibilities:
            data.data.en_description_responsibilities,
          ar_description_responsibilities:
            data.data.ar_description_responsibilities,
          en_title_skills: data.data.en_title_skills,
          ar_title_skills: data.data.ar_title_skills,
          en_description_skills: data.data.en_description_skills,
          ar_description_skills: data.data.ar_description_skills,
          en_meta_title: data.data.en_meta_title,
          ar_meta_title: data.data.ar_meta_title,
          en_meta_description: data.data.en_meta_description,
          ar_meta_description: data.data.ar_meta_description,
          active_status: data.data.active_status,
        });
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error("Error loading career data:", error);
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to load career data",
        });
        this.isLoading.set(false);
      },
    });
  }

  onSubmit() {
    if (this.careerForm.invalid || this.isViewMode()) return;

    this.isLoading.set(true);
    const formData = this.careerForm.value;

    if (this.isCreateMode()) {
      this.createCareer(formData);
    } else if (this.isEditMode()) {
      this.updateCareer();
    }
  }

  private createCareer(formData: Partial<ICareer>) {
    this.careerService.addCareer(formData as ICareer).subscribe({
      next: (data) => {
        console.log("Create successful:", data);
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: "Hero created successfully",
        });
        this.router.navigate(["/dashboard/careers"]);
      },
      error: (error) => {
        console.error("Error creating Careers:", error);
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to create Careers",
        });
        this.isLoading.set(false);
      },
    });
  }

  updateCareer() {
    if (this.careerForm.valid) {
      this.isLoading.set(true);
      const formData = this.careerForm.value;

      // Pass the selected file if user uploaded a new one
      this.careerService.updateCareer(this.career.id, formData).subscribe({
        next: () => {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Career updated successfully",
          });
          this.isLoading.set(false);
        },
        error: () => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Failed to update career",
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
    this.router.navigate(["/dashboard/careers"]);
  }

  onEditcareer() {
    if (this.CareerId()) {
      this.router.navigate(["../../edit", this.CareerId()], {
        relativeTo: this.route,
      });
    }
  }
}
