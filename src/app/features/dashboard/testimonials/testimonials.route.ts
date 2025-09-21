import { Routes } from "@angular/router";

export const testimonialsRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        loadComponent: () =>
          import("@app/demo/dashboard/testimonials/testimonials").then(
            (c) => c.Testimonials
          ),
      },
      {
        path: "view/:id",
        loadComponent: () =>
          import(
            "@features/dashboard/testimonials/testimonials-id/testimonials-id"
          ).then((c) => c.TestimonialsId),
        data: { mode: "view" },
      },
      {
        path: "create",
        loadComponent: () =>
          import(
            "@features/dashboard/testimonials/testimonials-id/testimonials-id"
          ).then((c) => c.TestimonialsId),
        data: { mode: "create" },
      },
      {
        path: "edit/:id",
        loadComponent: () =>
          import(
            "@features/dashboard/testimonials/testimonials-id/testimonials-id"
          ).then((c) => c.TestimonialsId),
        data: { mode: "edit" },
      },
    ],
  },
];
