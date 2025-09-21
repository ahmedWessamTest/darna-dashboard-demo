import { Routes } from "@angular/router";

export const partnersRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        loadComponent: () =>
          import("@app/features/dashboard/partners/partners/partners").then(
            (c) => c.Partners
          ),
      },
      {
        path: "view/:id",
        loadComponent: () =>
          import("@features/dashboard/partners/partners-id/partners-id").then(
            (c) => c.PartnersId
          ),
        data: { mode: "view" },
      },
      {
        path: "create",
        loadComponent: () =>
          import("@features/dashboard/partners/partners-id/partners-id").then(
            (c) => c.PartnersId
          ),
        data: { mode: "create" },
      },
      {
        path: "edit/:id",
        loadComponent: () =>
          import("@features/dashboard/partners/partners-id/partners-id").then(
            (c) => c.PartnersId
          ),
        data: { mode: "edit" },
      },
    ],
  },
];
