import { Routes } from "@angular/router";

export const featuresRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        loadComponent: () =>
          import("@app/demo/dashboard/features/features").then(
            (c) => c.Features
          ),
      },
      {
        path: "view/:id",
        loadComponent: () =>
          import(
            "@features/dashboard/features/components/features-id/features-id"
          ).then((c) => c.FeaturesId),
        data: { mode: "view" },
      },
      {
        path: "create",
        loadComponent: () =>
          import(
            "@features/dashboard/features/components/features-id/features-id"
          ).then((c) => c.FeaturesId),
        data: { mode: "create" },
      },
      {
        path: "edit/:id",
        loadComponent: () =>
          import(
            "@features/dashboard/features/components/features-id/features-id"
          ).then((c) => c.FeaturesId),
        data: { mode: "edit" },
      },
    ],
  },
];
