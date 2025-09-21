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
import { Editor } from "primeng/editor";
import { ICounterData } from "../models";
import { CounterService } from "../service/counter";

@Component({
  selector: "app-counter-id",
  imports: [DetailsSharedModule, Editor],
  templateUrl: "./counter-id.html",
  styleUrl: "./counter-id.scss",
})
export class Counter implements OnInit {
  private counterService = inject(CounterService);

  private fb = inject(FormBuilder);

  private messageService = inject(MessageService);

  private route = inject(ActivatedRoute);

  private router = inject(Router);

  mode = signal<"create" | "edit" | "view">("create");

  counterId = signal<number | null>(null);

  isLoading = signal(false);

  counter!: ICounterData;

  counterForm!: FormGroup;

  baseUrl = baseUrl;

  selectedFile: File | null = null;

  isEditMode = computed(() => this.mode() === "edit");

  isCreateMode = computed(() => this.mode() === "create");

  isViewMode = computed(() => this.mode() === "view");

  // Form validation including file check for create mode
  isFormValid = computed(() => {
    if (!this.counterForm) return false;

    const formValid = this.counterForm.valid;

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
      if (this.counterForm) {
        if (this.isViewMode()) {
          this.counterForm.disable();
        } else {
          this.counterForm.enable();
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
        this.counterId.set(+id);
        this.loadCounterData(+id);
      }
    });
  }

  initForm() {
    this.counterForm = this.fb.group({
      en_counter_title: ["", [Validators.required, Validators.minLength(3)]],
      ar_counter_title: ["", [Validators.required, Validators.minLength(3)]],
      counter_number: ["", [Validators.required, Validators.min(1)]],
      en_alt_image: ["", [Validators.required, Validators.minLength(3)]],
      ar_alt_image: ["", [Validators.required, Validators.minLength(3)]],
      // Note: main_image is handled separately as a file
    });
  }

  loadCounterData(id?: number) {
    const counterId = id || this.counterId() || 1;

    this.counterService.getCounter(counterId).subscribe({
      next: (data) => {
        this.counter = data.data;
        this.counterForm.patchValue({
          en_counter_title: this.counter.en_counter_title,
          ar_counter_title: this.counter.ar_counter_title,
          counter_number: this.counter.counter_number,
          main_image: this.counter.main_image,
          en_alt_image: this.counter.en_alt_image,
          ar_alt_image: this.counter.ar_alt_image,
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
    const formData = this.counterForm.value;

    if (this.isCreateMode()) {
      this.createCounter(formData);
    } else if (this.isEditMode()) {
      this.updateCounter();
    }
  }

  private createCounter(formData: Partial<ICounterData>) {
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

    this.counterService
      .addUpdateCounter(formData as ICounterData, this.selectedFile)
      .subscribe({
        next: (data) => {
          console.log("Create successful:", data);
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Counter created successfully",
          });
          this.router.navigate(["/dashboard/counters"]);
        },
        error: (error) => {
          console.error("Error creating counter:", error);
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Failed to create counter",
          });
          this.isLoading.set(false);
        },
      });
  }

  updateCounter() {
    this.isLoading.set(true);
    const formData = this.counterForm.value;
    console.log(formData);

    // Pass the selected file if user uploaded a new one
    this.counterService
      .addUpdateCounter(
        formData as ICounterData,
        this.selectedFile || undefined,
        this.counter.id
      )
      .subscribe({
        next: (data) => {
          console.log("Update successful:", data);
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Counter updated successfully",
          });
          this.loadCounterData(); // Reload to get updated data
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error("Error updating counter:", error);
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Failed to update counter",
          });
          this.isLoading.set(false);
        },
      });
  }

  onCancel() {
    this.router.navigate(["/dashboard/counters"]);
  }

  onEditCounter() {
    if (this.counterId()) {
      this.router.navigate(["../../edit", this.counterId()], {
        relativeTo: this.route,
      });
    }
  }
}
