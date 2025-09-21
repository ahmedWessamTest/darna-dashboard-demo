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
import { TextareaModule } from "primeng/textarea";
import { ICareersFormData } from "../model";
import { CareersFormService } from "../service/careers-form";

@Component({
  selector: "app-careers-form-id",
  imports: [DetailsSharedModule, TextareaModule],
  templateUrl: "./careers-form.html",
  styleUrl: "./careers-form.scss",
  providers: [MessageService],
})
export class CareersFormId implements OnInit {
  private careersFormService = inject(CareersFormService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Signals for reactive state
  mode = signal<"view">("view");
  careerFormId = signal<number | null>(null);
  isLoading = signal(false);

  careerForm!: ICareersFormData;
  careerFormForm!: FormGroup;

  baseUrl = baseUrl;

  // Computed properties
  isViewMode = computed(() => this.mode() === "view");

  pageTitle = computed(() => {
    switch (this.mode()) {
      case "view":
        return "View Career Application";
      default:
        return "Career Application";
    }
  });

  // Effect to handle route changes
  routeEffect = effect(() => {
    const routeData = this.route.snapshot.data;
    const mode = routeData["mode"];
    if (mode) {
      this.mode.set(mode);
    }

    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.careerFormId.set(+id);
      this.loadCareerForm(+id);
    }
  });

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm() {
    this.careerFormForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(2)]],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", [Validators.required]],
      address: ["", [Validators.required]],
      experience: ["", [Validators.required]],
      current_salary: ["", [Validators.required]],
      expected_salary: ["", [Validators.required]],
      cover_letter: ["", [Validators.required]],
      is_read: [0],
    });
  }

  private loadCareerForm(id: number) {
    this.isLoading.set(true);
    this.careersFormService.getCareersForm(id).subscribe({
      next: (response) => {
        this.careerForm = response.data; // Fixed to use correct response structure
        this.populateForm();
        this.isLoading.set(false);

        // Mark as read if not already read
        if (this.careerForm.is_read === 0) {
          this.markAsRead(id);
        }
      },
      error: (error) => {
        console.error("Error loading career form:", error);
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to load career application",
        });
        this.isLoading.set(false);
      },
    });
  }

  private populateForm() {
    if (this.careerForm) {
      this.careerFormForm.patchValue({
        name: this.careerForm.name,
        email: this.careerForm.email,
        phone: this.careerForm.phone,
        address: this.careerForm.address,
        experience: this.careerForm.experience,
        current_salary: this.careerForm.current_salary,
        expected_salary: this.careerForm.expected_salary,
        cover_letter: this.careerForm.cover_letter,
        is_read: this.careerForm.is_read,
      });
    }
  }

  private markAsRead(id: number) {
    this.careersFormService.markAsRead(id).subscribe({
      next: () => {
        // Update local state
        if (this.careerForm) {
          this.careerForm.is_read = 1;
        }
      },
      error: (error) => {
        console.error("Error marking as read:", error);
      },
    });
  }

  onSubmit() {
    if (this.careerFormForm.valid && this.careerFormId()) {
      this.isLoading.set(true);
      const formData = this.careerFormForm.value;

      this.careersFormService
        .updateCareersForm(this.careerFormId()!, formData)
        .subscribe({
          next: (response) => {
            this.careerForm = response.data;
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: "Career application updated successfully",
            });
            this.isLoading.set(false);
            // Switch back to view mode
            this.mode.set("view");
          },
          error: (error) => {
            console.error("Error updating career form:", error);
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Failed to update career application",
            });
            this.isLoading.set(false);
          },
        });
    }
  }

  onCancel() {
    this.router.navigate(["/dashboard/careers-form"]);
  }

  onEditCareerForm() {
    if (this.careerFormId()) {
      this.router.navigate([
        "/dashboard/careers-form/edit",
        this.careerFormId(),
      ]);
    }
  }

  downloadCV() {
    if (this.careerForm?.cv_file) {
      // Open CV file in new window/tab for download
      window.open(this.baseUrl + this.careerForm.cv_file, "_blank");
    }
  }

  formatSalary(salary: string): string {
    // Add currency formatting if needed
    return salary ? `$${salary}` : "Not specified";
  }

  getReadStatus(): string {
    return this.careerForm?.is_read === 1 ? "Read" : "Unread";
  }

  getReadStatusSeverity(): string {
    return this.careerForm?.is_read === 1 ? "success" : "warning";
  }
}
