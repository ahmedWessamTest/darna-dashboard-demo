import { Component, inject, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { baseUrl } from "@app/core/env";
import { IData } from "@app/features/dashboard/hero/models";
import { HeroService } from "@app/features/dashboard/hero/services/hero";
import { NgxSpinnerService } from "ngx-spinner";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { SelectModule } from "primeng/select";
import { SkeletonModule } from "primeng/skeleton";
import { TableModule } from "primeng/table";
import { ToggleSwitch } from "primeng/toggleswitch";
import { finalize } from "rxjs/operators";

@Component({
  selector: "app-hero",
  imports: [
    TableModule,
    RouterLink,
    FormsModule,
    ToggleSwitch,
    SkeletonModule,
    ButtonModule,
    SelectModule,
  ],
  templateUrl: "./hero.html",
  styleUrl: "./hero.scss",
})
export class Hero implements OnInit {
  private route = inject(ActivatedRoute);
  private messageService = inject(MessageService);

  sliders!: IData[];
  allSliders!: IData[]; // Store original data
  baseUrl = baseUrl;
  heroService = inject(HeroService);
  checked: boolean = false;

  // Add loading state for each toggle
  loadingToggles = new Set<number>();
  spinner = inject(NgxSpinnerService);

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
    this.spinner.show();
    this.heroService.getSliders().subscribe((data) => {
      this.allSliders = data.data; // Store original data
      this.sliders = data.data;
      this.spinner.hide();
    });
  }

  returnStatus(status: number): boolean {
    if (status == 1) {
      return true;
    }
    return false;
  }

  // Check if a specific toggle is loading
  isToggleLoading(sliderId: number): boolean {
    return this.loadingToggles.has(sliderId);
  }

  onToggleChange(slider: IData) {
    // Prevent multiple clicks while loading
    if (this.isToggleLoading(slider.id)) {
      return;
    }

    // Add loading state
    this.loadingToggles.add(slider.id);

    // Optimistically update the UI
    const originalStatus = slider.active_status;
    const newStatus = Number(slider.active_status) === 1 ? "0" : "1";
    slider.active_status = newStatus;

    const apiCall =
      Number(originalStatus) === 1
        ? this.heroService.disableSlider(slider.id)
        : this.heroService.activeSlider(slider.id);

    apiCall
      .pipe(
        finalize(() => {
          // Remove loading state when done
          this.loadingToggles.delete(slider.id);
        })
      )
      .subscribe({
        next: (response) => {
          // Update with server response
          if (response.data && response.data.length > 0) {
            const updatedSlider = response.data.find((s) => s.id === slider.id);
            if (updatedSlider) {
              slider.active_status = updatedSlider.active_status;
            }
          }

          // Show success notification
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: `Hero slider ${Number(newStatus) === 1 ? "activated" : "deactivated"} successfully`,
          });
        },
        error: (error) => {
          // Revert optimistic update on error
          slider.active_status = originalStatus;
          console.error("Toggle failed:", error);

          // Show error notification
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Failed to update hero slider status",
          });
        },
      });
  }

  // Handle status filter change
  onStatusFilter(statusValue: number | null) {
    if (statusValue === null || statusValue === undefined) {
      // Show all sliders when filter is cleared
      this.sliders = [...this.allSliders];
    } else {
      // Filter sliders by status
      this.sliders = this.allSliders.filter(
        (slider) => Number(slider.active_status) === Number(statusValue)
      );
    }
  }
}
