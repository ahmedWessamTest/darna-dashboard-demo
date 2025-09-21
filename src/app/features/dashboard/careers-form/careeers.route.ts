import { Route } from "@angular/router";

export const careersRoute: Route[] = [
  {
    path: "",
    children: [
      {
        path: "",
        loadComponent: () =>
          import("@demo/dashboard/careers-form/careers-form").then(
            (c) => c.CareersForm
          ),
      },
      {
        path: "view/:id",
        loadComponent: () =>
          import(
            "@app/features/dashboard/careers-form/careers-form-id/careers-form"
          ).then((c) => c.CareersFormId),
        data: { mode: "view" },
      },
    ],
  },
];
