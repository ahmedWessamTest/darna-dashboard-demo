import { DatePipe } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { baseUrl } from "@app/core/env";
import { ProjectFormService } from "@app/features/dashboard/project-form-id/res/project-form";
import { IProjectFormData } from "@app/features/dashboard/project-form-id/res/projectForm";
import { TableSharedModule } from "@app/theme/shared/module/shared/table-shared.module";
import { MessageService } from "primeng/api";
import { SelectModule } from "primeng/select";

@Component({
  selector: "app-project-form",
  imports: [TableSharedModule, SelectModule, DatePipe],
  templateUrl: "./project-form.html",
  styleUrl: "./project-form.scss",
})
export class ProjectForm implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private messageService = inject(MessageService);

  projectForm!: IProjectFormData[];
  allProjectForm!: IProjectFormData[]; // Store original data
  baseUrl = baseUrl;
  projectFormService = inject(ProjectFormService);
  checked: boolean = false;

  // Add loading state for each toggle
  loadingToggles = new Set<number>();

  // Read status options for dropdown
  readStatusOptions = [
    { label: "Read", value: 1 },
    { label: "Unread", value: 0 },
  ];

  // Selected read filter
  selectedReadFilter: number | null = null;

  getMode() {
    const mode = this.route.snapshot.queryParamMap.get("mode");
    return mode;
  }

  getSliderId() {
    const id = this.route.snapshot.queryParamMap.get("id");
    return id;
  }

  ngOnInit() {
    this.projectFormService.getProjectForm().subscribe((data) => {
      this.allProjectForm = data.data; // Store original data
      this.projectForm = data.data;
      console.log(this.projectForm[0]);
    });
  }

  returnStatus(status: number): boolean {
    if (status == 1) {
      return true;
    }
    return false;
  }

  // Check if a specific toggle is loading
  isToggleLoading(careerFormId: number): boolean {
    return this.loadingToggles.has(careerFormId);
  }

  onToggleChange(projectFormItem: IProjectFormData) {
    // Prevent multiple clicks while loading
    if (this.isToggleLoading(projectFormItem.id)) {
      return;
    }

    // Add loading state
    this.loadingToggles.add(projectFormItem.id);

    // Optimistically update the UI
    const newStatus = Number(projectFormItem.is_read) === 1 ? 0 : 1;
    projectFormItem.is_read = newStatus.toString();

    // Simple toggle completion - remove loading state immediately
    // You can implement actual API call here when service method is available
    setTimeout(() => {
      this.loadingToggles.delete(projectFormItem.id);

      // Show success notification
      this.messageService.add({
        severity: "success",
        summary: "Success",
        detail: `Career application marked as ${newStatus === 1 ? "read" : "unread"} successfully`,
      });
    }, 500);
  }

  onRead(id: number) {
    const projectFormItem = this.projectForm.find((item) => item.id === id);
    if (projectFormItem) {
      // For careers-form, we might want to both toggle and navigate
      this.onToggleChange(projectFormItem);
      // Navigate to the career form details view
      this.router.navigate(["/dashboard/project-form/view", id]);
    }
  }

  onEdit(id: number) {
    // Navigate to the career form edit view
    this.router.navigate(["/dashboard/project-form/edit", id]);
  }

  getStatusLabel(status: number): string {
    return status === 1 ? "Read" : "Unread";
  }

  getStatusSeverity(status: number): string {
    return status === 1 ? "success" : "warning";
  }

  // Handle read status filter change
  onReadFilter(statusValue: number | null) {
    if (statusValue === null || statusValue === undefined) {
      // Show all career forms when filter is cleared
      this.projectForm = [...this.allProjectForm];
    } else {
      // Filter career forms by read status
      this.projectForm = this.allProjectForm.filter(
        (form) => Number(form.is_read) === Number(statusValue)
      );
    }
  }
}
