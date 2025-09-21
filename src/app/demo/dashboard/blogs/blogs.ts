import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { baseUrl } from "@app/core/env";
import { IBlogData } from "@app/features/dashboard/blogs/model/blog";
import { BlogService } from "@app/features/dashboard/blogs/service/blog";
import { TableSharedModule } from "@app/theme/shared/module/shared/table-shared.module";
import { MessageService } from "primeng/api";
import { InputTextModule } from "primeng/inputtext";
import { PaginatorModule, PaginatorState } from "primeng/paginator";
import { SelectModule } from "primeng/select";
import { finalize } from "rxjs/operators";

@Component({
  selector: "app-blogs",
  imports: [TableSharedModule, SelectModule, InputTextModule, PaginatorModule],
  templateUrl: "./blogs.html",
  styleUrl: "./blogs.scss",
})
export class Blogs implements OnInit {
  private route = inject(ActivatedRoute);
  private messageService = inject(MessageService);

  blogs!: IBlogData[];
  allBlogs!: IBlogData[]; // Store original data
  filteredBlogs!: IBlogData[]; // Store filtered data for display

  baseUrl = baseUrl;
  blogService = inject(BlogService);
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
    this.blogService.getBlogs().subscribe((data) => {
      this.allBlogs = data.data; // Store original data
      this.blogs = data.data;
      this.applyFilters(); // Apply initial filters
      console.log(this.blogs[0]);
    });
  }

  returnStatus(status: number): boolean {
    if (status == 1) {
      return true;
    }
    return false;
  }

  // Check if a specific toggle is loading
  isToggleLoading(blogId: number): boolean {
    return this.loadingToggles.has(blogId);
  }

  // Apply all filters (search + status)
  applyFilters() {
    let filtered = [...this.allBlogs];

    // Apply search filter
    if (this.searchTerm.trim()) {
      filtered = filtered.filter((blog) =>
        blog.en_blog_title.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (
      this.selectedStatusFilter !== null &&
      this.selectedStatusFilter !== undefined
    ) {
      filtered = filtered.filter(
        (blog) =>
          Number(blog.active_status) === Number(this.selectedStatusFilter)
      );
    }

    this.filteredBlogs = filtered;
    this.totalRecords = filtered.length;
    this.updateDisplayedBlogs();
  }

  // Update displayed blogs based on pagination
  updateDisplayedBlogs() {
    if (this.rows >= this.totalRecords || this.rows === -1) {
      // Show all records when "All" is selected or rows >= totalRecords
      this.blogs = [...this.filteredBlogs];
    } else {
      // Apply pagination
      const startIndex = this.first;
      const endIndex = this.first + this.rows;
      this.blogs = this.filteredBlogs.slice(startIndex, endIndex);
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
    this.updateDisplayedBlogs();
  }

  onToggleChange(blog: IBlogData) {
    // Prevent multiple clicks while loading
    if (this.isToggleLoading(blog.id)) {
      return;
    }

    // Add loading state
    this.loadingToggles.add(blog.id);

    // Optimistically update the UI
    const originalStatus = blog.active_status;
    const newStatus = Number(blog.active_status) === 1 ? "0" : "1";
    blog.active_status = newStatus;

    // Update in both arrays
    const allBlogIndex = this.allBlogs.findIndex((b) => b.id === blog.id);
    if (allBlogIndex !== -1) {
      this.allBlogs[allBlogIndex].active_status = newStatus;
    }

    const apiCall =
      Number(originalStatus) === 1
        ? this.blogService.disableBlog(blog.id)
        : this.blogService.activeBlog(blog.id);

    apiCall
      .pipe(
        finalize(() => {
          // Remove loading state when done
          this.loadingToggles.delete(blog.id);
        })
      )
      .subscribe({
        next: (response) => {
          // Update with server response if available
          if (response.data && response.data.length > 0) {
            const updatedBlog = response.data.find((b) => b.id === blog.id);
            if (updatedBlog) {
              blog.active_status = updatedBlog.active_status;
              // Update in allBlogs as well
              if (allBlogIndex !== -1) {
                this.allBlogs[allBlogIndex].active_status =
                  updatedBlog.active_status;
              }
            }
          }

          // Reapply filters to update the display
          this.applyFilters();

          // Show success notification
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: `Blog ${Number(newStatus) === 1 ? "activated" : "deactivated"} successfully`,
          });
        },
        error: (error) => {
          // Revert optimistic update on error
          blog.active_status = originalStatus;
          if (allBlogIndex !== -1) {
            this.allBlogs[allBlogIndex].active_status = originalStatus;
          }

          // Reapply filters to update the display
          this.applyFilters();

          console.error("Toggle failed:", error);

          // Show error notification
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Failed to update blog status",
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
  onStatusChange(blogId: number) {
    const blog = this.allBlogs.find((b) => b.id === blogId);
    if (blog) {
      this.onToggleChange(blog);
    }
  }

  // Refresh data and reapply filter
  private refreshData() {
    this.blogService.getBlogs().subscribe((data) => {
      this.allBlogs = data.data;
      // Reapply current filters
      this.applyFilters();
    });
  }

  onDelete(id: number) {
    const blog = this.allBlogs.find((b) => b.id === id);
    if (blog) {
      this.onToggleChange(blog);
    }
  }

  onActive(id: number) {
    const blog = this.allBlogs.find((b) => b.id === id);
    if (blog) {
      this.onToggleChange(blog);
    }
  }
}
