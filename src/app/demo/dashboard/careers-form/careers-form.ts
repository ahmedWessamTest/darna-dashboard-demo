import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { baseUrl } from "@app/core/env";
import { ICareersFormData } from "@app/features/dashboard/careers-form/model";
import { CareersFormService } from "@app/features/dashboard/careers-form/service/careers-form";
import { TableSharedModule } from "@app/theme/shared/module/shared/table-shared.module";
import { MessageService } from "primeng/api";
import { SelectModule } from "primeng/select";

@Component({
  selector: "app-careers-form",
  imports: [TableSharedModule, SelectModule],
  templateUrl: "./careers-form.html",
  styleUrl: "./careers-form.scss",
})
export class CareersForm implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private messageService = inject(MessageService);

  careerForm!: ICareersFormData[];
  allCareerForm!: ICareersFormData[]; // Store original data
  baseUrl = baseUrl;
  careerFormService = inject(CareersFormService);
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
    this.careerFormService.getCareersFormList().subscribe((data) => {
      this.allCareerForm = data.data; // Store original data
      this.careerForm = data.data;
      console.log(this.careerForm[0]);
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

  onToggleChange(careerFormItem: ICareersFormData) {
    // Prevent multiple clicks while loading
    if (this.isToggleLoading(careerFormItem.id)) {
      return;
    }

    // Add loading state
    this.loadingToggles.add(careerFormItem.id);

    // Optimistically update the UI
    const newStatus = Number(careerFormItem.is_read) === 1 ? 0 : 1;
    careerFormItem.is_read = newStatus;

    // Simple toggle completion - remove loading state immediately
    // You can implement actual API call here when service method is available
    setTimeout(() => {
      this.loadingToggles.delete(careerFormItem.id);

      // Show success notification
      this.messageService.add({
        severity: "success",
        summary: "Success",
        detail: `Career application marked as ${newStatus === 1 ? "read" : "unread"} successfully`,
      });
    }, 500);
  }

  onRead(id: number) {
    const careerFormItem = this.careerForm.find((item) => item.id === id);
    if (careerFormItem) {
      // For careers-form, we might want to both toggle and navigate
      this.onToggleChange(careerFormItem);
      // Navigate to the career form details view
      this.router.navigate(["/dashboard/careers-form/view", id]);
    }
  }

  onEdit(id: number) {
    // Navigate to the career form edit view
    this.router.navigate(["/dashboard/careers-form/edit", id]);
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
      this.careerForm = [...this.allCareerForm];
    } else {
      // Filter career forms by read status
      this.careerForm = this.allCareerForm.filter(
        (form) => Number(form.is_read) === Number(statusValue)
      );
    }
  }
}
