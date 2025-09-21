import { Component, inject, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { baseUrl } from "@app/core/env";
import { IPartnerData } from "@app/features/dashboard/partners/models/partners";
import { PartnersService } from "@app/features/dashboard/partners/services/partners";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { SelectModule } from "primeng/select";
import { SkeletonModule } from "primeng/skeleton";
import { TableModule } from "primeng/table";
import { ToggleSwitch } from "primeng/toggleswitch";
import { finalize } from "rxjs/operators";

@Component({
  selector: "app-partners",
  imports: [
    TableModule,
    RouterLink,
    FormsModule,
    ToggleSwitch,
    SkeletonModule,
    ButtonModule,
    SelectModule,
  ],
  templateUrl: "./partners.html",
  styleUrl: "./partners.scss",
})
export class Partners implements OnInit {
  private route = inject(ActivatedRoute);
  private messageService = inject(MessageService);

  partners!: IPartnerData[];
  allPartners!: IPartnerData[]; // Store original data
  baseUrl = baseUrl;
  partnersService = inject(PartnersService);
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
    this.partnersService.getPartners().subscribe((data) => {
      this.allPartners = data.data; // Store original data
      this.partners = data.data;
    });
  }

  returnStatus(status: number): boolean {
    if (status == 1) {
      return true;
    }
    return false;
  }

  // Check if a specific toggle is loading
  isToggleLoading(partnerId: number): boolean {
    return this.loadingToggles.has(partnerId);
  }

  onToggleChange(partner: IPartnerData) {
    // Prevent multiple clicks while loading
    if (this.isToggleLoading(partner.id)) {
      return;
    }

    // Add loading state
    this.loadingToggles.add(partner.id);

    // Optimistically update the UI
    const originalStatus = partner.active_status;
    const newStatus = Number(partner.active_status) === 1 ? "0" : "1";
    partner.active_status = newStatus;

    const apiCall =
      Number(originalStatus) === 1
        ? this.partnersService.disablePartner(partner.id)
        : this.partnersService.activePartner(partner.id);

    apiCall
      .pipe(
        finalize(() => {
          // Remove loading state when done
          this.loadingToggles.delete(partner.id);
        })
      )
      .subscribe({
        next: (response) => {
          // Update with server response if available
          if (response.data && response.data.length > 0) {
            const updatedPartner = response.data.find(
              (p) => p.id === partner.id
            );
            if (updatedPartner) {
              partner.active_status = updatedPartner.active_status;
            }
          }

          // Show success notification
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: `Partner ${Number(newStatus) === 1 ? "activated" : "deactivated"} successfully`,
          });
        },
        error: (error) => {
          // Revert optimistic update on error
          partner.active_status = originalStatus;
          console.error("Toggle failed:", error);

          // Show error notification
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Failed to update partner status",
          });
        },
      });
  }

  // Handle status filter change
  onStatusFilter(statusValue: number | null) {
    if (statusValue === null || statusValue === undefined) {
      // Show all partners when filter is cleared
      this.partners = [...this.allPartners];
    } else {
      // Filter partners by status
      this.partners = this.allPartners.filter(
        (partner) => Number(partner.active_status) === Number(statusValue)
      );
    }
  }

  // Keep original methods for backward compatibility
  onDelete(id: number) {
    const partner = this.partners.find((p) => p.id === id);
    if (partner) {
      this.onToggleChange(partner);
    }
  }

  onActive(id: number) {
    const partner = this.partners.find((p) => p.id === id);
    if (partner) {
      this.onToggleChange(partner);
    }
  }
}
