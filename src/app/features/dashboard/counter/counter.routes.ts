import { Routes } from "@angular/router";

export const counterRoutes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("@demo/dashboard/counter/counter").then((m) => m.Counter),
  },
  {
    path: "view/:id",
    loadComponent: () =>
      import("@features/dashboard/counter/counter-id/counter-id").then(
        (c) => c.Counter
      ),
    data: { mode: "view" },
  },
  {
    path: "create",
    loadComponent: () =>
      import("@features/dashboard/counter/counter-id/counter-id").then(
        (c) => c.Counter
      ),
    data: { mode: "create" },
  },
  {
    path: "edit/:id",
    loadComponent: () =>
      import("@features/dashboard/counter/counter-id/counter-id").then(
        (c) => c.Counter
      ),
    data: { mode: "edit" },
  },
];
