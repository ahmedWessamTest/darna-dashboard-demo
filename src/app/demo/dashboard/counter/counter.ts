import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { baseUrl } from "@app/core/env";
import { ICounterData } from "@app/features/dashboard/counter/models";
import { CounterService } from "@app/features/dashboard/counter/service/counter";
import { TableSharedModule } from "@app/theme/shared/module/shared/table-shared.module";
import { MessageService } from "primeng/api";
import { SelectModule } from "primeng/select";
import { finalize } from "rxjs/operators";

@Component({
  selector: "app-counter",
  imports: [TableSharedModule, SelectModule],
  templateUrl: "./counter.html",
  styleUrl: "./counter.scss",
})
export class Counter implements OnInit {
  private route = inject(ActivatedRoute);
  private messageService = inject(MessageService);

  counters: ICounterData[] = []; // Initialize as empty array
  allCounters: ICounterData[] = []; // Initialize as empty array

  baseUrl = baseUrl;
  counterService = inject(CounterService);
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
    this.counterService.getCounters().subscribe((data) => {
      this.allCounters = data.data;
      this.counters = data.data;
    });
  }

  returnStatus(status: number): boolean {
    if (status == 1) {
      return true;
    }
    return false;
  }

  // Check if a specific toggle is loading
  isToggleLoading(counterId: number): boolean {
    return this.loadingToggles.has(counterId);
  }

  onToggleChange(counter: ICounterData) {
    // Prevent multiple clicks while loading
    if (this.isToggleLoading(counter.id)) {
      return;
    }

    // Add loading state
    this.loadingToggles.add(counter.id);

    // Optimistically update the UI
    const originalStatus = counter.active_status;
    const newStatus = Number(counter.active_status) === 1 ? 0 : 1;
    counter.active_status = newStatus;

    // Update in both arrays
    const allCounterIndex = this.allCounters.findIndex(
      (c) => c.id === counter.id
    );
    if (allCounterIndex !== -1) {
      this.allCounters[allCounterIndex].active_status = newStatus;
    }

    const apiCall =
      Number(originalStatus) === 1
        ? this.counterService.disableCounter(counter.id)
        : this.counterService.activeCounter(counter.id);

    apiCall
      .pipe(
        finalize(() => {
          // Remove loading state when done
          this.loadingToggles.delete(counter.id);
        })
      )
      .subscribe({
        next: (response) => {
          // Update with server response if available
          if (response.data && response.data.length > 0) {
            const updatedCounter = response.data.find(
              (c) => c.id === counter.id
            );
            if (updatedCounter) {
              counter.active_status = updatedCounter.active_status;
              // Update in allCounters as well
              if (allCounterIndex !== -1) {
                this.allCounters[allCounterIndex].active_status =
                  updatedCounter.active_status;
              }
            }
          }

          // Show success notification
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: `Counter ${newStatus === 1 ? "activated" : "deactivated"} successfully`,
          });
        },
        error: (error) => {
          // Revert optimistic update on error
          counter.active_status = originalStatus;
          if (allCounterIndex !== -1) {
            this.allCounters[allCounterIndex].active_status = originalStatus;
          }
          console.error("Toggle failed:", error);

          // Show error notification
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Failed to update counter status",
          });
        },
      });
  }

  // Get status option for dropdown display
  getStatusOption(status: number): number {
    return status;
  }

  // Handle status filter change
  onStatusFilter(statusValue: number | null) {
    if (statusValue === null || statusValue === undefined) {
      // Show all counters when filter is cleared
      this.counters = [...this.allCounters];
    } else {
      // Filter counters by status
      this.counters = this.allCounters.filter(
        (counter) => Number(counter.active_status) === Number(statusValue)
      );
    }
  }

  // Handle status change from dropdown
  onStatusChange(counterId: number) {
    const counter = this.allCounters.find((c) => c.id === counterId);
    if (counter) {
      this.onToggleChange(counter);
    }
  }

  onDelete(id: number) {
    const counter = this.allCounters.find((c) => c.id === id);
    if (counter) {
      this.onToggleChange(counter);
    }
  }

  onActive(id: number) {
    const counter = this.allCounters.find((c) => c.id === id);
    if (counter) {
      this.onToggleChange(counter);
    }
  }
}
