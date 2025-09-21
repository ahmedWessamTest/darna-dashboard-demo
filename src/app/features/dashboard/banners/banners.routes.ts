import { Routes } from "@angular/router";

export const bannersRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        loadComponent: () =>
          import("@demo/dashboard/banners/banners").then((c) => c.Banners),
      },
      {
        path: "view/:id",
        loadComponent: () =>
          import("@features/dashboard/banners/banner-id/banner-id").then(
            (c) => c.BannerId
          ),
        data: { mode: "view" },
      },

      {
        path: "edit/:id",
        loadComponent: () =>
          import("@features/dashboard/banners/banner-id/banner-id").then(
            (c) => c.BannerId
          ),
        data: { mode: "edit" },
      },
    ],
  },
];
