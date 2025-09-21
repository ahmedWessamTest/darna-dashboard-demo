import { Routes } from "@angular/router";

export const seoRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        loadComponent: () =>
          import("@demo/dashboard/seo/seo").then((c) => c.Seo),
      },
      {
        path: "view/:id",
        loadComponent: () =>
          import("@features/dashboard/seo/seo-id/seo-id").then((c) => c.SeoId),
        data: { mode: "view" },
      },

      {
        path: "edit/:id",
        loadComponent: () =>
          import("@features/dashboard/seo/seo-id/seo-id").then((c) => c.SeoId),
        data: { mode: "edit" },
      },
    ],
  },
];
