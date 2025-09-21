import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { baseUrl } from "@app/core/env";
import { IProjectResponse } from "@app/features/dashboard/projects/model";
import { ProjectsService } from "@app/features/dashboard/projects/service/projects";
import { TableSharedModule } from "@app/theme/shared/module/shared/table-shared.module";
import { MessageService } from "primeng/api";
import { InputTextModule } from "primeng/inputtext";
import { PaginatorModule, PaginatorState } from "primeng/paginator";
import { SelectModule } from "primeng/select";
import { finalize } from "rxjs/operators";

@Component({
  selector: "app-projects",
  imports: [TableSharedModule, SelectModule, InputTextModule, PaginatorModule],
  templateUrl: "./projects.html",
  styleUrl: "./projects.scss",
})
export class Projects implements OnInit {
  private route = inject(ActivatedRoute);
  private messageService = inject(MessageService);

  projects!: IProjectResponse[];
  allProjects!: IProjectResponse[]; // Store original data
  filteredProjects!: IProjectResponse[]; // Store filtered data for display

  baseUrl = baseUrl;
  projectService = inject(ProjectsService);
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

  // Search functionality
  searchTerm: string = "";

  // Pagination properties
  first: number = 0;
  rows: number = 10;
  totalRecords: number = 0;
  rowsPerPageOptions: number[] = [10, 50, 100, 200];

  // Get pagination options with "All" option
  get paginationOptions(): number[] {
    if (this.rowsPerPageOptions.length === 0) {
      // If no options specified, return empty array (no dropdown)
      return [];
    }

    const options = [...this.rowsPerPageOptions];
    // Only add "All" option if we have records and want to show it
    if (
      this.totalRecords > 0 &&
      this.totalRecords > Math.max(...this.rowsPerPageOptions)
    ) {
      options.push(this.totalRecords);
    }
    return options;
  }

  getMode() {
    const mode = this.route.snapshot.queryParamMap.get("mode");
    return mode;
  }

  getSliderId() {
    const id = this.route.snapshot.queryParamMap.get("id");
    return id;
  }

  ngOnInit() {
    this.projectService.getProjects().subscribe((data) => {
      this.allProjects = data.data; // Store original data
      this.projects = data.data;
      this.applyFilters(); // Apply initial filters
      console.log(this.projects[0]);
    });
  }

  returnStatus(status: number): boolean {
    if (status == 1) {
      return true;
    }
    return false;
  }

  // Check if a specific toggle is loading
  isToggleLoading(projectId: number): boolean {
    return this.loadingToggles.has(projectId);
  }

  // Apply all filters (search + status)
  applyFilters() {
    let filtered = [...this.allProjects];

    // Apply search filter
    if (this.searchTerm.trim()) {
      filtered = filtered.filter((project) =>
        project.en_project_name
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (
      this.selectedStatusFilter !== null &&
      this.selectedStatusFilter !== undefined
    ) {
      filtered = filtered.filter(
        (project) =>
          Number(project.active_status) === Number(this.selectedStatusFilter)
      );
    }

    this.filteredProjects = filtered;
    this.totalRecords = filtered.length;
    this.updateDisplayedProjects();
  }

  // Update displayed projects based on pagination
  updateDisplayedProjects() {
    if (this.rows >= this.totalRecords || this.rows === -1) {
      // Show all records when "All" is selected or rows >= totalRecords
      this.projects = [...this.filteredProjects];
    } else {
      // Apply pagination
      const startIndex = this.first;
      const endIndex = this.first + this.rows;
      this.projects = this.filteredProjects.slice(startIndex, endIndex);
    }
  }

  // Handle search input
  onSearch() {
    this.first = 0; // Reset to first page
    this.applyFilters();
  }

  // Handle pagination
  onPageChange(event: PaginatorState) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
    this.updateDisplayedProjects();
  }

  onToggleChange(project: IProjectResponse) {
    // Prevent multiple clicks while loading
    if (this.isToggleLoading(project.id)) {
      return;
    }

    // Add loading state
    this.loadingToggles.add(project.id);

    // Optimistically update the UI
    const originalStatus = project.active_status;
    const newStatus = Number(project.active_status) === 1 ? "0" : "1";
    project.active_status = newStatus;

    // Update in both arrays
    const allProjectIndex = this.allProjects.findIndex(
      (p) => p.id === project.id
    );
    if (allProjectIndex !== -1) {
      this.allProjects[allProjectIndex].active_status = newStatus;
    }

    const apiCall =
      Number(originalStatus) === 1
        ? this.projectService.disableProject(project.id)
        : this.projectService.activeProject(project.id);

    apiCall
      .pipe(
        finalize(() => {
          // Remove loading state when done
          this.loadingToggles.delete(project.id);
        })
      )
      .subscribe({
        next: (response) => {
          // Update with server response if available
          if (response.data && response.data.length > 0) {
            const updatedProject = response.data.find(
              (p) => p.id === project.id
            );
            if (updatedProject) {
              project.active_status = updatedProject.active_status;
              // Update in allProjects as well
              if (allProjectIndex !== -1) {
                this.allProjects[allProjectIndex].active_status =
                  updatedProject.active_status;
              }
            }
          }

          // Reapply filters to update the display
          this.applyFilters();

          // Show success notification
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: `Project ${Number(newStatus) === 1 ? "activated" : "deactivated"} successfully`,
          });
        },
        error: (error) => {
          // Revert optimistic update on error
          project.active_status = originalStatus;
          if (allProjectIndex !== -1) {
            this.allProjects[allProjectIndex].active_status = originalStatus;
          }

          // Reapply filters to update the display
          this.applyFilters();

          console.error("Toggle failed:", error);

          // Show error notification
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Failed to update project status",
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
    this.selectedStatusFilter = statusValue;
    this.first = 0; // Reset to first page
    this.applyFilters();
  }

  // Handle status change from dropdown
  onStatusChange(projectId: number) {
    const project = this.allProjects.find((p) => p.id === projectId);
    if (project) {
      this.onToggleChange(project);
    }
  }

  // Refresh data and reapply filter
  private refreshData() {
    this.projectService.getProjects().subscribe((data) => {
      this.allProjects = data.data;
      // Reapply current filters
      this.applyFilters();
    });
  }

  onDelete(id: number) {
    const project = this.allProjects.find((p) => p.id === id);
    if (project) {
      this.onToggleChange(project);
    }
  }

  onActive(id: number) {
    const project = this.allProjects.find((p) => p.id === id);
    if (project) {
      this.onToggleChange(project);
    }
  }
}
