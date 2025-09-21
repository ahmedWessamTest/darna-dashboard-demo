import { Route } from "@angular/router";

export const projectFormRoute: Route[] = [
  {
    path: "",
    children: [
      {
        path: "",
        loadComponent: () =>
          import("@demo/dashboard/project-form/project-form").then(
            (c) => c.ProjectForm
          ),
      },
      {
        path: "view/:id",
        loadComponent: () =>
          import(
            "@app/features/dashboard/project-form-id/project-form-id"
          ).then((c) => c.ProjectFormId),
        data: { mode: "view" },
      },
    ],
  },
];
