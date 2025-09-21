import { Component, inject, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, RouterLink, RouterModule } from "@angular/router";
import { baseUrl } from "@app/core/env";
import { IDataTestimonials } from "@app/features/dashboard/testimonials/models/testimonials";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { SelectModule } from "primeng/select";
import { TableModule } from "primeng/table";
import { ToggleSwitch } from "primeng/toggleswitch";
import { finalize } from "rxjs/operators";
import { TestimonialsService } from "./../../../features/dashboard/testimonials/services/testimonials";

@Component({
  selector: "app-testimonials",
  imports: [
    TableModule,
    ButtonModule,
    RouterLink,
    RouterModule,
    ToggleSwitch,
    FormsModule,
    SelectModule,
  ],
  templateUrl: "./testimonials.html",
  styleUrl: "./testimonials.scss",
})
export class Testimonials implements OnInit {
  private route = inject(ActivatedRoute);
  private messageService = inject(MessageService);

  testimonials!: IDataTestimonials[];
  allTestimonials!: IDataTestimonials[]; // Store original data
  baseUrl = baseUrl;
  featureService = inject(TestimonialsService);
  checked: boolean = false;

  // Add loading state for each toggle
  loadingToggles = new Set<number>();

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
    this.featureService.getTestimonials().subscribe((data) => {
      this.allTestimonials = data.data; // Store original data
      this.testimonials = data.data;
    });
  }

  returnStatus(status: number): boolean {
    if (status == 1) {
      return true;
    }
    return false;
  }

  // Check if a specific toggle is loading
  isToggleLoading(testimonialId: number): boolean {
    return this.loadingToggles.has(testimonialId);
  }

  onToggleChange(testimonial: IDataTestimonials) {
    // Prevent multiple clicks while loading
    if (this.isToggleLoading(testimonial.id)) {
      return;
    }

    // Add loading state
    this.loadingToggles.add(testimonial.id);

    // Optimistically update the UI
    const originalStatus = testimonial.active_status;
    const newStatus = Number(testimonial.active_status) === 1 ? "0" : "1";
    testimonial.active_status = newStatus;

    const apiCall =
      Number(originalStatus) === 1
        ? this.featureService.disableTestimonials(testimonial.id)
        : this.featureService.activeTestimonials(testimonial.id);

    apiCall
      .pipe(
        finalize(() => {
          // Remove loading state when done
          this.loadingToggles.delete(testimonial.id);
        })
      )
      .subscribe({
        next: (response) => {
          // Update with server response
          if (response.data && response.data.length > 0) {
            const updatedTestimonial = response.data.find(
              (t) => t.id === testimonial.id
            );
            if (updatedTestimonial) {
              testimonial.active_status = updatedTestimonial.active_status;
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
          testimonial.active_status = originalStatus;
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
      // Show all testimonials when filter is cleared
      this.testimonials = [...this.allTestimonials];
    } else {
      // Filter testimonials by status
      this.testimonials = this.allTestimonials.filter(
        (testimonial) =>
          Number(testimonial.active_status) === Number(statusValue)
      );
    }
  }

  // Keep original method for backward compatibility if needed
  onActive(id: number) {
    const testimonial = this.testimonials.find((t) => t.id === id);
    if (testimonial) {
      this.onToggleChange(testimonial);
    }
  }
}
