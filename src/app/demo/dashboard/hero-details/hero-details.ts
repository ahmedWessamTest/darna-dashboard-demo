import { CommonModule } from "@angular/common";
import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { baseUrl } from "@app/core/env";
import { IData } from "@app/features/dashboard/hero/models";
import { HeroService } from "@app/features/dashboard/hero/services/hero";
import { IProjectListName } from "@app/features/dashboard/projects/model";
import { ProjectsService } from "@app/features/dashboard/projects/service/projects";
import { NgxJoditComponent } from "ngx-jodit";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { Editor } from "primeng/editor";
import { FileUploadModule } from "primeng/fileupload";
import { InputTextModule } from "primeng/inputtext";
import { Select } from "primeng/select";
import { ToastModule } from "primeng/toast";

@Component({
  selector: "app-hero-details",
  imports: [
    FileUploadModule,
    CommonModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    ToastModule,
    Editor,
    FormsModule,
    ReactiveFormsModule,
    Select,
    NgxJoditComponent,
  ],
  templateUrl: "./hero-details.html",
  styleUrl: "./hero-details.scss",
  providers: [MessageService],
})
export class HeroDetails implements OnInit {
  private heroService = inject(HeroService);

  private projectsService = inject(ProjectsService);

  private fb = inject(FormBuilder);

  private messageService = inject(MessageService);

  private route = inject(ActivatedRoute);

  private router = inject(Router);

  text: string | undefined;

  mode = signal<"create" | "edit" | "view">("create");

  heroId = signal<number | null>(null);

  isLoading = signal(false);

  slider!: IData;

  projectListName = signal<IProjectListName[]>([]);

  heroForm!: FormGroup;

  baseUrl = baseUrl;

  selectedFile: File | null = null;

  isEditMode = computed(() => this.mode() === "edit");

  isCreateMode = computed(() => this.mode() === "create");

  isViewMode = computed(() => this.mode() === "view");

  // Form validation including file check for create mode
  isFormValid = computed(() => {
    if (!this.heroForm) return false;

    const formValid = this.heroForm.valid;

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
      if (this.heroForm) {
        if (this.isViewMode()) {
          this.heroForm.disable();
        } else {
          this.heroForm.enable();
        }
      }
    });
  }

  ngOnInit() {
    this.initForm();
    this.setupRouteHandling();
    this.getProjectListName();
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
        this.loadSliderData(+id);
      }
    });
  }

  initForm() {
    this.heroForm = this.fb.group({
      en_title: ["", [Validators.required, Validators.minLength(3)]],
      ar_title: ["", [Validators.required, Validators.minLength(3)]],
      en_alt_image: ["", [Validators.required]],
      ar_alt_image: ["", [Validators.required]],
      en_description: ["", [Validators.required, Validators.minLength(3)]],
      ar_description: ["", [Validators.required, Validators.minLength(3)]],
      active_status: ["1", Validators.required],
      project_id: ["", Validators.required],
      // Note: main_image is handled separately as a file
    });
  }

  loadSliderData(id?: number) {
    const sliderId = id || this.heroId() || 1;

    this.heroService.getSlider(sliderId).subscribe({
      next: (data) => {
        this.slider = data.data;
        this.heroForm.patchValue({
          en_title: data.data.en_title,
          en_alt_image: data.data.en_alt_image,
          ar_title: data.data.ar_title,
          ar_description: data.data.ar_description,
          ar_alt_image: data.data.ar_alt_image,
          en_description: data.data.en_description,
          active_status: data.data.active_status,
          project_id: data.data.project_id,
        });
        console.log(this.slider);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error("Error loading slider data:", error);
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to load slider data",
        });
        this.isLoading.set(false);
      },
    });
  }

  getProjectListName() {
    this.projectsService.getProjectListName().subscribe((data) => {
      this.projectListName.set(data.projects);
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
    if (this.heroForm.invalid || this.isViewMode()) return;
    console.log(this.heroForm.value);
    this.isLoading.set(true);
    const formData = this.heroForm.value;
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

    this.heroService.addSlider(formData as IData, this.selectedFile).subscribe({
      next: (data) => {
        console.log("Create successful:", data);
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: "Hero created successfully",
        });
        this.router.navigate(["/dashboard/hero"]);
      },
      error: (error) => {
        console.error("Error creating hero:", error);
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to create hero",
        });
        this.isLoading.set(false);
      },
    });
  }

  updateSliderHero() {
    if (this.heroForm.valid) {
      this.isLoading.set(true);
      const formData = this.heroForm.value;
      console.log(formData);

      // Pass the selected file if user uploaded a new one
      this.heroService
        .updateSlider(this.slider.id, formData, this.selectedFile || undefined)
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
            console.error("Error updating slider:", error);
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Failed to update slider",
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
    this.router.navigate(["/dashboard/hero"]);
  }

  onEditSlider() {
    if (this.heroId()) {
      this.router.navigate(["../../edit", this.heroId()], {
        relativeTo: this.route,
      });
    }
  }
}
