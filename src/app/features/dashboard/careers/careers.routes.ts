import { Routes } from "@angular/router";

export const careersRoutes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("@demo/dashboard/careers/careers").then((m) => m.Careers),
  },
  {
    path: "view/:id",
    loadComponent: () =>
      import("@features/dashboard/careers/career-id/career-id").then(
        (c) => c.CareerId
      ),
    data: { mode: "view" },
  },
  {
    path: "create",
    loadComponent: () =>
      import("@features/dashboard/careers/career-id/career-id").then(
        (c) => c.CareerId
      ),
    data: { mode: "create" },
  },
  {
    path: "edit/:id",
    loadComponent: () =>
      import("@features/dashboard/careers/career-id/career-id").then(
        (c) => c.CareerId
      ),
    data: { mode: "edit" },
  },
];
