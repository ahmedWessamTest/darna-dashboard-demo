import { Routes } from "@angular/router";

export const projectsRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        loadComponent: () =>
          import("@demo/dashboard/projects/projects").then((c) => c.Projects),
      },
      {
        path: "view/:id",
        loadComponent: () =>
          import("@features/dashboard/projects/project-id/project-id").then(
            (c) => c.ProjectId
          ),
        data: { mode: "view" },
      },
      {
        path: "create",
        loadComponent: () =>
          import("@features/dashboard/projects/project-id/project-id").then(
            (c) => c.ProjectId
          ),
        data: { mode: "create" },
      },
      {
        path: "edit/:id",
        loadComponent: () =>
          import("@features/dashboard/projects/project-id/project-id").then(
            (c) => c.ProjectId
          ),
        data: { mode: "edit" },
      },
    ],
  },
];
