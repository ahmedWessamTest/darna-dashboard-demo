import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { baseUrl } from "@app/core/env";
import { ICareer } from "@app/features/dashboard/careers/model/career";
import { CareersService } from "@app/features/dashboard/careers/services/careers";
import { TableSharedModule } from "@app/theme/shared/module/shared/table-shared.module";
import { MessageService } from "primeng/api";
import { SelectModule } from "primeng/select";
import { finalize } from "rxjs/operators";

@Component({
  selector: "app-careers",
  imports: [TableSharedModule, SelectModule],
  templateUrl: "./careers.html",
  styleUrl: "./careers.scss",
})
export class Careers implements OnInit {
  private route = inject(ActivatedRoute);
  private messageService = inject(MessageService);

  careers!: ICareer[];
  allCareers!: ICareer[]; // Store original data
  baseUrl = baseUrl;
  heroService = inject(CareersService);
  checked: boolean = false;

  // Add loading state for each toggle
  loadingToggles = new Set<string>(); // Using string since careers use slug

  // Status options for dropdown
  statusOptions = [
    { label: "Active", value: 1 },
    { label: "Inactive", value: 0 },
  ];

  // Selected status filter
  selectedStatusFilter: number | null = null;

  getMode() {
    const mode = this.route.snapshot.queryParamMap.get("mode");
    return mode;
  }

  getSliderId() {
    const id = this.route.snapshot.queryParamMap.get("id");
    return id;
  }

  ngOnInit() {
    this.heroService.getCareers().subscribe((data) => {
      this.allCareers = data.data; // Store original data
      this.careers = data.data;
      console.log(this.careers[0]);
    });
  }

  returnStatus(status: number): boolean {
    if (status == 1) {
      return true;
    }
    return false;
  }

  // Check if a specific toggle is loading (using slug)
  isToggleLoading(careerSlug: string): boolean {
    return this.loadingToggles.has(careerSlug);
  }

  onToggleChange(career: ICareer) {
    // Prevent multiple clicks while loading
    if (this.isToggleLoading(career.en_slug)) {
      return;
    }

    // Add loading state
    this.loadingToggles.add(career.en_slug);

    // Optimistically update the UI
    const originalStatus = career.active_status;
    const newStatus = Number(career.active_status) === 1 ? 0 : 1;
    career.active_status = newStatus;

    const apiCall =
      Number(originalStatus) === 1
        ? this.heroService.disableCareer(career.id)
        : this.heroService.activeCareer(career.id);

    apiCall
      .pipe(
        finalize(() => {
          // Remove loading state when done
          this.loadingToggles.delete(career.en_slug);
        })
      )
      .subscribe({
        next: (response) => {
          // Update with server response if available
          if (response.data && response.data.length > 0) {
            const updatedCareer = response.data.find((c) => c.id === career.id);
            if (updatedCareer) {
              career.active_status = updatedCareer.active_status;
            }
          }

          // Show success notification
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: `Career ${newStatus === 1 ? "activated" : "deactivated"} successfully`,
          });
        },
        error: (error) => {
          // Revert optimistic update on error
          career.active_status = originalStatus;
          console.error("Toggle failed:", error);

          // Show error notification
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Failed to update career status",
          });
        },
      });
  }

  onDelete(id: number) {
    const career = this.careers.find((c) => c.id === id);
    if (career) {
      this.onToggleChange(career);
    }
  }

  onActive(slug: string) {
    const career = this.careers.find((c) => c.en_slug === slug);
    if (career) {
      this.onToggleChange(career);
    }
  }

  // Handle status filter change
  onStatusFilter(statusValue: number | null) {
    if (statusValue === null || statusValue === undefined) {
      // Show all careers when filter is cleared
      this.careers = [...this.allCareers];
    } else {
      // Filter careers by status
      this.careers = this.allCareers.filter(
        (career) => Number(career.active_status) === Number(statusValue)
      );
    }
  }
}
