import { Routes } from "@angular/router";

export const blogRoutes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("@demo/dashboard/blogs/blogs").then((m) => m.Blogs),
  },
  {
    path: "view/:id",
    loadComponent: () =>
      import("@features/dashboard/blogs/blog-id/blog-id").then((c) => c.BlogId),
    data: { mode: "view" },
  },
  {
    path: "create",
    loadComponent: () =>
      import("@features/dashboard/blogs/blog-id/blog-id").then((c) => c.BlogId),
    data: { mode: "create" },
  },
  {
    path: "edit/:id",
    loadComponent: () =>
      import("@features/dashboard/blogs/blog-id/blog-id").then((c) => c.BlogId),
    data: { mode: "edit" },
  },
];
