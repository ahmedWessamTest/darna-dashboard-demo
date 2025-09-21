import { Component, inject, OnInit, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { baseUrl } from "@app/core/env";
import { DetailsSharedModule } from "@app/theme/shared/module/shared/details-shared.module";
import { MessageService } from "primeng/api";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { ProjectFormService } from "./res/project-form";
import { IProjectFormData } from "./res/projectForm";

@Component({
  selector: "app-project-form-id",
  imports: [DetailsSharedModule, ProgressSpinnerModule],
  templateUrl: "./project-form-id.html",
  styleUrl: "./project-form-id.scss",
  providers: [MessageService],
})
export class ProjectFormId implements OnInit {
  private projectFormService = inject(ProjectFormService);
  private messageService = inject(MessageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  projectFormId = signal<number | null>(null);
  isLoading = signal(false);
  projectForm = signal<IProjectFormData | null>(null);
  baseUrl = baseUrl;

  ngOnInit() {
    this.setupRouteHandling();
  }

  private setupRouteHandling() {
    // Get route params for ID
    this.route.params.subscribe((params) => {
      const id = params["id"];
      if (id) {
        this.projectFormId.set(+id);
        this.loadProjectFormData(+id);
      }
    });
  }

  loadProjectFormData(id?: number) {
    const projectFormId = id || this.projectFormId() || 1;
    this.isLoading.set(true);

    this.projectFormService.getProjectFormDetails(projectFormId).subscribe({
      next: (data) => {
        this.projectForm.set(data.data);
        this.isLoading.set(false);

        // Mark as read if not already read
        if (data.data.is_read !== "1") {
          this.markAsRead();
        }
      },
      error: (error) => {
        console.error("Error loading project form data:", error);
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to load project form data",
        });
        this.isLoading.set(false);
      },
    });
  }

  private markAsRead() {
    // Note: You'll need to add this method to the service
    // For now, just update local state
    const currentForm = this.projectForm();
    if (currentForm) {
      this.projectForm.set({
        ...currentForm,
        is_read: "1",
      });
    }
  }

  onBack() {
    this.router.navigate(["/dashboard/project-form"]);
  }

  getReadStatus(): string {
    return this.projectForm()?.is_read === "1" ? "Read" : "Unread";
  }

  getReadStatusSeverity(): string {
    return this.projectForm()?.is_read === "1" ? "success" : "warning";
  }

  formatDate(dateString: string): string {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
}
